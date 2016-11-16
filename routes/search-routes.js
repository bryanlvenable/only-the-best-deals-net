module.exports = function (router) {
    'use strict';
    var Search = require('../models/search-models'),
        config = require('../config/config.js'),
        search = new Search(config);

    var getResults = function(req, res, next) {
        search.search(req.query.q, function(err, results) {
            if (err) {
                res.render('home');
                return;
            }

            res.render('search', {
                placeholder: req.query.q,
                results: results
            });
        });
    };

    router.get('/search', getResults);

    return router;
};
