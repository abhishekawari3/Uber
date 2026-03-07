// services/ride.service.ts

import { calculateDistance, validateGeoPoint } from "../utils/geo.utils.js";
import { calculateFare } from "../utils/fare.utils.js";
import type { Types } from "mongoose";
import { ValidationError,NotFoundError,ConflictError, } from "../errors/app.errors.js";
import Ride from "./rides.model.js";
import { Driver } from "../driver/driver.model.js";
import type{ IGeoPoint, IRide } from './rides.types.js';
import type{ IDriver } from './../driver/driver.types.js';

interface RideRequestData {
  rider_id: Types.ObjectId;
  pickup_location: IGeoPoint;
  drop_location: IGeoPoint;
  vehicle_type?: string;
}

interface RideResult {
  ride: IRide;
  driver: IDriver;
  nearby_drivers_count: number;
}

const SEARCH_RADIUS_KM = 5;
const MAX_DRIVERS = 10;
const VALID_VEHICLE_TYPES = ["Go", "X", "Xl", "Black", "BlackXl"];

/**
 * Validate ride request data
 */
const validateRequest = (
  pickup: IGeoPoint,
  drop: IGeoPoint,
  vehicleType: string
): void => {
  // Geo validation
  const pickupCheck = validateGeoPoint(pickup, "pickup_location");
  if (!pickupCheck.valid) throw new ValidationError(pickupCheck.message!);

  const dropCheck = validateGeoPoint(drop, "drop_location");
  if (!dropCheck.valid) throw new ValidationError(dropCheck.message!);

  // Same location check
  if (
    pickup.coordinates[0] === drop.coordinates[0] &&
    pickup.coordinates[1] === drop.coordinates[1]
  ) {
    throw new ValidationError("Pickup and drop locations cannot be the same");
  }

  // Vehicle type validation
  if (!VALID_VEHICLE_TYPES.includes(vehicleType)) {
    throw new ValidationError(
      `vehicle_type must be one of: ${VALID_VEHICLE_TYPES.join(", ")}`
    );
  }
};

/**
 * Check for existing active rides
 */
const checkExistingRide = async (riderId: Types.ObjectId): Promise<void> => {
  const activeRide = await Ride.findOne({
    rider_id: riderId,
    status: { $in: ["requested", "accepted", "started"] },
  });

  if (activeRide) {
    throw new ConflictError(
      "You already have an active ride. Complete or cancel it first."
    );
  }
};

/**
 * Find nearest available driver using aggregation
 */
// services/ride.service.ts

const findNearestDriver = async (
  pickupLocation: IGeoPoint,
  vehicleType: string
): Promise<{ driver: IDriver; count: number }> => {

  let drivers = await Driver.aggregate<IDriver>([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: pickupLocation.coordinates,
        },
        distanceField: "dist_in_meters",
        maxDistance: SEARCH_RADIUS_KM * 1000,
        query: {
          is_available: true,
          vehicle_type: vehicleType,
        },
        spherical: true,
      },
    },
    { $limit: MAX_DRIVERS },
  ]);

  let count = drivers.length;

  if (!drivers.length) {
    drivers = await Driver.aggregate<IDriver>([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: pickupLocation.coordinates,
          },
          distanceField: "dist_in_meters",
          maxDistance: SEARCH_RADIUS_KM * 1000,
          query: { is_available: true },
          spherical: true,
        },
      },
      { $limit: MAX_DRIVERS },
    ]);
    count = drivers.length;
  }

  // ✅ FIX: Guard on drivers[0] directly
  //    TypeScript now narrows it from IDriver | undefined → IDriver
  const closestDriver = drivers[0];

  if (!closestDriver) {
    throw new NotFoundError(
      `No drivers available within ${SEARCH_RADIUS_KM} km of your pickup`
    );
  }

  return { driver: closestDriver, count };
};

/**
 * Main service function to request a ride
 */
export const createRideRequest = async (
  data: RideRequestData
): Promise<RideResult> => {
  const {
    rider_id,
    pickup_location,
    drop_location,
    vehicle_type = "Go",
  } = data;

  // 1. Validate
  validateRequest(pickup_location, drop_location, vehicle_type);

  // 2. Check existing
  await checkExistingRide(rider_id);

  // 3. Calculate distance & fare
  const distance = calculateDistance(pickup_location, drop_location);
  const surgeMultiplier = 1; // TODO: implement surge logic
  const { base_fare, total_fare } = calculateFare(
    vehicle_type,
    distance,
    surgeMultiplier
  );

  // 4. Find driver
  const { driver, count } = await findNearestDriver(
    pickup_location,
    vehicle_type
  );

  // 5. Create ride
  const ride = await Ride.create({
    rider_id,
    driver_id: driver._id,
    pickup_location: {
      type: "Point",
      coordinates: pickup_location.coordinates,
    },
    drop_location: {
      type: "Point",
      coordinates: drop_location.coordinates,
    },
    distance,
    base_fare,
    surge_multiplier: surgeMultiplier,
    total_fare,
    status: "requested",
    created_at: new Date(),
  });

  // 6. Mark driver unavailable
  await Driver.findByIdAndUpdate(driver._id, {
    is_available: false,
  });

  return {
    ride,
    driver,
    nearby_drivers_count: count,
  };
};