// server.js
var express = require('express'),
    config  = require('./config/config'),
    exphbs = require('express-handlebars'),
    favicon = require('serve-favicon');

var app = express(),
    router = express.Router(),
    hbs = exphbs.create({
        defaultLayout: 'main',
    }),
    port = config.port,
    host = config.host;

app.use(favicon(__dirname + '/public/assets/favicon.ico'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/jquery', express.static('bower_components/jquery/dist'));
app.use('/bootstrap', express.static('bower_components/bootstrap/dist'));
app.use('/components-font-awesome', express.static('bower_components/components-font-awesome'));
app.use('/bootstrap-social', express.static('bower_components/bootstrap-social'));

app.get('/', function (req, res, next) {
    res.render('splash');
});

app.listen(port);
console.log('The best deals on the net are being served at ' + host + port);
