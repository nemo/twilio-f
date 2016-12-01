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
    var toNumber = params.args[1] || params.kwargs.to || params.kwargs['To'];
    var fromNumber = params.args[2] || params.kwargs.From || params.kwargs['From'] || '';
    var messageBody = params.args[3] || params.kwargs.Body || params.kwargs.body || '';
    var forwardType = params.args[0] || params.kwargs.type || params.kwargs.Type || '';

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
