const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors/safe');
const fs = require('fs');
const ngrok = require('ngrok');
require('dotenv').config();

const CONFIG_PATH = './config.json';

let config = {
  addr: 1234
};

try {
  const fileData = fs.readFileSync(CONFIG_PATH, 'utf8');
  const parsedConfig = JSON.parse(fileData);
  config = { ...config, ...parsedConfig };
} catch (err) {
  console.warn(colors.yellow(`No valid config.json found, using default config`));
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook endpoint
app.post('/post', (req, res) => {
  console.log(colors.cyan('📥 Incoming POST /post'));
  console.log(colors.yellow('🔍 Request Info:'));
  console.log(colors.gray(`Method: ${req.method}`));
  console.log(colors.gray(`URL: ${req.url}`));
  console.log(colors.yellow('📋 Headers:'));
  console.log(colors.gray(JSON.stringify(req.headers, null, 4)));
  console.log(colors.yellow('📦 Body:'));
  console.log(colors.green(JSON.stringify(req.body, null, 4)));
  console.log(colors.gray(''));
  console.log(colors.gray('--'));
  console.log(colors.gray(''));
  res.status(200).send('success');
});

// Start server
const server = app.listen(config.addr, async () => {
  // console.log(colors.blue(`🚀 Local server running at http://localhost:${config.addr}`));
  
  try {
    await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);
    const url = await ngrok.connect({
      proto: 'http',
      secure: true,
      addr: config.addr,
      authtoken: process.env.NGROK_AUTH_TOKEN,
      region: 'us',
      subdomain: process.env.NGROK_SUBDOMAIN
    });
    console.log(colors.green('\n💡 Webhook Listener Ready!'));
    console.log(colors.green(`🔗 Public URL: ${url}/post`));
    console.log(colors.green('📤 Example: curl -H "Content-Type: application/json" -X POST -d \'{"key":"value"}\' ' + url + '/post'));
    console.log(colors.green('📋 Headers will be shown in the output along with the body\n'));
  } catch (err) {
    console.error(colors.red('❌ Failed to start ngrok tunnel:'), err);
  }
});
