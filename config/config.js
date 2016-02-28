var properties = require('./properties.json');

var environment = properties.environment;

module.exports = properties[environment];
