module.exports = function (router) {
    'use strict';
    var Search = require('../models/search-models'),
        config = require('../config/config.js'),
        search = new Search(config),
        is = require('is_js');  // TODO implement this

    var getResults = function(req, res, next) {
        search.search(req.query.q, function(err, results) {
            if (err) {
                console.error(err);
                return res.render('home');
            }

            return res.render('search', {
                placeholder: req.query.q,
                results: results
            });
        });
    };

    router.get('/search', getResults);

    return router;
};
