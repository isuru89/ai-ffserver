var express = require('express');
var app     = express();

var configs = require('../config');

// attach web hook router
app.use('/webhook', require('./webhook'));
app.use('/message', require('./message'));
console.log('Webhook activated and listening through /webhook/action');

// start the services
app.listen(configs.port, function () {
    console.log('Fulfillment server ready to accept actions on port ' + configs.port + '...');
});

module.exports = app;