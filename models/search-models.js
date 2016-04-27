var Search = function() {
    this.Amazon = require('./amazon-models.js');
};

Search.prototype.search = function(options, callback) {
    this.amazon = new this.Amazon();
    this.amazon.search(options, function(err, results) {
        callback(err, results);
    });
};

module.exports = Search;
