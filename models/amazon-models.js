var Amazon = function() {
    this.config = require('config');
    this.aws = require('aws-lib');
    this.amazonConfig = this.config.get('amazonAssociates');
};

Amazon.prototype.search = function(options, callback) {
    this.prodAdv = this.aws.createProdAdvClient(this.amazonConfig.accessKeyId, this.amazonConfig.accessKeySecret, this.amazonConfig.associateId);

    this.prodAdv.call("ItemSearch", options, function(err, result) {
        // console.log(result);
        // TODO: organize the results here.
        return callback(err, result);
    });
};

module.exports = Amazon;
