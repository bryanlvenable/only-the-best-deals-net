module.exports = function (router) {
    var Search = require('../models/search-models'),
        config = require('config-heroku'),
        search = new Search(config);

    var resultsGet = function(req, res, next) {

        console.time('Searching');
        search.search(req.query.query, function(err, results) {

            res.render('search', {
                placeholder: req.query.query,
                results: results
            });
            console.timeEnd('Searching');
        });
    };

    router.get('/search', resultsGet);

    return router;
};
