# Twilio-f
[![stdlib.com service](https://img.shields.io/badge/stdlib-0.1.4-green.svg?raw=true "stdlib.com service")](https://stdlib.com/services/nemo/twilio)

This service helps you forward calls or SMS that you receive on a Twilio Number to any phone number that you'd like.

It's a micro-service built using [stdlib](https://stdlib.com) that you can use as a Twilio [Number web-hook](https://support.twilio.com/hc/en-us/articles/223179908-Setting-up-call-forwarding#devs).

## Usage

This service is already available to be used on [stdlib here](http://stdlib.com/services/nemo/twilio), or you can fork it and launch your version of it on [stdlib](https://stdlib.com).

The main function is called `forward` and it accepts two parameters (other than the ones that come from Twilio):

- `type` - the type of forwarding to do: `call` or `SMS`.
- `ForwardTo` - the phone number to forward the call or SMS to.

So to construct a webhook that forwards all calls to `415-xxx-xxxx`, all you have to do is:

```
https://f.stdlib.com/nemo/twilio/forward?ForwardTo=+1415xxxxxxx&type=call
```

And to do the same for SMS:

```
https://f.stdlib.com/nemo/twilio/forward?ForwardTo=+1415xxxxxxx&type=SMS
```

You can use these URLs as the web-hooks in Twilio's [Voice](https://support.twilio.com/hc/en-us/articles/223179908-Setting-up-call-forwarding#devs) and [SMS](https://support.twilio.com/hc/en-us/articles/223134287-Forwarding-SMS-messages-to-another-phone-number#dev) web-hooks.

Enjoy forwarding!

## Functions

### /twilio/forward
[function spec](https://github.com/nemo/twilio-f/blob/master/f/forward/function.json) | [source](https://github.com/nemo/twilio-f/blob/master/f/forward/index.js)

This function responds with [Twiml](https://www.twilio.com/docs/api/twiml) that forwards a phone call or SMS to another number.
