var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authentication = require('./authentication');
var session = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var https = require('https');
var http = require('http');
var uuid = require('uuid');
var fs = require('fs');
var storage = require('node-persist');
const url = require('url');


var api = require('./routes/api');
var index = require('./routes/index');

const oneHour = 3600000;    // 3600000msec == 1hour

var client;
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  client = require("redis").createClient(rtg.port, rtg.hostname);

  client.auth(rtg.auth.split(":")[1]);
} else if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  console.log("Connecting to redis");
  client = require("redis").createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
} else {
  client = redis.createClient();
}

var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen = function () {
    var server = https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/mkcad.julias.ch/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/mkcad.julias.ch/fullchain.pem')
    }, app);
    return server.listen.apply(server, arguments)
  }

authentication.init();

storage.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hbs').__express);
app.set('view engine', 'html');

//app.disable('etag');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(logger('dev'));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneHour }));

app.use(session({
  store: new RedisStore({
    'client': client
  }),
  secret: 'mkcad',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: true,
    sameSite: 'none'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.status(200);
    return next()
  }
  res.status(401).redirect('/oauthSignin' + url.parse(req.url,true).search);
}

app.use('/api', api);

app.use('/application', ensureAuthenticated);
app.use('/application', express.static(path.join(__dirname, 'public/application'), { maxAge: oneHour })); 
app.post('/notify', api.sendNotify);
app.get('/grantDenied', index.grantDenied);

// GET /oauthSignin
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Onshape authentication will involve redirecting
//   the user to onshape.com.  After authorization, Onshape will redirect the user
//   back to this application at /oauthRedirect
app.use('/oauthSignin', storeExtraParams,
    function(req, res){
      // The request will be redirected to Onshape for authentication, so this
      // function will not be called.
    }
);

function storeExtraParams(req, res) {
  var redirect = req.query.redirectOnshapeUri;
  if (redirect === undefined) {
    redirect = "/application" + url.parse(req.url,true).search;
  }

  var state = {
    redirect: redirect
  };

  var stateString = JSON.stringify(state);
  var uniqueID = "state" + req.sessionID;
  client.set(uniqueID, stateString);

  return passport.authenticate("onshape")(req, res);
}

// GET /oauthRedirect
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   signin page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.use('/oauthRedirect',
    passport.authenticate('onshape', { failureRedirect: '/grantDenied' }),
    function(req, res) {
      var uniqueID = "state" + req.sessionID;
      client.get(uniqueID, function(err, reply) {
        // reply is null when the key is missing
        if (reply != null) {
          
          var newParams = JSON.parse(reply);
          res.redirect(newParams.redirect);
        }
        else {
          var querystring = url.parse(req.url,true).search;
          if (querystring === null || querystring === undefined) {
            querystring = "";
          }
          res.redirect("/application" + querystring);
        }
      });
    });

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});

module.exports = app;
