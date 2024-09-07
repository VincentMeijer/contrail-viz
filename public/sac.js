import {dp_sat_liq_exp_dT, p_sat_liq, dp_sat_liq_dT, p_sat_ice} from './thermo.js';

/**
 * Checks whether the Schmidt-Appleman criterion is satisfied
 * @param {float} slope - Slope of the mixing line in Pa / K
 * @param {float} ambient_temperature - Ambient temperature in K
 * @param {float} ambient_pressure_h2o - Ambient water vapor pressure in Pa
 * @returns 
 */
export const checkSAC = function (slope, ambient_temperature, ambient_pressure_h2o) {
                
                
    var interval =  [ambient_temperature, 250];
    var T_max_RH = bisection(x => slope - dp_sat_liq_exp_dT(x) * (ambient_pressure_h2o + slope * (x - ambient_temperature)),
                interval, 1e-12);
    
    if (T_max_RH === undefined) {
        return false;
    }
    T_max_RH = T_max_RH[0];
    
    var max_RH = (ambient_pressure_h2o + slope * (T_max_RH - ambient_temperature)) / p_sat_liq(T_max_RH);

    return (max_RH > 1);
}

/**
 * Computes the temperature where the mixing line is tangent to the liquid saturation curve,
 * by means of root finding
 * @param {float} slope - Slope of the mixing line in Pa / K
 * @param {float} min_temp - Minimum temperature to consider in K
 * @returns 
 */
export const getTheta = function(slope, min_temp = 200) {
    var interval =  [min_temp, 500];
    var T_max_RH = bisection(x => slope - dp_sat_liq_dT(x),
                interval, 1e-12);
    
    return T_max_RH[0];
}

/**
 * Computes the temperature where the mixing line is tangent to the liquid saturation curve,
 * using curve fits from Schumann 1996 and Gierens 2021
 * @param {float} slope - Slope of the mixing line in Pa / K
 * @returns 
 */
export const getThetaApprox = function(slope) {
    var T_max;
    if (slope <= 2.0) {
        T_max = 226.69 + 9.43 * Math.log(slope - 0.053) + 0.720 * Math.pow(Math.log(slope - 0.053), 2);
    }
    else {
        T_max = 226.031 + 10.2249 * Math.log(slope) + 0.335372 * Math.pow(Math.log(slope), 2) + 0.0642105 * Math.pow(Math.log(slope), 3);
    }
    return T_max;
}

/**
 * Computes the minimum temperature, below which contrail formation can occur
 * in completely dry air. This is intercept of the limiting mixing line with the
 * horizontal axis.
 * @param {float} slope - Slope of the mixing line in Pa / K
 * @returns 
 */
export const getTmin = function(slope) {
    var T_max = getThetaApprox(slope);
    return T_max - p_sat_liq(T_max) / slope;
}


/**
 * Check whether ice supersaturation is satisfied
 * @param {float} ambient_temperature - Ambient temperature in K
 * @param {float} ambient_pressure_h2o - Ambient water vapor pressure in Pa
 */
export const checkISS = function (ambient_temperature, ambient_pressure_h2o){
    var RH_ice = ambient_pressure_h2o / p_sat_ice(ambient_temperature);
    return (RH_ice > 1);
}

// from : https://stackoverflow.com/questions/33367226/javascript-implementation-of-newton-vs-bisection
function bisection (func, interval, eps) {
    var xLo = interval[0];
    var xHi = interval[1];
  

    fHi = func(xHi);  // fb
    fLo = func(xLo); // fa

    if (fLo * fHi > 0)
        return undefined;

    var xMid, fHi, fLo, fMid;
    var iter = 0;
    while (xHi - xLo > eps) {
        ++iter;
        xMid = (xLo+xHi)/2;
        fMid = func(xMid);  // fc

        if (Math.abs(fMid) < eps)
            return [xMid, iter];

        else if (fMid*fLo < 0) { // fa*fc < 0 --> [a,c]
            xHi = xMid;
            fHi = fMid;
        } else {  // fc*fb < 0 --> [c,b]
            xLo = xMid;
            fLo = fMid;
        }
    }
    
    return [(xLo+xHi)/2, iter];
}
