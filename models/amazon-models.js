var Amazon = function() {
    this.config = require('config');
    this.aws = require('aws-lib');
    this.amazonConfig = this.config.get('amazonAssociates');
};

Amazon.prototype.search = function(options, callback) {
    this.prodAdv = this.aws.createProdAdvClient(this.amazonConfig.accessKeyId, this.amazonConfig.accessKeySecret, this.amazonConfig.associateId);

    // If no query or empty query
    if (options.Keywords === "" || !options.Keywords) {
        return callback(null, undefined);
    }

    this.prodAdv.call("ItemSearch", options, function(err, result) {
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

module.exports = Amazon;
