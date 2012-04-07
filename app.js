
/**
 * Module dependencies.
 */

var express = require('express'),
    lessMW = require('less-middleware'),
    routes = require('./routes'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.session_key }));
  app.use(app.router);
  app.use(lessMW({ src: __dirname + '/public', compress: true }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(config.listen, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
