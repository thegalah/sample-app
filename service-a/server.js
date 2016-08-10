var os = require('os');
var request = require('request');
var morgan = require('morgan');

//Setup automatic diagnostics data collection with ApplicationInsights
var appInsights = require('applicationinsights').setup().start();
//Add service name to the context to distinguish diagnostics data from different services
appInsights.client.context.tags["ai.application.ver"] = require('./package.json').name

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));// set the static files location /public/img will be /img for users
app.use(require("morgan")("dev"));

// api ------------------------------------------------------------
app.get('/api', function (req, res) {
    //Connect to redis container using environment variable
    var redis = require('redis').createClient('6379', 'redis');

    // Increment requestCount each time API is called
    redis.incr('requestCount', function (err, reply) {
       var requestCount = reply;
    });

    // Invoke service-b
    request('http://service-b', function (error, response, body) {
         res.send('Hello from service A running on ' + os.hostname() + ' and ' + body);
    });
});

app.get('/metrics', function (req, res) {
    var redis = require('redis').createClient('6379', 'redis');
    redis.get('requestCount', function (err, reply) {
        res.send({ requestCount: reply });
    });
});

// application -------------------------------------------------------------
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');     // load the single view file (angular will handle the page changes on the front-end)
});

var port = process.env.PORT || 80;
app.listen(port, function () {
    console.log('Listening on port ' + port);
});

