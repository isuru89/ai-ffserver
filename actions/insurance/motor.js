
var _values = require('./motor-values');

module.exports = {

    currentMarketValueOfVehicle: _currentMarketValue

}

function _currentMarketValue(req, api) {
    var vehicle = req.result.params.vehicle;
    return new Promise(function (resolve, reject) {
       var curValue = _deriveVehicleValue(vehicle.type, vehicle.vendor, vehicle.model, vehicle.year);
       if (curValue) {
           resolve({
               contextOut: [{ name: "motorInsurance", lifespan: 5, 
                    parameters: {
                        currentMarketValue: curValue
                    } 
                }],
               source: "inbuilt-ffsvr"
           });
       } else {
           reject('Cannot find a current market value for the given vehicle!');
       }
    });
}

function _deriveVehicleValue(type, vendor, model, year) {
    var val = _values[type]
    if (!val) {
        return null;
    } else {
        if (!val[vendor]) {
            return val["def"]; 
        } else {
            val = val[vendor];
            if (!val[model]) {
                return val["def"];
            } else {
                val = val[model];
                if (!val[year]) {
                    return val["def"];
                } else {
                    return val[year];
                }
            }
        }
    }
}