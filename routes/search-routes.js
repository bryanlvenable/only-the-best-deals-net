module.exports = function (router) {
    'use strict';
    var Search = require('../models/search-models'),
        config = require('../config/config.js'),
        search = new Search(config);

    var resultsGet = function(req, res, next) {

        search.search(req.query.q, function(err, results) {
            if (err) {
                console.log(err);
                res.render('home');
            }

            res.render('search', {
                placeholder: req.query.q,
                results: results
            });
        });
    };

    router.get('/search', resultsGet);

    return router;
};
