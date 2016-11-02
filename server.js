// server.js
'use strict';
var express = require('express'),
    exphbs = require('express-handlebars'),
    favicon = require('serve-favicon'),
    config = require('./config/config.js');

var app = express(),
    Router = express.Router(),
    router = require('./routes/routes')(app, Router),
    hbs = exphbs.create({
        defaultLayout: 'main',
        partialsDir: ['views/partials/']
    });

app.set('port', (process.env.PORT || 9000));

app.use(favicon(__dirname + '/public/assets/favicon.ico'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/jquery', express.static(__dirname + '/bower_components/jquery/dist'));
app.use('/bootstrap', express.static(__dirname + '/bower_components/bootstrap/dist'));
app.use('/components-font-awesome', express.static(__dirname + '/bower_components/components-font-awesome'));
app.use('/bootstrap-social', express.static(__dirname + '/bower_components/bootstrap-social'));
app.use('/public', express.static(__dirname + '/public/'));
app.use('/', router);

app.listen(app.get('port'), function() {
  console.log('The best deals on the net are being served at port', app.get('port'));
});
