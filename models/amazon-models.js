var Amazon = function(config) {
    'use strict';

    // Ensure object is called with new or Object.create:
    if (!(this instanceof Amazon)) {
        return new Amazon();
    }

    this.aws = require('aws-lib');
    const prodAdv = this.aws.createProdAdvClient(config.accessKeyId, config.accessKeySecret, config.associateId);
    this.Request = require('./helpers/api-request.js');
    this.request = new this.Request(config);
    const is = require('is_js');

    // Internal methods
    this.amazonApi = function(options, callback) {
        prodAdv.call('ItemSearch', options, function(err, results) {
                if (err) {
                    return callback(err);
                }
                // TODO - move this to api-request.js
                if (is.existy(results.Items) && results.Items.Request.IsValid === "False") {
                    return callback(new Error("invalid request to Amazon"));
                }
                if (is.not.existy(results.Items) || is.not.existy(results.Items.Item)) {
                    return callback(new Error("getAmazon() response contains no items :("));
                }

                return callback(err, results.Items.Item);
        });
    };

    this.findIndices = function(query, callback) {
        this.options = {
            Keywords: query,
            SearchIndex: "All"
        };

        this.amazonApi(this.options, function(err, results) {
            if (err) {
                return callback(err);
            }
            let productGroups = {};
            let indices = [];
            let indicesConverter = {
                "Sports": "SportingGoods",
                "Lawn & Patio": "LawnAndGarden"
            };

            // Find out what product groups are being displayed
            results.forEach(function(item) {
                let productGroup = item.ItemAttributes.ProductGroup;
                if(productGroups[productGroup]) {   // If product group exists add one to count
                    productGroups[productGroup] = productGroups[productGroup] + 1;
                } else {    // Otherwise add it and initialize its count
                    // Check if we support that current index
                    // If we support it, it will be in indicesConverter
                    if (indicesConverter[productGroup] !== undefined) {
                        indices.push(indicesConverter[productGroup]);
                        productGroups[productGroup] = 1;
                    }
                }
            });

            // return callback(null, indices);
            return callback(err, ["LawnAndGarden"]);
        });
    };

    this.searchByIndex = function(query, callback) {
        this.options = {
            Keywords: query.keywords,
            SearchIndex: query.searchIndex,
            ResponseGroup: "ItemAttributes, Images, OfferSummary",
            Sort: "relevancerank"
        };

        this.amazonApi(this.options, function(err, result) {
            if (err) {
                return callback(err);
            }
            let results = [];

            result.forEach(function(item) {
                let entry = {
                    url: item.DetailPageURL,
                    title: item.ItemAttributes.Title
                };

                if (item.OfferSummary &&
                    item.OfferSummary.LowestNewPrice &&
                    item.OfferSummary.LowestNewPrice.FormattedPrice
                    ) {
                    entry.price = item.OfferSummary.LowestNewPrice.FormattedPrice;
                }

                if (item.MediumImage) {
                    entry.image = item.MediumImage.URL;
                }

                results.push(entry);
            });

            return callback(null, results);
        });
    };
};

Amazon.prototype.search = function(query, callback) {
    // If no query or empty query
    if (query === "" || !query) {
        return callback(null, undefined);
    }

    let self = this;

    this.findIndices(query, function(err, indices) {
        if (err) {
            return callback(err);
        }

        let options = {
                keywords: query,
                searchIndex: indices[0] // NOTE - for now only search one index
            };

        self.searchByIndex(options, function(err, results) {
            if (err) {
                return callback(err);
            }

            return callback(null, results);
        });
    });
};

module.exports = Amazon;
