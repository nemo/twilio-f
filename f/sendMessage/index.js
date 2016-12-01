var _ = require('lodash');
var async = require('async');
var twilio = require('twilio');

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
    if (!process.env.TWILIO_ACCOUNT_SID || ! process.env.TWILIO_ACCOUNT_AUTH) {
        return callback({
            status: "failure",
            message: "You need to set TWILIO_ACCOUNT_SID and TWILIO_ACCOUNT_AUTH enviornment variables for this function to work."
        });
    }

    var client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_AUTH);
    var splitLength = parseInt(params.kwargs.splitLength || '320');
    var options = _.omit(params.kwargs, ['body', 'Body', 'mediaUrls', 'MediaUrls', 'mediaUrl', 'MediaUrl', 'splitLength']);
    var messageBodies = splitTextToChunks(params.kwargs.Body || params.kwargs.body || '', _.isNumber(splitLength) ? splitLength : 320) || [];
    var mediaUrls = params.kwargs.mediaUrls || params.kwargs.MediaUrls || (params.kwargs.mediaUrl && [params.kwargs.mediaUrl]) || [];

    if (_.isString(mediaUrls))
        mediaUrls = [mediaUrls];

    var numberOfMessages = _.range(0, _.max([messageBodies.length, mediaUrls.length]));
    var messages = _.map(numberOfMessages, (index) => {
        var messageOptions = _.cloneDeep(options);

        // Shouldn't happen.
        if (!messageBodies[index] && !mediaUrls[index]) return null;

        if (messageBodies[index])
            messageOptions.body = messageBodies[index];

        if (mediaUrls[index])
            messageOptions.mediaUrl = mediaUrls[index];

        return messageOptions;
    });

    var response = [];
    var failures = 0;

    debugger;
    async.eachSeries(_.compact(messages), (message, callback) =>
        client.messages.create(message, (err, result) => {
            if (err) {
                failures += 1;
                response.push({
                    message: message,
                    status: "failure",
                    error: err
                });
            }
            else
                response.push({
                    message: message,
                    status: "ok",
                    result: result
                });

            // Wait for a bit before we send the next chunk.
            // This is so the carriers do a better job at sending messages in order
            // Note that this does not garauntee in order delivery (unfortunately)
            setTimeout(callback, 500)
        })
    , (err) => {
        if (failures === response.length) return callback(response);
        else return callback(null, response);

    })
};


function splitTextToChunks(fullText, length) {
    if (!fullText) return [];
    if (!fullText.length) return [];
    if (!length) return [fullText];
    if (fullText.length < length) return [fullText];

    function splitToChunks(text) {
        if (!text) return null;
        if (!text.length) return null;
        if (text.length < length) return text;

        var curr = length, prev = 0;

        output = [];

        while(text[curr]) {
          if(text[curr++] == ' ') {
            output.push(text.substring(prev,curr));
            prev = curr;
            curr += length;
          }
          else
          {
            var currReverse = curr;
            do {
                if(text.substring(currReverse - 1, currReverse) == ' ') {
                    output.push(text.substring(prev,currReverse));
                    prev = currReverse;
                    curr = currReverse + length;
                    break;
                }
                currReverse--;
            } while(currReverse > prev)
          }
        }

        output.push(text.substr(prev));
        return output;
    }

    return _(fullText.split("\n")).map(function(txt) {
        return splitToChunks(txt);
    })
    .flatten()
    .compact()
    .map(function(txt) {
        return txt.trim();
    })
    .value();
};
