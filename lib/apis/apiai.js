module.exports = {

    // name of the api.
    name: 'apiai',  

    /**
     * Find the given context in the request object.
     */
    readContext: function (ctxName, req) {
        var allCtxs = req.result.contexts;
        if (allCtxs) {
            for (var i=0; i<allCtxs.length; i++) {
                if (allCtxs[i].name == ctxName) {
                    return allCtxs[i];
                }
            }
        }
        return null;
    },

    /**
     * Parse and convert the request sent by api.ai to a more generic consumable by all services
     * in the ff-server.
     */
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
            var func;
            if (typeof actionModule === 'function') {
                func = actionModule()[paths[paths.length - 1]];
            } else {
                func = actionModule[paths[paths.length - 1]];
            }
            resolve(func);
        });
    }

}