var express         = require('express');
var webHookRouter   = express.Router();

var configs                 = require('../config');
var _activeAIName           = configs.activeAI;
var _activeAIConfigs        = configs.ai[_activeAIName];

console.log('Activating AI: ' + _activeAIName);

// load the corresponding api hook.
var apiHook         = require('./apis/' + _activeAIName);

// accepts an action triggerring from AI server.
webHookRouter.post('/action', function (req, res) {
    var reqData = apiHook.parseRequest(req);
    apiHook.getActionFunc(reqData.action, reqData)
        .then(function (action) {
            if (!action) {
                console.error('Action not found! [' + reqData.action + ']');
                res.status(503).send('The defined action is not found in server! [' + reqData.action + ']');
            } else {
                action(reqData).then(function (jsonData) {
                    res.json(jsonData);
                });
            }
        });
});

module.exports = webHookRouter;
