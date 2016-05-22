var Search = function(config) {
    'use strict';
    this.config = config;
    this.Amazon = require('./amazon-models.js');
};

Search.prototype.search = function(options, callback) {
    this.amazon = new this.Amazon(this.config.amazonAssociates);
    this.amazon.search(options, function(err, results) {
        callback(err, results);
    });
};

module.exports = Search;
