/**
 * Note:
 * 
 * All service functions exposed by this module must be promise based functions.
 */
module.exports = function () {

    var result = {
        checkUserIdentification: _checkUserIdentification
    }

    _merge(result, require('./motor'));

    return result;
}

function _merge(dest, obj) {
    if (!obj) {
        return;
    }

    var keys = Object.keys(obj);
    keys.forEach(function (k) { dest[k] = obj[k] });
}

function _checkUserIdentification(req, api) {
    var nid = req.result.parameters.nid;
    return new Promise(function (resolve, reject) {
        if (!nid || nid.length() < 9) {
            reject('The national identity card number has not been provided or invalid!');
        } else {
            var v = _scanNID(nid);
            resolve({
               contextOut: [{ name: "identification", lifespan: 5, 
                    parameters: {
                        gender: v.female ? 'female' : 'male',
                        age: v.age
                    } 
                }],
               source: "inbuilt-ffsvr"
           });
        }
    });
}

/**
 * Scans the national id and identify gender, age, and name.
 * 
 * @param nid id card number as string.
 */
function _scanNID(nid) {
    var birthYear = parseInt(nid.substring(0, 2));
    var dt = parseInt(nid.substring(2, 5));
    var year = new Date().getFullYear();
    birthYear = birthYear > year % 100 ? birthYear + 1900 : birthYear + 2000;

    return {
        female: dt >= 500,
        age: year - birthYear
    }
}