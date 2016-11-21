var Amazon = function(config) {
    'use strict';

    // Ensure object is called with new or Object.create:
    if (!(this instanceof Amazon)) {
        return new Amazon();
    }

    this.aws = require('./helpers/aws.js');
    const prodAdv = this.aws.createProdAdvClient(config.accessKeyId, config.accessKeySecret, config.associateId);
    this.Request = require('./helpers/api-request.js');
    this.request = new this.Request(config);
    const is = require('is_js');

    // Internal methods
    this.amazonApi = function(options, callback) {
        prodAdv.call('ItemSearch', options, function(err, results) {
            // console.log('JSON.stringify(results, null, 2): ', JSON.stringify(results.ItemSearchResponse.Items[0].Item[0], null, 2));
            // console.log('Object.keys(results.ItemSearchResponse.Items[0].Item): ', Object.keys(results.ItemSearchResponse.Items[0].Item[0]));

            // console.log('results.ItemSearchResponse.Items[0].Item[0]: ', results.ItemSearchResponse.Items[0].Item.Items);
            if (err) {
                return callback(err);
            }
            // TODO - move this to api-request.js
            if (is.existy(results.ItemSearchResponse.Items[0]) && results.ItemSearchResponse.Items[0].Request[0].IsValid === "False") {
                return callback(new Error("invalid request to Amazon"));
            }
            if (is.not.existy(results.ItemSearchResponse.Items[0]) || is.not.existy(results.ItemSearchResponse.Items[0].Item[0])) {
                return callback(new Error("getAmazon() response contains no items :("));
            }

            return callback(err, results.ItemSearchResponse.Items[0].Item);
        });
    };

    this.findIndices = function(query, callback) {
        return callback(null, ["LawnAndGarden"]);
        // this.options = {
        //     Keywords: query,
        //     SearchIndex: "All"
        // };
        //
        // this.amazonApi(this.options, function(err, results) {
        //     if (err) {
        //         return callback(err);
        //     }
        //     // console.log('results in here: ', results);
        //     if (is.not.object(results)) {
        //         return callback(new Error('amazonApi() results should be an Object'));
        //     }
        //
        //     let productGroups = {};
        //     let indices = [];
        //     let indicesConverter = {
        //         "Sports": "SportingGoods",
        //         "Lawn & Patio": "LawnAndGarden"
        //     };
        //
        //     // Find out what product groups are being displayed
        //     results.forEach(function(item) {
        //         let productGroup = item.ItemAttributes.ProductGroup;
        //         if(productGroups[productGroup]) {   // If product group exists add one to count
        //             productGroups[productGroup] = productGroups[productGroup] + 1;
        //         } else {    // Otherwise add it and initialize its count
        //             // Check if we support that current index
        //             // If we support it, it will be in indicesConverter
        //             if (indicesConverter[productGroup] !== undefined) {
        //                 indices.push(indicesConverter[productGroup]);
        //                 productGroups[productGroup] = 1;
        //             }
        //         }
        //     });
        //
        //     // return callback(null, indices);
        //     return callback(err, ["LawnAndGarden"]);
        // });
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
                console.log('JSON.stringify(item.ItemAttributes[0], null, 2): ', JSON.stringify(item.ItemAttributes[0], null, 2));
                console.log('Object.keys(item.ItemAttributes[0]): ', Object.keys(item.ItemAttributes[0]));
                let entry = {
                    url: item.DetailPageURL,
                    title: item.ItemAttributes[0].Title,
                };

                if (item.OfferSummary[0] &&
                    item.OfferSummary[0].LowestNewPrice &&
                    item.OfferSummary[0].LowestNewPrice[0].FormattedPrice
                ) {
                    entry.price = item.OfferSummary[0].LowestNewPrice[0].FormattedPrice;
                }

                if (item.MediumImage) {
                    entry.image = item.MediumImage[0].URL;
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
