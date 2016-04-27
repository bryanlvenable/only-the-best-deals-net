module.exports = function (router) {

    var getResults = function(req, res, next) {
        var Search = require('../models/search-models'),
        search = new Search();
        var query = {
            Keywords: "hammock"
        };
        console.log("req.body: ", req.body);
        search.search(query, function(err, results) {
            console.log("results: ", results);
            res.render('search');
        });
    };

    router.get('/search', getResults);

    return router;
};
