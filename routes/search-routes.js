module.exports = function (router) {
    var Search = require('../models/search-models'),
        config = require('config-heroku'),
        search = new Search(config);

    var resultsGet = function(req, res, next) {

        search.search(req.query.q, function(err, results) {

            res.render('search', {
                placeholder: req.query.q,
                results: results
            });
        });
    };

    router.get('/search', resultsGet);

    return router;
};
