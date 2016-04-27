module.exports = function(app, route) {
    route.get('/', function (req, res, next) {
        res.render('splash');
    });
    route.get('/faq', function (req, res, next) {
        res.render('faq');
    });

    route = require('./search-routes')(route);

    return route;
};
