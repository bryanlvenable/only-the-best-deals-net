let Request = function(config) {
    'use strict';
    this.config = config;
    this.request = require('request');
    let is = require('is_js');

    //Helper function
    this._sendRequest = function(options, callback) {
        this.request(options, function(err, res, body) {
            if (err) {
                return callback(err);
            }
            return callback(null, res.statusCode, body);
        });
    };

    this.getAmazon = function(options, callback) {
        if (is.not.existy(options.SearchIndex)) {
            return callback(new Error('options.SearchIndex is required'));
        }
        if (is.not.existy(options.Keywords)) {
            return callback(new Error('options.Keywords is required'));
        }
        // if (is.not.existy(options.responseGroup)) {
        //     return callback(new Error('options.responseGroup is required'));
        // }

        // HOWTO - http://docs.aws.amazon.com/AWSECommerceService/latest/DG/Query_QueryAuth.html
        this.params = {
            url: 'https://webservices.amazon.com/onca/xml',
            method: 'GET',
            json: {
                Service: 'AWSECommerceService',
                Operation: 'ItemSearch',
                AWSAccessKeyId: config.accessKeyId,
                AssociateTag: config.associateId,
                SearchIndex: options.searchIndex,
                Sort: 'price',
                Keywords: options.keywords,
                // ResponseGroup: options.responseGroup,
                Timestamp: new Date().toISOString()    // [YYYY-MM-DDThh:mm:ssZ]
            }
        };

        // Create signature
        this.requestSignature = '';
        // HOWTO - http://docs.aws.amazon.com/AWSECommerceService/latest/DG/rest-signature.html

        this.params.json.Signature = this.requestSignature;

        console.log('params: ', this.params);

        // Make request
        this._sendRequest(this.params, function(err, statusCode, body) {
            console.log('body: ', body);
            if (statusCode !== '200') {
                return callback(err, new Error('statusCode: ' + statusCode));
            }
            return callback(err, body);
        });
    };
};

/*
http://webservices.amazon.com/onca/xml?
Service=AWSECommerceService&
Operation=ItemSearch&
AWSAccessKeyId=[Access Key ID]&
AssociateTag=[Associate ID]&
SearchIndex=FashionMen&
Sort=price&
Keywords=lacoste%20polo&
ResponseGroup=Accessories%2CImages%2CItemAttributes
&Timestamp=[YYYY-MM-DDThh:mm:ssZ]
&Signature=[Request Signature]
*/

module.exports = Request;
