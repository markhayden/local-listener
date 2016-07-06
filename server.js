var ngrok      = require('ngrok');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var fs         = require('fs');
var bodyParser = require('body-parser');
var colors     = require('colors/safe');

// defaults
fs.readFile('config.json', 'utf8', function (err, data) {
	// **************************
  // CONFIG
  // **************************
  var config = {};
  if (err) {
    config = {}
  }

  if (typeof data !== 'undefined' && data !== '') {
	  config = JSON.parse(data);
	}

  // set defaults
  if (!config.addr) {
  	config.addr = 8080;
  }

  // **************************
  // PRIMARY APP
  // **************************

	// configure app to use bodyParser(), this will let us get the data from a POST
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	// API ROUTES
	// =============================================================================
	var router = express.Router();

	router.post('/post', function(req, res) {
	    console.log('Request: POST /post');
	    console.log(colors.cyan(JSON.stringify(req.body, null, 4)));
	    console.log(colors.gray('--'));
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    res.end('success');
	});

	// REGISTER THE ROUTES
	app.use('/', router);

	// START THE SERVER & NGROK TUNNEL
	app.listen(config.addr);

	ngrok.connect(config, function (err, url) {
		if (err) {
    	console.error("Failed to start server.", err);
  	}

		console.log(colors.green('*************************************************************************************************************************'));
		console.log(colors.green('SERVER READY'));
		console.log(colors.green('LISTENING AT: ' + url + '/post'));
		console.log(colors.green('EXAMPLE REQUEST:'), colors.white('curl -H "Content-Type: application/json" -X POST -d \'{"pickles":"yuck"}\' '+ url + '/post'));
		console.log(colors.green('*************************************************************************************************************************'));
	});
});