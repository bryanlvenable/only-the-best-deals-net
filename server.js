// Get all the packages
var express = require('express'),
    config  = require('./server/config/config');

var app = express(),
    port = config.port,
    host = config.host;
