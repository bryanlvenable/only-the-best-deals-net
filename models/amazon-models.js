var Amazon = function() {
    this.config = require('config');
    this.aws = require('aws-lib');
    this.amazonConfig = this.config.get('amazonAssociates');
};

Amazon.prototype.search = function(options, callback) {
    this.prodAdv = this.aws.createProdAdvClient(this.amazonConfig.accessKeyId, this.amazonConfig.accessKeySecret, this.amazonConfig.associateId);

    // If no query or empty query
    if (options.Keywords === "" || !options.Keywords) {
        return callback(null, []);
    }

    this.prodAdv.call("ItemSearch", options, function(err, result) {
        console.log("result.Items: ", result.Items);
        // TODO: organize the results here.
        // TODO: do something with the results.Items!
        this.results = [];
        return callback(err, results);
    });
};

module.exports = Amazon;
