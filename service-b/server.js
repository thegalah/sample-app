var os = require('os');
var express = require('express');

var app = express();
var morgan = require('morgan');
app.use(require("morgan")("dev"));

var appInsights = require('applicationinsights').setup().start();
appInsights.client.context.tags["ai.application.ver"] = require('./package.json').name

app.get('/', function (req, res) {
    res.send('Hello from service B running on ' + os.hostname());
});

var port = process.env.PORT || 80;
app.listen(port, function () {
    console.log('Listening on port ' + port);    
});
