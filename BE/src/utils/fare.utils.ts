import type { fareResult } from "../rides/rides.types.js";


const RATE_CARD: Record<string, { base: number; perKm: number }> = {
    Go: { base: 30, perKm: 10 },
    X: { base: 50, perKm: 14 },
    Xl: { base: 70, perKm: 18 },
    Black: { base: 100, perKm: 22 },
    BlackXl: { base: 130, perKm: 26 },
};

const MIN_FARE = 50;

export const calculateFare = (
    vehicleType: string,
    distanceKm: number,
    surgeMultiplier: number,
): fareResult => {
    const rate = RATE_CARD[vehicleType] ?? RATE_CARD["Go"]!;

    const base_fare = parseFloat(
        (rate.base + distanceKm * rate.perKm).toFixed(2)
    );

    const total_fare = parseFloat(
        Math.max(base_fare * surgeMultiplier, MIN_FARE).toFixed(2)
    );

    return {
        base_Fare: base_fare,
        surge_multiplier: surgeMultiplier,
        total_fare,
    };
};