// server.js

// Get all the packages
var express = require('express'),
    config  = require('./config/config'),
    exphbs = require('express-handlebars');

var app = express(),
    router = express.Router(),
    hbs = exphbs.create({/* config */}),
    port = config.port,
    host = config.host;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', function (req, res, next) {
    res.render('splash');
});

// Temp
// Temp hello world routes
// app.get('/', function (req, res) {
//     res.send('Hello World!');
// });

app.listen(port);
console.log('The best deals on the net are being served at ' + host + port);
