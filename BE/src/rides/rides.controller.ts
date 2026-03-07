// controllers/ride.controller.ts

import type { Request, Response, NextFunction } from "express";
import { createRideRequest } from "./rides.service.js";

/**
 * @desc    Request a new ride
 * @route   POST /api/rides/request
 * @access  Private (rider)
 */
export const requestRide = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Auth check
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    // 2. Input presence check — service handles business validation
    const { pickup_location, drop_location, vehicle_type } = req.body;

    if (!pickup_location || !drop_location) {
      res.status(400).json({
        success: false,
        message: "Both pickup_location and drop_location are required",
      });
      return;
    }

    // 3. Call service
    const result = await createRideRequest({
      rider_id: req.user._id,
      pickup_location,
      drop_location,
      vehicle_type,
    });

    // 4. Send response
    res.status(201).json({
      success: true,
      message: "Ride requested successfully",
      data: {
        ride: {
          ride_id: result.ride._id,
          rider_id: result.ride.rider_id,
          driver_id: result.ride.driver_id,
          pickup_location: result.ride.pickup_location,
          drop_location: result.ride.drop_location,
          distance: result.ride.distance,
          base_fare: result.ride.base_fare,
          surge_multiplier: result.ride.surge_multiplier,
          total_fare: result.ride.total_fare,
          status: result.ride.status,
          created_at: result.ride.created_at,
        },
        driver: {
          id: result.driver._id,
          user_id: result.driver.user_id,
          vehicle_type: result.driver.vehicle_type,
          vehicle_number: result.driver.vehicle_number,
          rating: result.driver.rating,
        },
        nearby_drivers_count: result.nearby_drivers_count,
      },
    });
  } catch (error) {
    next(error);
  }
};