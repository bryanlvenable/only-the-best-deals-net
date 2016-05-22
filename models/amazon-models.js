var Amazon = function(config) {
    'use strict';

    // Ensure object is called with new or Object.create:
    if (!(this instanceof Amazon)) {
        return new Amazon();
    }

    this.config = config;
    this.aws = require('aws-lib');
    this.prodAdv = this.aws.createProdAdvClient(config.accessKeyId, config.accessKeySecret, config.associateId);

    // Internal methods
    this.amazonApi = function(options, callback) {
        console.time('calling Amazon');
        this.prodAdv.call("ItemSearch", options, function(err, result) {
            if (err) {
                console.error(err);
                return callback(err, []);
            }
            if (result.Items.Request.IsValid === "False") {
                console.warn(new Error("invalid request to Amazon"));
                return callback(err, []);
            }

            console.timeEnd('calling Amazon');
            return callback(err, result.Items.Item);
        });
    };

    this.findIndices = function(query, callback) {
        console.time('findIndices');
        this.options = {
            Keywords: query,
            SearchIndex: "All"
        };

        this.amazonApi(this.options, function(err, result) {
            let productGroups = {};
            let indices = [];
            let indicesConverter = {
                "Sports": "SportingGoods",
                "Lawn & Patio": "LawnAndGarden"
            };

            // Find out what product groups are being displayed
            result.forEach(function(item) {
                // console.log(item);

                let productGroup = item.ItemAttributes.ProductGroup;
                if(productGroups[productGroup]) {   // If product group exists add one to count
                    productGroups[productGroup] = productGroups[productGroup] + 1;
                } else {    // Otherwise add it and initialize its count
                    indices.push(indicesConverter[productGroup]);
                    productGroups[productGroup] = 1;
                }
            });

            console.timeEnd('findIndices');
            // return callback(null, this.indices);
            return callback(err, ["LawnAndGarden"]);
        });
    };

    this.searchByIndex = function(query, callback) {
        console.time('searchByIndex');
        this.options = {
            Keywords: query.keywords,
            SearchIndex: query.searchIndex,
            ResponseGroup: "ItemAttributes, Images, OfferSummary",
            Sort: "relevancerank"
        };

        this.amazonApi(this.options, function(err, result) {
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

            console.timeEnd('searchByIndex');
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
            console.error(err);
            return callback(err, {});
        }

        let options = {
                keywords: query,
                searchIndex: indices[0] // NOTE - for now only search one index
            };

        self.searchByIndex(options, function(err, results) {
            if (err) {
                console.error(err);
                return callback(err, {});
            }

            return callback(null, results);
        });
    });
};

module.exports = Amazon;
