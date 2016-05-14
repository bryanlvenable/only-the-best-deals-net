var Amazon = function(config) {
    this.config = config;
};

Amazon.prototype.search = function(query, callback) {

    // If no query or empty query
    if (query === "" || !query) {
        return callback(null, undefined);
    }

    var helpers = new Helpers(this.config);

    helpers.findIndices(query, function(err, indices) {
        if (err) {
            console.error(err);
            return callback(err, {});
        }

        var allResults = [];

        indices.forEach(function(index) {
            this.options = {
                keywords: query,
                searchIndex: index
            };

            helpers.searchByIndex(this.options, function(err, results) {
                if (err) {
                    console.error(err);
                    return callback(err, {});
                }

                allResults = allResults.concat(results);

                return callback(null, allResults);
            });
        });
    });
};

var Helpers = function(config) {
    this.aws = require('aws-lib');
    this.amazonConfig = config.get('amazonAssociates');
    this.prodAdv = this.aws.createProdAdvClient(this.amazonConfig.accessKeyId, this.amazonConfig.accessKeySecret, this.amazonConfig.associateId);
};


Helpers.prototype.findIndices = function(query, callback) {

    this.options = {
        Keywords: query,
        SearchIndex: "All"
    };

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
            if(this.productGroups[this.productGroup]) {
                this.productGroups[this.productGroup] = this.productGroups[this.productGroup] + 1;
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
                // console.log("item: ", item);
                // console.log("item.OfferSummary: ", item.OfferSummary);
                // console.log("item.Offers: ", item.Offers);
                console.log("item.Offer.OfferListing.OfferListingId: ", item.Offer);

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
