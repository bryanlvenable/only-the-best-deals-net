let Request = function(config) {
    'use strict';
    const request = require('request');
    const is = require('is_js');
    const parseString = require('xml2js').parseString;
    const crypto = require('crypto');

    /*
    options = {
        keywords,       // REQUIRED
        searchIndex,    // REQUIRED
        url: '',        // OPTIONAL
        service: '',    // OPTIONAL
        operation: '',  // OPTIONAL
    }
    */
    this.getAmazon = function(options, callback) {
        if (is.not.existy(options.keywords)) {
            // TODO type validation
            return callback(new Error('getAmazon(), options.keywords is required'));
        }
        if (is.not.existy(options.keywords)) {
            // TODO type validation
            return callback(new Error('getAmazon(), options.keywords is required'));
        }
        if (is.not.existy(config.accessKeyId)) {
            return callback(new Error('getAmazon(), config.accessKeyId is required'));
        }
        if (is.not.existy(config.associateId)) {
            return callback(new Error('getAmazon(), config.associateId is required'));
        }
        if (is.not.existy(config.accessKeySecret)) {
            return callback(new Error('getAmazon(), config.accessKeySecret is required'));
        }

        const DEFAULT = {
            endpoint: 'https://webservices.amazon.com/onca/xml',
            service: 'AWSECommerceService',
            operation: 'ItemSearch',
            searchIndex: 'All',
            sort: 'price',
            version: '2011-08-02'
        };

        let queryComponents = {
            // NOTE - Key capitalization consistent with Amazon docs
            Sort: options.sort || DEFAULT.sort,
            endpoint: options.url || DEFAULT.endpoint,
            Service: options.service || DEFAULT.service,
            Operation: options.operation || DEFAULT.operation,
            SearchIndex: options.searchIndex || DEFAULT.searchIndex,
            Version: options.version || DEFAULT.version,
            Keywords: options.keywords,
            AWSAccessKeyId: config.accessKeyId,
            AssociateTag: config.associateId,
            Timestamp: new Date().toISOString()    // [YYYY-MM-DDThh:mm:ssZ]
        };

        if (is.existy(options.responseGroup)) {
            queryComponents.ResponseGroup = options.responseGroup;
        }
        if (is.existy(options.searchIndex)) {
            queryComponents.SearchIndex = options.searchIndex;
        }
        if (is.existy(options.page)) {
            queryComponents.Page = options.page;
        }

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
            'Service',
            'Operation',
            'AWSAccessKeyId',
            'AssociateTag',
            'SearchIndex',
            'Sort',
            'Keywords',
            'ResponseGroup',
            'Timestamp'
        ],
        length = requestOrder.length;

        /*
        Steps to sign request
        1. Enter the time stamp. Use the UTC time 2014-08-18T12:00:00Z.
        2. URL encode the request's comma (,) and colon (:) characters, so that they don't get misinterpreted. For more information about converting to RFC 3986 specifications, see documentation and code samples for your programming language.
        3. Split the parameter/value pairs and delete the ampersand characters (&). The linebreaks used in the following example follow Unix convention (ASCII 0A, "line feed" character).
        4. Sort your parameter/value pairs by byte value (not alphabetically, lowercase parameters will be listed after uppercase ones).
        5. Rejoin the sorted parameter/value list with ampersands. The result is the canonical string that we'll sign.
        6. Prepend the following three lines (with line breaks) before the canonical string:
        'GET\n
        webservices.amazon.com\n
        /onca/xml\n'
        7. [example]
        8. Calculate an RFC 2104-compliant HMAC with the SHA256 hash algorithm.
        9. URL encode the plus (+) and equal (=) characters in the signature.
        10. Add the URL encoded signature to your request, and the result is a properly-formatted signed request.
        */

        let signature = '',
        signatureComponents = [],
        hashedSignature,
        query;

        // 1. Enter the time stamp.
        queryComponents.Timestamp = new Date().toISOString();   // [YYYY-MM-DDThh:mm:ssZ]

        // 2. URL encode the request's comma (,) and colon (:) characters TODO.
        query = queryComponents.endpoint + '?';

        for (var i = 0; i < length; i++) {
            query += requestOrder[i] + '=' + queryComponents[requestOrder[i]] + '&';
        }

        // query = encodeURIComponent(query);

        // 3. Split the parameter/value pairs
        for (let key in queryComponents) {
            if (key === 'endpoint') {
                continue;
            }
            let keyValue = '' + key + '=' + queryComponents[key] + '\n';
            // Alternate to '\n' is ''.fromCharCode(0A)
            keyValue = encodeURIComponent(keyValue);
            signatureComponents.push(keyValue);
        }

        // 4. Sort parameter/value pairs by byte value
        signatureComponents.sort();

        // 5. Rejoin the sorted parameter/value list with ampersands.
        signature = signatureComponents.join('&');
        // 6. Prepend the uri
        signature = 'GET\nwebservices.amazon.com\n/onca/xml\n' + signature;

        signature = signature.replace(/,/g, encodeURIComponent(','));
        signature = signature.replace(/:/g, encodeURIComponent(':'));

        // 7. Hash signature
        hashedSignature = crypto.createHmac('sha256', config.accessKeySecret)
        .update(signature).digest('base64');

        query += 'Signature' + '=' + hashedSignature;

        console.log('query: ', query);

        // return callback(new Error('should go to home'));

        request(query, function(err, res, body) {
            if (err) {
                return callback(err);
            }
            parseString(body, function(err, results) {
                if (err) {
                    return callback(err);
                }
                if (is.existy(results.ItemSearchErrorResponse)) {
                    console.log('results.ItemSearchErrorResponse.Error: ', results.ItemSearchErrorResponse.Error);
                } else {
                    console.log('results: ', results);
                }
                return callback(null, res.statusCode, results);
            });
        });

    };
};

module.exports = Request;
