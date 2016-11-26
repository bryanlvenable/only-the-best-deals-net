var Express = function(config) {
    'use strict';
    this.config = config;
    this.Amazon = require('./amazon-models.js');
};

Express.prototype.search = function(options, callback) {
    this.amazon = new this.Amazon(this.config.amazonAssociates);
    this.amazon.search(options, function(err, results) {
        // TODO - currently only returning the first result's url
        callback(err, results[0].url[0]);
    });
};

module.exports = Express;
