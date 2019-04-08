# Twilio-f
[![stdlib.com service](https://img.shields.io/badge/stdlib-0.1.5-green.svg?raw=true "stdlib.com service")](https://stdlib.com/services/nemo/twilio)

This service helps you forward calls or SMS that you receive on a Twilio Number to any phone number that you'd like.

It's a micro-service built using [stdlib](https://stdlib.com) that you can use as a Twilio [Number web-hook](https://support.twilio.com/hc/en-us/articles/223179908-Setting-up-call-forwarding#devs).

## Usage

### SMS & Call Forwarding
This service is already available to be used on [stdlib here](https://stdlib.com/@nemo/lib/twilio/), or you can fork it and launch your version of it on [stdlib](https://stdlib.com).

The main function is called `forward` and it accepts two parameters (other than the ones that come from Twilio):

- `type` - the type of forwarding to do: `call` or `SMS`.
- `ForwardTo` - the phone number to forward the call or SMS to.

So to construct a webhook that forwards all calls to `415-xxx-xxxx`, all you have to do is:

```
https://nemo.api.stdlib.com/twilio/forward?ForwardTo=+1415xxxxxxx&type=call
```

And to do the same for SMS:

```
https://nemo.api.stdlib.com/twilio/forward?ForwardTo=+1415xxxxxxx&type=SMS
```

You can use these URLs as the web-hooks in Twilio's [Voice](https://support.twilio.com/hc/en-us/articles/223179908-Setting-up-call-forwarding#devs) and [SMS](https://support.twilio.com/hc/en-us/articles/223134287-Forwarding-SMS-messages-to-another-phone-number#dev) web-hooks.

Enjoy forwarding!


### Sending Messages

Twilio provides a great API for [sending messages](https://www.twilio.com/docs/api/rest/sending-messages). However, after building a few chat-bots and SMS products, you learn a thing or two. This service makes it easier to deliver messages and provide a better experience for the receiver. It's also a great and scalable way to wrap your messaging service.


The main features are that it handles **multiple mediaUrls**, automatically **truncates long messages** and **attempts to control delivery order** using timeouts.

You have to set the following environment variables to make the function work (which means you have to fork this repo and submit your own [stdlib](https://stdlib.com) function!):

- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_ACCOUNT_AUTH` - Twilio Account Auth

After you've set those, you can call the function (built on top of [twilio's node sdk](https://www.twilio.com/docs/api/rest/sending-messages?code-sample=code-send-a-message-with-an-image-url&code-language=js&code-sdk-version=2.x)):

```javascript
var f = require('f');

f("<stdlib-username>/twilio/sendMessage")({
    to: "+1415xxxxxxx",
    from: "+1415xxxxxxx",
    body: "Body goes here",
    mediaUrls: ["path-to-url"],
    splitLength: 160, // optional, set to 0 if you want to disable splitting
    MessagingServiceSid: '<MessagingServiceSid>', // optional
    StatusCallback: '<StatusCallback>', // optional
    ApplicationSid: '<ApplicationSid>', // optional
    MaxPrice: "<MaxPrice>", // optional
    ProvideFeedback: "<ProvideFeedback>", // optional
    otherParameter: "Other params accepted by Twilio's node sdk"
});
```

The result will be **an array** with a `status` set to `ok` or `failure`, `message` set to the payload that was sent, and `result` or `error` being the response from Twilio.

## Functions

### /twilio/forward
[function spec](https://github.com/nemo/twilio-f/blob/master/f/forward/function.json) | [source](https://github.com/nemo/twilio-f/blob/master/f/forward/index.js)

This function responds with [Twiml](https://www.twilio.com/docs/api/twiml) that forwards a phone call or SMS to another number.


### /twilio/sendMessage
[function spec](https://github.com/nemo/twilio-f/blob/master/f/sendMessage/function.json) | [source](https://github.com/nemo/twilio-f/blob/master/f/sendMessage/index.js)

This function sends a message using Twilio's [messages.create](https://www.twilio.com/docs/api/rest/sending-messages?code-sample=code-send-a-message-with-an-image-url&code-language=js&code-sdk-version=2.x) API. It handles cases were the message body is too long, only a media Url is provided or multiple mediaUrls are being sent.


## LICENSE
MIT
