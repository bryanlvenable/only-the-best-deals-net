var Amazon = function() {
    // this.config = require('config');
    // this.aws = require('aws-lib');
    // this.amazonConfig = this.config.get('amazonAssociates');
    // this.prodAdv = this.aws.createProdAdvClient(this.amazonConfig.accessKeyId, this.amazonConfig.accessKeySecret, this.amazonConfig.associateId);
};

Amazon.prototype.search = function(query, callback) {

    // If no query or empty query
    if (query === "" || !query) {
        return callback(null, undefined);
    }

    this.options = {
        keywords: query,
        searchIndex: "SportingGoods"
    };

    this.helpers = new Helpers();

    this.helpers.searchIndex(this.options, function(err, results) {
        if (err) {
            return callback(err, {});
        }
        return callback(null, results);
    });
};

var Helpers = function() {
    this.config = require('config');
    this.aws = require('aws-lib');
    this.amazonConfig = this.config.get('amazonAssociates');
    this.prodAdv = this.aws.createProdAdvClient(this.amazonConfig.accessKeyId, this.amazonConfig.accessKeySecret, this.amazonConfig.associateId);
};


Helpers.prototype.searchAll = function(query, callback) {

    this.options = {
        Keywords: query,
        SearchIndex: "All"
    };

    this.prodAdv.call("ItemSearch", this.options, function(err, result) {
        this.results = [];

        result.Items.Item.forEach(function(item) {
            this.entry = {
                url: item.DetailPageURL,
                title: item.ItemAttributes.Title
            };
            this.results.push(this.entry);
        });

        return callback(err, results);
    });
};

Helpers.prototype.searchIndex = function(queryParams, callback) {

    this.options = {
        Keywords: queryParams.keywords,
        SearchIndex: queryParams.searchIndex,
        ResponseGroup: "ItemAttributes, Images"
    };

    this.prodAdv.call("ItemSearch", this.options, function(err, result) {
        this.results = [];

        result.Items.Item.forEach(function(item) {
            this.entry = {
                url: item.DetailPageURL,
                title: item.ItemAttributes.Title,
                image: item.MediumImage.URL
            };
            this.results.push(this.entry);
        });

        return callback(err, results);
    });
};

module.exports = Amazon;
