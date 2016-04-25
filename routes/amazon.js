
var config = require('config'),
    aws = require('aws-lib'),
    amazonConfig = config.get('amazonAssociates');

module.exports = function (router) {

    var search = function (req, res, next) {
        var prodAdv = aws.createProdAdvClient(amazonConfig.accessKeyId, amazonConfig.accessKeySecret, amazonConfig.associateId),
        searchIndex = "",
        keywords = "",
        options;

        if (req.query.searchIndex) {
            searchIndex = req.query.searchIndex;
        }
        if (req.query.keywords) {
            keywords = req.query.keywords;
        }

        // options = {SearchIndex: searchIndex, Keywords: keywords};

        options = {Keywords: keywords};

        prodAdv.call("ItemSearch", options, function(err, result) {
            console.log(result);
        });
    };

    router.get('/amazon/search', search);

    return router;
};
