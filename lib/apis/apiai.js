var fs = require('fs');

var allConfigs = require('../../config');
var configs = allConfigs.ai['apiai'];

var apiai = require('apiai');
var ai = apiai(configs.clientToken, {
    language: configs.language,
    version: configs.version
});

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
            var fName = paths[paths.length - 1];
            var func;

            // @TODO check first whether there is a separate file by action name. Otherwise load the folder
            // and then find the function.

            if (typeof actionModule === 'function') {
                func = actionModule()[fName];
            } else {
                func = actionModule[fName];
            }
            resolve(func);
        });
    },

    /**
     * Call the api.ai server and get a reply for the given text.
     * Here the chatId is a unique id for this active conversation. You should
     * use same chatId thorughout in the same conversation.
     * 
     * @param text message as a text replied by a human.
     * @param chatId unique chat id for a conversation session.
     */
    message: function (text, options, response) {
        var request = ai.textRequest(text, { sessionId: options.chatId });
        request.on('response', function (result) {
            response.json(result);
        });
        request.on('error', function (error) {
            response.status(503).send(error);
        });
        request.end();
    }
}