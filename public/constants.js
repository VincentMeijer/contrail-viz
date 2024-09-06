export const fuelData = {"Jet-A" : {"eta" : 0.4, "EI_H2O" : 1.23, "LHV" : 42e6},
                        "SAF" : {"eta" : 0.4, "EI_H2O" : 1.371, "LHV" : 44.17e6},
                        "Hydrogen" : {"eta" : 0.4, "EI_H2O" : 9.0, "LHV" : 120.9e6}};

// eta0 is the thermochemical efficiency of the fuel cell, eta_E is the electrical efficiency of the fuel cell
// Data based on Gierens (2021)
export const fuelCellData = {"H2" : {"eta0" : 0.95, "eta_E": 0.5}};
const cp = 1003;
const epsilon = 0.622;

export class Fuel
{
    constructor(name)
    {
        this.name = name;
        this.eta = fuelData[name].eta;
        this.EI_H2O = fuelData[name].EI_H2O;
        this.LHV = fuelData[name].LHV;
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
        return 100 * cp * pressure.value * this.EI_H2O / (epsilon * this.LHV * (1 - efficiency.value));
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
