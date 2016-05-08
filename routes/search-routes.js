module.exports = function (router) {
    var Search = require('../models/search-models'),
    search = new Search();

    var resultsGet = function(req, res, next) {

        search.search(req.query.query, function(err, results) {
            res.render('search', {
                placeholder: req.query.query,
                results: results
            });
        });
    };

    router.get('/search', resultsGet);

    return router;
};
