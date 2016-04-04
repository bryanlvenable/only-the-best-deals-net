// server.js

// Get all the packages
var express = require('express'),
    config  = require('./config/config'),
    exphbs = require('express-handlebars');

var app = express(),
    router = express.Router(),
    hbs = exphbs.create({
        defaultLayout: 'main',
    }),
    port = config.port,
    host = config.host;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/bootstrap', express.static('bower_components/bootstrap/dist'));
app.use('/jquery', express.static('bower_components/jquery/dist'));

app.get('/', function (req, res, next) {
    res.render('splash');
});

app.listen(port);
console.log('The best deals on the net are being served at ' + host + port);
