var express = require('express')
	, favicon = require('serve-favicon')
	, logger = require('morgan')
	, bodyParser = require('body-parser')
	, methodOverride = require('method-override')
	, errorHandler = require('errorhandler')
	, multipart = require('connect-multiparty')
  , http = require('http')
  , path = require('path');
global.config = require('./config.js');

var app = express();
var multipartMiddleware = multipart();

app.set('port', config.port || 9999);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
keepExtensions: true, 
	uploadDir: '/var/www/remaxthailand/upload/tmp',
	limit: '2mb'
}));

app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(errorHandler());
}

// Routes

app.get('/', function(req, res) {
  //res.render('index');
  res.end();
});

app.post('/', multipartMiddleware, function(req, res) {

var json = {};
json.success = false;

	res.header('Access-Control-Allow-Origin', '*');
  var fs = require('fs');

var sp = req.files.myFile.name.split('.');
  var is = fs.createReadStream(req.files.myFile.path);
  var name = req.body.type+'/'+req.body.dir+'/'+req.body.mobile+'-'+req.body.index+'.'+sp[sp.length-1].toLowerCase();
var os = fs.createWriteStream('/var/www/images/'+name);//=req.files.myFile.name);

is.pipe(os);
is.on('end',function() {
    fs.unlinkSync(req.files.myFile.path);
	
json.success = true;
json.filename = 'https://img.remaxthailand.co.th/'+name;
res.json(json);
});

  /*fs.rename(req.files.myFile.path, '/var/www/images/register/shop/'+req.files.myFile.name, function(err) {
	  if(err){
		  console.log(err);
	  }
	  else {
		  console.log('Upload '+'/var/www/images/register/shop/'+req.files.myFile.name+' Success');
	  }
  });*/
  //res.end();
});

app.options('/', multipartMiddleware, function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	console.log(req.files);
  res.end();
});

// Start the app

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Private functions

var fs = require('fs');

var deleteAfterUpload = function(path) {
  setTimeout( function(){
    /*fs.unlink(path, function(err) {
      if (err) console.log(err);
      console.log('file successfully deleted');
    });*/
  }, 60 * 1000);
};