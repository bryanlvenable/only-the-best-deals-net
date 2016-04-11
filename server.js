// server.js
var express = require('express'),
    exphbs = require('express-handlebars'),
    favicon = require('serve-favicon');

var app = express(),
    router = express.Router(),
    hbs = exphbs.create({
        defaultLayout: 'main',
    });

app.set('port', (process.env.PORT || 9000));

app.use(favicon(__dirname + '/public/assets/favicon.ico'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/jquery', express.static('bower_components/jquery/dist'));
app.use('/bootstrap', express.static('bower_components/bootstrap/dist'));
app.use('/components-font-awesome', express.static('bower_components/components-font-awesome'));
app.use('/bootstrap-social', express.static('bower_components/bootstrap-social'));
app.use('/public', express.static('public/'));

app.get('/', function (req, res, next) {
    res.render('splash');
});
app.get('/faq', function (req, res, next) {
    res.render('faq');
});

app.listen(app.get('port'), function() {
  console.log('The best deals on the net are being served at port', app.get('port'));
});
