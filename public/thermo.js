export const p_sat_liq = function (x) {
    return Math.exp(p_sat_liq_exp(x));
}
export const p_sat_liq_exp = function(x) {
    return Math.log(100) - 6096.9385/x + 16.635794 - (2.711193e-2)*x + (1.673952e-5)*x*x + 2.433502 * Math.log(x);
}
export const dp_sat_liq_exp_dT = function(x) {
    return (6096.9385/Math.pow(x,2)) - 2.711193e-2 + 2 * (1.673952e-5)*x + (2.433502 / x);
}
export const dp_sat_liq_dT = function(x) {
    return dp_sat_liq_exp_dT(x) * p_sat_liq(x);
}
export const p_sat_ice = function p_sat_ice(x) {
    return 100*6.1121*Math.exp(22.587*(x-273.15)/(x + 273.86-273.15))
}