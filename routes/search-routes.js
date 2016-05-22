module.exports = function (router) {
    var Search = require('../models/search-models'),
        config = require('config-heroku'),
        search = new Search(config);

    var resultsGet = function(req, res, next) {

        console.time('Searching');
        search.search(req.query.q, function(err, results) {

            res.render('search', {
                placeholder: req.query.q,
                results: results
            });
            console.timeEnd('Searching');
        });
    };

    router.get('/search', resultsGet);

    return router;
};
