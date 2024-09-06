import {dp_sat_liq_exp_dT, p_sat_liq, dp_sat_liq_dT} from './saturation.js';

/**
 * Checks whether the Schmidt-Appleman criterion is satisfied
 * @param {float} slope - Slope of the mixing line in Pa / K
 * @param {float} ambient_temperature - Ambient temperature in K
 * @param {float} ambient_pressure_h2o - Ambient water vapor pressure in Pa
 * @returns 
 */
var checkSAC = function (slope, ambient_temperature, ambient_pressure_h2o) {
                
                
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
var getTheta = function(slope, min_temp = 200) {
    var interval =  [min_temp, 500];
    var T_max_RH = bisection(x => slope - dp_sat_liq_dT(x),
                interval, 1e-12);
    
    return T_max_RH[0];
}