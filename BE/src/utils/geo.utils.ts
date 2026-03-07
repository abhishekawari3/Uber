import type{ IGeoPoint } from './../rides/rides.types.js';

const toRad : (deg:number) => number = (deg:number):number => deg * (Math.PI/180);

export const calculateDistance =(pickup:IGeoPoint, drop: IGeoPoint): number =>{
    const R : number = 6371; // Radius of the Earth in km

    const [lng1, lat1] = pickup.coordinates;
    const [lng2, lat2] =drop.coordinates;

    const dlang = toRad(lng2 - lng1);
    const dlat = toRad(lat2 - lat1);

    const a =   Math.sin(dlat / 2) ** 2 +
                Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *    
                Math.sin(dlang / 2) ** 2;   // Haversine formula

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return parseFloat((R * c).toFixed(2)); // Distance in km rounded to 2 decimal places

};

export const validateGeoPoint = (
  point: unknown,
  label: string
): { valid: boolean; message?: string } => {
  const p = point as IGeoPoint;

  if (!p || typeof p !== "object") {
    return { valid: false, message: `${label} is required` };
  }

  if (p.type !== "Point") {
    return { valid: false, message: `${label}.type must be "Point"` };
  }

  if (!Array.isArray(p.coordinates) || p.coordinates.length !== 2) {
    return {
      valid: false,
      message: `${label}.coordinates must be [longitude, latitude]`,
    };
  }

  const [lng, lat] = p.coordinates;

  if (typeof lng !== "number" || typeof lat !== "number") {
    return {
      valid: false,
      message: `${label}.coordinates must contain numbers`,
    };
  }

  if (lng < -180 || lng > 180) {
    return {
      valid: false,
      message: `${label} longitude must be between -180 and 180`,
    };
  }

  if (lat < -90 || lat > 90) {
    return {
      valid: false,
      message: `${label} latitude must be between -90 and 90`,
    };
  }

  return { valid: true };
};
