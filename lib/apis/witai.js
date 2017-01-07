module.exports = {

    parseRequest: function (req) {
        return {
            originalRequest: req.originalRequest,
            result: req.result,
            timestamp: req.timestamp,
            action: req.result.action
        }
    },

    /**
     * Return the function instance mapped from the given action name
     * 
     * @param actionName fullname of the action denoted with dots. Part after the last 
     *                   dot will indicate the function name.
     * @param req parsed request object.
     * @returns a promose returning loaded function instance.
     */
    getActionFunc: function (actionName, req) {
        return new Promise(function(resolve, reject) {
            var paths = actionName.split(".");
            var actionModule = require("../../actions/" + paths.slice(0, paths.length - 1).join("/"));
            var func = actionModule[paths[paths.length - 1]];
            resolve(func);
        });
    }

}