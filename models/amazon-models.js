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
        this.prodAdv.call("ItemSearch", options, function(err, result) {
            if (err) {
                console.error(err);
                return callback(err, []);
            }
            if (result.Items.Request.IsValid === "False") {
                console.warn(new Error("invalid request to Amazon"));
                return callback(err, []);
            }

            return callback(err, result.Items.Item);
        });
    };

    this.findIndices = function(query, callback) {
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

            // return callback(null, this.indices);
            return callback(err, ["SportingGoods"]);
        });
    };

    this.searchByIndex = function(query, callback) {
        this.options = {
            Keywords: query.keywords,
            SearchIndex: query.searchIndex,
            ResponseGroup: "Large"
            // ResponseGroup: "ItemAttributes, Images, OfferFull",
            // Sort: "sale-flag"
        };

        this.amazonApi(this.options, function(err, result) {
            let results = [];

            result.forEach(function(item) {
                let entry = {
                    url: item.DetailPageURL,
                    title: item.ItemAttributes.Title
                };

                // if (item.MediumImage && item.OfferSummary.LowestNewPrice && item.OfferSummary.LowestNewPrice.FormattedPrice) {
                    if (item.MediumImage) {
                    entry.image = item.MediumImage.URL;
                    // entry.price = item.OfferSummary.LowestNewPrice.FormattedPrice;
                    results.push(entry);
                }
            });

            return callback(null, results);
        });
    }
};

Amazon.prototype.search = function(query, callback) {

    // If no query or empty query
    if (query === "" || !query) {
        return callback(null, undefined);
    }

    // var helpers = new Helpers(this.config);
    let self = this;
    // this.results = [];

    this.findIndices(query, function(err, indices) {
        if (err) {
            console.error(err);
            return callback(err, {});
        }

        let allResults = [],
            options = {
                keywords: query,
                searchIndex: indices[0]
            };

        self.searchByIndex(options, function(err, results) {
            allResults = allResults.concat(results);

            return callback(null, allResults);
        });

        // indices.forEach(function(index) {
        //     this.options = {
        //         keywords: query,
        //         searchIndex: index
        //     };
        //
        //     self.searchByIndex(this.options, function(err, results) {
        //         if (err) {
        //             console.error(err);
        //             return callback(err, {});
        //         }
        //
        //         allResults = allResults.concat(results);
        //
        //         return callback(null, allResults);
        //     });
        // });
    });
};

var Helpers = function(config) {
    this.aws = require('aws-lib');
    this.prodAdv = this.aws.createProdAdvClient(config.accessKeyId, config.accessKeySecret, config.associateId);

    this.amazonApi = function(options, callback) {
        this.prodAdv.call("ItemSearch", options, function(err, result) {
            if (err) {
                console.error(err);
                return callback(err, []);
            }
            if (result.Items.Request.IsValid === "False") {
                console.warn(new Error("invalid request to Amazon"));
                return callback(err, []);
            }
            this.productGroups = {};
            this.Indices = [];
            this.indicesConverter = {
                "Sports": "SportingGoods",
                "Lawn & Patio": "LawnAndGarden"
            };

            return callback(err, result.Items.Item);
        });
    };
};


Helpers.prototype.findIndices = function(query, callback) {

    this.options = {
        Keywords: query,
        SearchIndex: "All"
    };

    this.amazonApi(this.options, function(err, result) {

        this.results = [];

        result.forEach(function(item) {
            console.log(item);

            var entry = {
                url: item.DetailPageURL,
                title: item.ItemAttributes.Title
            };
            // if (item.MediumImage && item.OfferSummary.LowestNewPrice && item.OfferSummary.LowestNewPrice.FormattedPrice) {
                if (item.MediumImage) {
                entry.image = item.MediumImage.URL;
                // entry.price = item.OfferSummary.LowestNewPrice.FormattedPrice;
                this.results.push(entry);
            }
        });

        // return callback(null, this.results);
    });



    this.prodAdv.call("ItemSearch", this.options, function(err, result) {
        if (err) {
            console.error(err);
            return callback(err, []);
        }
        if (result.Items.Request.IsValid === "False") {
            console.warn(new Error("invalid request to Amazon"));
            return callback(err, []);
        }
        this.productGroups = {};
        this.Indices = [];
        this.indicesConverter = {
            "Sports": "SportingGoods",
            "Lawn & Patio": "LawnAndGarden"
        };

        // Find out what product groups are being displayed
        result.Items.Item.forEach(function(item) {
            this.productGroup = item.ItemAttributes.ProductGroup;
            // If product group exists add one to count
            if(this.productGroups[this.productGroup]) {
                this.productGroups[this.productGroup] = this.productGroups[this.productGroup] + 1;
            // Otherwise add it and initialize its count
            } else {
                this.Indices.push(this.indicesConverter[this.productGroup]);
                this.productGroups[this.productGroup] = 1;
            }
        });

        // return callback(err, this.Indices); // NOTE - LawnAndGarden may not be working
        return callback(err, ["SportingGoods"]);

    });
};

Helpers.prototype.searchByIndex = function(queryParams, callback) {
    this.options = {
        Keywords: queryParams.keywords,
        SearchIndex: queryParams.searchIndex,
        ResponseGroup: "Large"
        // ResponseGroup: "ItemAttributes, Images, OfferFull",
        // Sort: "sale-flag"
    };

    this.amazonApi(this.options, function(err, result) {
        this.results = [];

        result.forEach(function(item) {
            var entry = {
                url: item.DetailPageURL,
                title: item.ItemAttributes.Title
            };

            // if (item.MediumImage && item.OfferSummary.LowestNewPrice && item.OfferSummary.LowestNewPrice.FormattedPrice) {
                if (item.MediumImage) {
                entry.image = item.MediumImage.URL;
                // entry.price = item.OfferSummary.LowestNewPrice.FormattedPrice;
                this.results.push(entry);
            }
        });

        return callback(null, this.results);
    });
};

Helpers.prototype.searchPopular = function(queryParams, callback) {
    this.options = {
        Keywords: queryParams.keywords,
        SearchIndex: queryParams.searchIndex,
        ResponseGroup: "TopSellers"
        // ResponseGroup: "ItemAttributes, Images, OfferFull",
        // Sort: "sale-flag"
    };

    this.amazonApi(this.options, function(err, result) {
        console.log("result");
    });

    this.prodAdv.call("ItemSearch", this.options, function(err, result) {
        if (err) {
            console.error(err);
            return callback(err, []);
        }
        if (result.Items.Request.IsValid === "False") {
            console.warn(new Error("invalid request to Amazon"));
            return callback(err, []);
        }
        this.results = [];


        result.Items.Item.forEach(function(item) {
            // if (item.Offer) {
                console.log("item: ", item);
                // console.log("item.OfferSummary: ", item.OfferSummary);
                // console.log("item.Offers: ", item.Offers);
                // console.log("item.Offer.OfferListing.OfferListingId: ", item.Offer);

                var entry = {
                    url: item.DetailPageURL,
                    title: item.ItemAttributes.Title
                };
                // if (item.MediumImage && item.OfferSummary.LowestNewPrice && item.OfferSummary.LowestNewPrice.FormattedPrice) {
                    if (item.MediumImage) {
                    entry.image = item.MediumImage.URL;
                    // entry.price = item.OfferSummary.LowestNewPrice.FormattedPrice;
                    this.results.push(entry);
                }
            // }
        });

        return callback(err, this.results);
    });
};

module.exports = Amazon;
