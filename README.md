## Local Webhook Receiver

Very simple node app that opens a public tunnel and logs all POST requests to console. Used for testing webhooks, curl commands, etc. 

## Setup
1. `npm install`  
2. `node server.js`

## Customization
Using the `config.json` file you can pass more detailed settings to ngrok. `example_config.json` has been included to showcase all available settings. More details on settings can be found [here](https://www.npmjs.com/package/ngrok).

![screen shot](https://raw.githubusercontent.com/markhayden/local-listener/master/img/screenshot.png)
