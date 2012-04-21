/**
 * Module dependencies.
 */

// Change dir to the same as the app
process.chdir(__dirname);

var express = require('express'),
    lessMW = require('less-middleware'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    MPD = require('mpdsocket'),
    mpd = new MPD(config.mpd.host, config.mpd.port),
    routes = require('./routes').routes(mpd),
    everyauth = require('everyauth'),
    crypto = require('crypto'),
    CookieStore = require('cookie-sessions');

// Set up MPD hooks

function onMPDFail() {
  mpd.can_send = false;
  if(mpd.socket && mpd.isOpen) {
    mpd.socket.end();
    mpd.isOpen = false;
  }
  setTimeout(function() {
    setupMPDHooks();
    mpd.can_send = true;
  }, 5000);
}

function setupMPDHooks() {
  console.log('MPD: Opening connection to ' + config.mpd.host + ':' + config.mpd.port);
  mpd.open(config.mpd.host, config.mpd.port);

  mpd.on('error', function() {
    console.log('MPD: error');
    onMPDFail();
  });

  mpd.on('disconnect', function() {
    console.log('MPD: disconnected');
    onMPDFail();
  });

  mpd.on('connect', function() {
    console.log('MPD: Connected to server on ' + mpd.socket.address().address + ':' + mpd.socket.address().port);
    mpd.can_send = true;
    // Setup MPD password if needed
    if(config.mpd.password) {
      mpd.send('password ' + config.mpd.password, function(r) {
        console.log('MPD: Sent password to server. ' + (r._OK ? 'Authed' : 'Failed'));
      })
    }
  });
}

setupMPDHooks();

var app = module.exports = express.createServer();

// Auth Setup
everyauth.helpExpress(app);
everyauth.everymodule.findUserById( function (userId, callback) {
  console.log(arguments);
});

everyauth.password.authenticate(function(login, password) {
  var users = JSON.parse(fs.readFileSync('./users.json', 'utf8')),
      hash = new Buffer(crypto.createHash('sha1').update(password + config.session_key).digest()).toString('base64');

  console.log(login);
  console.log(users[login]);
  console.log(hash);
  if(users[login] === hash) {
    return {
      name: login,
      id: 0
    };
  }
  return ['Login Failed'];
})
.loginSuccessRedirect('/')
.getLoginPath('/login')
.postLoginPath('/login')
.registerUser(function() {})
.getRegisterPath('/register')
.postRegisterPath('/register')
.loginView('login');

everyauth.debug = true;

// Configuration

app.configure(function(){
  app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(lessMW({ src: __dirname + '/public', compress: true }));
  app.use(express.static(__dirname + '/public'));
  app.use(CookieStore({ secret: config.session_key }));
  app.use(everyauth.middleware());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Catch-all for auth - Force redirect to /login for all urls but /login when not logged in

app.all('/*', function(req, res, next) {
  if(req.session === undefined) req.session = {};
  if (req.loggedIn || req.url === '/login') {
    next();
  } else {
    res.redirect('/login');
  }
});

// Routes

app.get('/', routes.index);

// MPD
app.all('/mpd/*', function(req, res, next) {
  if(mpd.can_send) {
    mpd.socket.setTimeout(60000, function() {
      res.send(408);
      console.log('MPD: timed out');
      onMPDFail();
    });
    next();
  } else {
    res.send(204);
  }
});
app.post('/mpd/play', routes.mpd.play);
app.post('/mpd/stop', routes.mpd.stop);
app.post('/mpd/update', routes.mpd.update);
app.get('/mpd/status', routes.mpd.status);
app.get('/mpd/currentsong', routes.mpd.currentsong);

// Start listening
app.listen(config.listen, function(){
  console.log("G3 HAL server listening on port %d in %s mode", app.address().port, app.settings.env);
});