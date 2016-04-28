module.exports = function (router) {
    var Search = require('../models/search-models'),
    search = new Search();

    var getResults = function(req, res, next) {
        var query = {
            Keywords: req.query.query,
            SearchIndex: "All"
        };
        search.search(query, function(err, results) {
            res.render('search', {
                placeholder: req.query.query,
                results: results
            });
        });
    };

    router.get('/search', getResults);

    return router;
};
