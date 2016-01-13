// Get all the packages
var express = require('express'),
    config  = require('./config/config');

var app = express(),
    port = config.port,
    host = config.host;


// Temp hello world routes
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(port);
console.log('The best deals on the net are being served at ' + host + port);
