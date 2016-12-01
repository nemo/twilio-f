var qs = require('qs');
var twilio = require('twilio');
var util = require('util');

/**
* Your function call
* @param {Object} params Execution parameters
*   Members
*   - {Array} args Arguments passed to function
*   - {Object} kwargs Keyword arguments (key-value pairs) passed to function
*   - {String} remoteAddress The IPv4 or IPv6 address of the caller
*
* @param {Function} callback Execute this to end the function call
*   Arguments
*   - {Error} error The error to show if function fails
*   - {Any} returnValue JSON serializable (or Buffer) return value
*/
module.exports = (params, callback) => {
    var formData = params.buffer && params.buffer.toString() || '';
    var formParams = formData && formData.length && qs.parse(formData) || {};
    var options = Object.assign({}, params.kwargs, formParams);

    var toNumber =  options.forward_to || options['ForwardTo'] || params.args[1] || 'bad-number';
    var fromNumber =  options.From || options['From'] || params.args[2] || '';
    var messageBody = options.Body || options.body || params.args[3] || '';
    var forwardType = options.type || options.Type || params.args[0] || '';

    var response = new twilio.TwimlResponse();

    if (forwardType.toLowerCase() === 'call') {
        response.dial(toNumber);
    } else {
        var message = util.format("%s: %s", fromNumber, messageBody);

        response.message(message, {
            to: toNumber
        });
    }



    callback(null, new Buffer(response.toString()));
};
