const TROPOPAUSE_ALTITUDE_ISA = 11000; // m
const SURFACE_TEMPERATURE_ISA = 288.15; // K
const TROPOPAUSE_LAPSE_RATE_ISA = 0.0065; // K / m
const TROPOPAUSE_TEMPERATURE_ISA = 216.65; // K 


/**
 * Returns the pressure in Pa corresponding to a given altitude in the International
 * Standard Atmosphere
 * @param {float} altitude - Altitude above sea level in m
 * @returns 
 */
export const getPressureISA = function(altitude) {
    return 100 * Math.pow( (44331.514 - altitude) / 11880.516,  (1 / 0.1902632))
}

/**
 * Returns the altitude above sea level in m for the International Standard
 * Atmosphere
 * @param {*} pressure - Pressure in Pa
 * @returns 
 */
export const getAltitudeISA = function(pressure) {
    return 44331.514 - 11880.516 * Math.pow(  (pressure / 100), 0.1902632);
}

/**
 * Returns the temperature at the given altitude in the International Standard Atmosphere
 * Does not work above the tropopause.
 * @param {*} altitude - Altitude above sea level in m
 * @returns 
 */
export const getTemperatureISA = function(altitude) {
    return Math.max(SURFACE_TEMPERATURE_ISA - TROPOPAUSE_LAPSE_RATE_ISA * altitude, TROPOPAUSE_TEMPERATURE_ISA);
}