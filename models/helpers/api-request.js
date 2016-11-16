let Request = function(config) {
    'use strict';
    this.config = config;   // TODO - see if I can remove this
    let request = require('request');
    let is = require('is_js');
    let parseString = require('xml2js').parseString;

    //////////////////////
    // Helper functions //
    //////////////////////
    this._sendRequest = function(options, callback) {
        request(options, function(err, res, body) {
            // console.log('Object.keys(res): ', Object.keys(res));
            // console.log('body: ', body);
            if (err) {
                return callback(err);
            }
            parseString(body, function(err, result) {
                if (err) {
                    return callback(err);
                }
                console.log('result: ', result);
                return callback(null, res.statusCode, result);
            });
        });
    };

    /*
    options = {
        keywords,       // REQUIRED
        searchIndex,    // OPTIONAL
        url: '',        // OPTIONAL
        service: '',    // OPTIONAL
        operation: '',  // OPTIONAL
    }
    */
    this.getAmazon = function(options, callback) {
        if (is.not.existy(options.searchIndex)) {
            // TODO type validation
            return callback(new Error('getAmazon(), options.searchIndex is required'));
        }
        if (is.not.existy(options.keywords)) {
            return callback(new Error('getAmazon(), options.keywords is required'));
        }
        if (is.not.existy(config.accessKeyId)) {
            return callback(new Error('getAmazon(), config.accessKeyId is required'));
        }
        if (is.not.existy(config.associateId)) {
            return callback(new Error('getAmazon(), config.associateId is required'));
        }

        const DEFAULT = {
            endpoint: 'https://webservices.amazon.com/onca/xml',
            service: 'AWSECommerceService',
            operation: 'ItemSearch',
            sort: 'price',
            version: '2011-08-02'
        };

        this.requestComponents = {
            // NOTE - Key capitalization consistent with Amazon docs
            endpoint: options.url || DEFAULT.endpoint,
            Service: options.service || DEFAULT.service,
            Operation: options.operation || DEFAULT.operation,
            Sort: options.sort || DEFAULT.price,
            Version: options.version || DEFAULT.version,
            Keywords: options.Keywords,
            AWSAccessKeyId: config.accessKeyId,
            AssociateTag: config.associateId,
            Timestamp: new Date().toISOString()    // [YYYY-MM-DDThh:mm:ssZ]
        };

        if (is.existy(options.responseGroup)) {
            this.requestComponents.ResponseGroup = options.responseGroup;
        }
        if (is.existy(options.searchIndex)) {
            this.requestComponents.SearchIndex = options.searchIndex;
        }
        if (is.existy(options.page)) {
            this.requestComponents.Page = options.page;
        }

        this.requestSignature = '';

        /********** Request example **********
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
        this.requestOrder = [
            'endpoint',
            'Service',
            'Operation',
            'AWSAccessKeyId',
            'AssociateTag',
            'SearchIndex',
            'Sort',
            'Keywords',
            'ResponseGroup',
            'Timestamp',
            'Signature'
        ];
        const length = this.requestOrder.length;
        this.params = '';

        this.params += this.requestComponents[this.requestOrder[0]] + '?';
        for (var i = 0; i < length - 1; i++) {
            this.params += this.requestOrder[i] + '=' + this.requestComponents[this.requestOrder[i]] + '&';
        }
        this.params += this.requestOrder[length - 1] + '=' + this.requestComponents[this.requestOrder[length - 1]];

        console.log('this.params: ', this.params);

        return callback(new Error('should go to home'));


        // request(this.params, function(err, res, body) {
        //     if (err) {
        //         return callback(err);
        //     }
        //     parseString(body, function(err, result) {
        //         if (err) {
        //             return callback(err);
        //         }
        //         console.log('result: ', result);
        //         return callback(null, res.statusCode, result);
        //     });
        // });


        // Make request
        // this._sendRequest(this.params, function(err, statusCode, body) {
        //     // console.log('body: ', body);
        //     if (statusCode !== '200') {
        //         return callback(err, new Error('statusCode: ' + statusCode));
        //     }
        //     return callback(err, body);
        // });
    };
};

module.exports = Request;
