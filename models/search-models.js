var Search = function() {
    'use strict';
    this.config = require('config');
    this.Amazon = require('./amazon-models.js');
};

Search.prototype.search = function(options, callback) {
    this.amazon = new this.Amazon(this.config);
    this.amazon.search(options, function(err, results) {
        callback(err, results);
    });
};

module.exports = Search;
