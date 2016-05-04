var Amazon = function() {
    this.config = require('config');
    this.aws = require('aws-lib');
    this.amazonConfig = this.config.get('amazonAssociates');
};

Amazon.prototype.search = function(options, callback) {
    this.prodAdv = this.aws.createProdAdvClient(this.amazonConfig.accessKeyId, this.amazonConfig.accessKeySecret, this.amazonConfig.associateId);

    // If no query or empty query
    if (options.keywords === "" || !options.keywords) {
        return callback(null, undefined);
    }

    this.query = {
        Keywords: options.keywords,
        SearchIndex: "SportingGoods",
        ResponseGroup: "ItemAttributes, Images"
    };
    console.log(this.query);

    this.prodAdv.call("ItemSearch", this.query, function(err, result) {
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
