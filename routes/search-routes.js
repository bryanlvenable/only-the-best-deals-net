module.exports = function (router) {
    var Search = require('../models/search-models'),
    search = new Search();

    var getResults = function(req, res, next) {
        var query = {
            Keywords: req.query.query
        };
        res.render('search');
        search.search(query, function(err, results) {
            console.log("results: ", results);
        });
    };

    router.get('/search', getResults);

    return router;
};
