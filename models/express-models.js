var Express = function(config) {
    'use strict';
    this.config = config;
    this.Amazon = require('./amazon-models.js');
};

Express.prototype.search = function(options, callback) {
    const is = require('is_js');
    this.amazon = new this.Amazon(this.config.amazonAssociates);
    this.amazon.search(options, function(err, results) {
        if (is.not.existy(results) || is.not.array(results)) {
            return callback(new Error('results are not an array'));
        }
        if (is.not.existy(results[0].url) || is.not.array(results[0].url)) {
            return callback(new Error('results[0].url are not an array'));
        }
        // TODO - currently only returning the first result's url
        callback(null, results[0].url[0]);
    });
};

module.exports = Express;
