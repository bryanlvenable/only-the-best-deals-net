module.exports = function(app, route) {
    route.get('/', function (req, res, next) {
        res.render('splash');
    });
    route.get('/faq', function (req, res, next) {
        res.render('faq');
    });

    // Amazon routes
    route = require('./amazon')(route);

    return route;
};