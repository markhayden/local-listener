var ngrok      = require('ngrok');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var colors     = require('colors/safe');

// configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set the port to use

// API ROUTES
// =============================================================================
var router = express.Router();

router.post('/post', function(req, res) {
    console.log('Request: POST /post');
    console.log(colors.cyan(JSON.stringify(req.body, null, 4)));
    console.log(colors.gray('--'));
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks');
});

// REGISTER THE ROUTES
app.use('/', router);

// START THE SERVER & NGROK TUNNEL
app.listen(port);
ngrok.connect(port, function (err, url) {
	console.log(colors.green('*****************************************************************************************************'));
	console.log(colors.green('SERVER READY'));
	console.log(colors.green('LISTENING AT: ' + url + '/post'));
	console.log(colors.green('EXAMPLE REQUEST:'), colors.white('curl -H "Content-Type: application/json" -X POST -d \'{"pickles":"yuck"}\' '+ url + '/post'));
	console.log(colors.green('*****************************************************************************************************'));
});