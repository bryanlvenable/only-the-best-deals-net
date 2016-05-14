var Search = function() {
    this.Amazon = require('./amazon-models.js');
    this.config = require('config');
};

Search.prototype.search = function(options, callback) {
    this.amazon = new this.Amazon(this.config);
    this.amazon.search(options, function(err, results) {
        callback(err, results);
    });
};

module.exports = Search;
