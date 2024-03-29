var Amazon = function(config) {
    'use strict';

    // Ensure object is called with new or Object.create:
    if (!(this instanceof Amazon)) {
        return new Amazon();
    }

    const aws = require('./helpers/aws.js');
    const prodAdv = aws.createProdAdvClient(config.accessKeyId, config.accessKeySecret, config.associateId);
    const is = require('is_js');

    // Internal methods
    this.amazonApi = function(options, callback) {
        prodAdv.call('ItemSearch', options, function(err, results) {
            if (err) {
                return callback(err);
            }
            // TODO - move this to api-request.js
            if (is.existy(results.ItemSearchResponse.Items[0]) && results.ItemSearchResponse.Items[0].Request[0].IsValid === "False") {
                return callback(new Error("invalid request to Amazon"));
            }
            if (is.not.existy(results.ItemSearchResponse.Items[0]) || is.not.existy(results.ItemSearchResponse.Items[0].Item) || is.not.existy(results.ItemSearchResponse.Items[0].Item[0])) {
                return callback(new Error(results.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Message[0]));
            }

            return callback(err, results.ItemSearchResponse.Items[0].Item);
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
            if (is.not.object(results)) {
                return callback(new Error('amazonApi() results should be an Object'));
            }

            let productGroups = {};
            let indicesConverter = {
                "Automotive Parts and Accessories": "Automotive",
                "Lawn & Patio": "LawnAndGarden",
                "Sports": "SportingGoods",
                // TODO: confirm and place in a-z order above
                "Amazon Instant Video": "UnboxVideo",
                "Major Appliances": "Appliances",  // DONE
                "Apps & Games": "MobileApps",
                "Arts, Crafts & Sewing": "ArtsAndCrafts",
                "Baby": "Baby",
                "Beauty": "Beauty",
                "Book": "Books",  // DONE - NOTE - this might take some fenagling with the query by index
                "CDs & Vinyl": "Music",
                "Cell Phones & Accessories": "Wireless",
                "Clothing, Shoes & Jewelry": "Fashion",
                "Clothing, Shoes & Jewelry - Baby": "FashionBaby",
                "Clothing, Shoes & Jewelry - Boys": "FashionBoys",
                "Clothing, Shoes & Jewelry - Girls": "FashionGirls",
                "Clothing, Shoes & Jewelry - Men": "FashionMen",
                "Clothing, Shoes & Jewelry - Women": "FashionWomen",
                "Collectibles & Fine Arts": "Collectibles",
                "Computers": "PCHardware",
                "Digital Music Album": "MP3Downloads",   // DONE
                "Digital Music Track": "MP3Downloads",   // DONE - So now I'm not sure if this is the right path. I will add in error handling later TODO! But for now I will continue on with the deals express.
                "Electronics": "Electronics",
                "Gift Cards": "GiftCards",
                "Grocery & Gourmet Food": "Grocery",
                "Health & Personal Care": "HealthPersonalCare",
                "Home & Kitchen": "HomeGarden",
                "Industrial & Scientific": "Industrial",
                "Kindle Store": "KindleStore",
                "Luggage & Travel Gear": "Luggage",
                "Magazine Subscriptions": "Magazines",
                "Movie": "Movies",  // DONE
                "Musical Instruments": "MusicalInstruments",
                "Office Products": "OfficeProducts",
                "Pet Supplies": "PetSupplies",
                "Prime Pantry": "Pantry",
                "Software": "Software",
                "Home Improvement": "Tools", // DONE
                "Toys & Games": "Toys",
                "Video Games": "VideoGames",
                "Wine": "Wine"
            };

            // Find out what product groups are being displayed
            results.forEach(function(item) {
                let productGroup = item.ItemAttributes[0].ProductGroup[0];
                if(productGroups[productGroup]) {   // If product group exists add one to count
                    productGroups[productGroup] = productGroups[productGroup] + 1;
                } else {    // Otherwise add it and initialize its count
                    // Check if we support that current index
                    // If we support it, it will be in indicesConverter
                    if (indicesConverter[productGroup] !== undefined) {
                        productGroups[productGroup] = 1;
                    } else {
                        // TODO - Log the product group that we haven't confirmed yet
                    }
                }
            });

            let mostFrequent = '',
                frequency = 0;
            for (var key in productGroups) {
                if (productGroups[key] > frequency) {
                    frequency = productGroups[key];
                    mostFrequent = key;
                }
            }
            // TODO - currently only returning the most frequent index
            return callback(err, indicesConverter[mostFrequent]);
        });
    };

    this.searchByIndex = function(query, callback) {
        this.options = {
            Keywords: query.keywords,
            SearchIndex: query.searchIndex,
            ResponseGroup: query.responseGroup,
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
                    title: item.ItemAttributes[0].Title,
                    iframe: item.CustomerReviews[0].IFrameURL
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
    const is = require('is_js');

    this.findIndices(query, function(err, index) {
        if (err) {
            return callback(err);
        }
        if (is.not.existy(index) || is.not.string(index) || index.length === 0) {
            return callback(new Error('index must be a string with non-zero length'));
        }

        let options = {
                keywords: query,
                searchIndex: index,
                responseGroup: "ItemAttributes, Images, OfferSummary, Reviews"
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
