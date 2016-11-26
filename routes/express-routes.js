module.exports = function (router) {
    'use strict';
    var Express = require('../models/express-models'),
        config = require('../config/config.js'),
        express = new Express(config),
        is = require('is_js'),
        home = 'http://onlythebestdeals.net/';

    var getUrl = function(req, res, next) {
        express.search(req.query.q, function(err, result) {
            if (err) {
                console.error(err);
                return res.send('http://onlythebestdeals.net/');
            }
            if (is.not.existy(result) || is.not.string(result) || result.length === 0) {
                return res.send('http://onlythebestdeals.net/');
            }

            return res.send(result);
        });
    };

    router.get('/express', getUrl);

    return router;
};
