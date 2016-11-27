module.exports = function (router) {
    'use strict';
    var Express = require('../models/express-models'),
        config = require('../config/config.js'),
        express = new Express(config),
        is = require('is_js');

    var getUrl = function(req, res, next) {
        if (req.query.q === undefined) {
            return res.render('express');
        }
        express.search(req.query.q, function(err, result) {
            if (err) {
                console.error(err);
                return res.redirect('express');
            }
            if (is.not.existy(result) || is.not.string(result) || result.length === 0) {
                return res.redirect('express');
            }

            return res.redirect(result);
        });
    };

    router.get('/express', getUrl);

    return router;
};
