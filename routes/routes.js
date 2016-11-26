module.exports = function(app, route) {
    'use strict';
    route.get('/', function (req, res, next) {
        res.render('home');
    });
    route.get('/splash', function (req, res, next) {
        res.render('splash');
    });
    route.get('/faq', function (req, res, next) {
        res.render('faq');
    });

    route = require('./search-routes')(route);
    route = require('./express-routes')(route);

    return route;
};
