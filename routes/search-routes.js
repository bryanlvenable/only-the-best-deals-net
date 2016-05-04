module.exports = function (router) {
    var Search = require('../models/search-models'),
    search = new Search();

    var getResults = function(req, res, next) {
        var options = {
            keywords: req.query.query
        };

        search.search(options, function(err, results) {
            res.render('search', {
                placeholder: req.query.query,
                results: results
            });
        });
    };

    router.get('/search', getResults);

    return router;
};
