var properties = {};

if (process.env.NODE_ENV === 'production') {
    properties = {
        "amazonAssociates": {
            "accessKeyId": process.env.AMAZON_ID,
            "accessKeySecret": process.env.AMAZON_KEY,
            "associateId": process.env.AMAZON_ASSOCIATE_ID
        }
    };
} else {
    properties = require('./development.json');
}

module.exports = properties;
