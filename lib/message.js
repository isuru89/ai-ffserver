var express         = require('express');
var messageRouter   = express.Router();

var configs                 = require('../config');
var _activeAIName           = configs.activeAI;
var _activeAIConfigs        = configs.ai[_activeAIName];

var apiHook         = require('./apis/' + _activeAIName);

messageRouter.post('/', function (req, res) {
    var data = req.body;
    apiHook.message(data.text, data.options, res);
});

module.exports = messageRouter;