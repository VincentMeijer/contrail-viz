export const fuelData = {"Jet-A" : {"eta" : 0.4, "EI_H2O" : 1.23, "LHV" : 42e6},
                        "SAF" : {"eta" : 0.4, "EI_H2O" : 1.371, "LHV" : 44.17e6},
                        "Hydrogen" : {"eta" : 0.4, "EI_H2O" : 9.0, "LHV" : 120.9e6}};

// eta0 is the thermochemical efficiency of the fuel cell, eta_E is the electrical efficiency of the fuel cell
// Data based on Gierens (2021)
export const fuelCellData = {"H2FC" : {"eta0" : 0.95, "eta_E": 0.5, deltaH : 241.82e3, cp : 30.6},};

const cp_air = 1003; // J / kg / K
const cp_air_molar = 29.1; // J / mol / K
const cp_H2O_molar = 33.6; // J / mol / K
const X_O2 = 0.21; // Molar fraction of O2 in air
const epsilon = 0.622;



export const getEnergySource = function(name) {
    if (fuelData.hasOwnProperty(name)) {
        return new Fuel(name);
    } else if (fuelCellData.hasOwnProperty(name)) {
        return new FuelCell(name);
    } else {
        console.error(`Energy source ${name} is not valid.`);
    }
}



export class FuelCell
{
    constructor(name)
    {
        this.name = name;
        this.eta0 = fuelCellData[name].eta0;
        this.eta_E = fuelCellData[name].eta_E;
        this.deltaH = fuelCellData[name].deltaH;
        this.AFR = 3;
        this.equation = "$$G = \\frac{\\bar{c}_p~p}{(1-\\eta_{E}\\eta_{0})|\\Delta h|}$$";
        // Default user parameters and their range (min, max, step)
        this.userParams = {
            pressure: { value: 300, min: 100, max: 1000, step: 10 },
            efficiency: { value: this.eta_E, min: 0.01, max: 1, step: 0.01 },
            AFR: { value: 3, min: 1 / (2 * X_O2), max: 10, step: 0.1 }
        };
    }

    evaluateSlope() {
        const { pressure, efficiency, AFR } = this.userParams;

        // First calculate c_p for exhaust mixture
        const cp =  (cp_H2O_molar + cp_air_molar * (AFR.value - 0.5)) / (AFR.value + 0.5);
        // 100 is to convert from hPa to Pa
        return 100 * cp * pressure.value / ((1 - efficiency.value * this.eta0) * this.deltaH);
    
    }
    updateUserParam(param, value) {
        if (this.userParams.hasOwnProperty(param)) {
            this.userParams[param].value = value;
        } else {
            console.error(`Parameter ${param} is not valid.`);
        }
    }
}

export class Fuel
{
    constructor(name)
    {
        this.name = name;
        this.eta = fuelData[name].eta;
        this.EI_H2O = fuelData[name].EI_H2O;
        this.LHV = fuelData[name].LHV;
        this.equation = "$$G = \\frac{c_p~p}{\\epsilon} \\frac{\\text{E}_{\\text{H}_2\\text{O}}}{(1-\\eta)\\text{LHV}}$$";
        // Default user parameters and their range (min, max, step)
        this.userParams = {
            pressure: { value: 300, min: 100, max: 1000, step: 10 },
            efficiency: { value: this.eta, min: 0.01, max: 1, step: 0.01 }
        };
    }

    // Function to evaluate the slope
    evaluateSlope() {
        const { pressure, efficiency } = this.userParams;
        // 100 is to convert from hPa to Pa
        return 100 * cp_air * pressure.value * this.EI_H2O / (epsilon * this.LHV * (1 - efficiency.value));
    }

    // Method to update user parameters dynamically
    updateUserParam(param, value) {
        if (this.userParams.hasOwnProperty(param)) {
            this.userParams[param].value = value;
        } else {
            console.error(`Parameter ${param} is not valid.`);
        }
    }
}
