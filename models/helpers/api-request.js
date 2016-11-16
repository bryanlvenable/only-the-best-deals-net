let Request = function(config) {
    'use strict';
    let request = require('request');
    let is = require('is_js');
    let parseString = require('xml2js').parseString;

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

        let requestComponents = {
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
            requestComponents.ResponseGroup = options.responseGroup;
        }
        if (is.existy(options.searchIndex)) {
            requestComponents.SearchIndex = options.searchIndex;
        }
        if (is.existy(options.page)) {
            requestComponents.Page = options.page;
        }

        let requestSignature = '';


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
        const requestOrder = [
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
        const length = requestOrder.length;
        let params = '';

        params += requestComponents[requestOrder[0]] + '?';
        for (var i = 0; i < length - 1; i++) {
            params += requestOrder[i] + '=' + requestComponents[requestOrder[i]] + '&';
        }
        params += requestOrder[length - 1] + '=' + requestComponents[requestOrder[length - 1]];

        console.log('params: ', params);

        return callback(new Error('should go to home'));

        // request(params, function(err, res, body) {
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

    };
};

module.exports = Request;
