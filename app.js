var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var lessMiddleware = require('less-middleware');
var log4js = require('log4js');
var twigMarkdown = require('twig-markdown');
var twig = require('twig');
var MemcachedStore = require('connect-memcached')(session);

const { Client, UserService } = require("@caloriosa/rest-dto");

var index = require('./routes/index');
var user = require('./routes/user');
var login = require('./routes/login');

var logger = log4js.getLogger();
var accessLogger = log4js.getLogger("Access");
var app = express();
var client = new Client({
  url: process.env.SERVICE_URL || "http://10.0.0.143:8080"
});
// Configure sessions
var sessOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
};
// Init memcached session store if host defined by environment
if (process.env.SESSION_STORE) {
  logger.info("Using memcached session store: " + process.env.SESSION_STORE);
  sessOptions.store = new MemcachedStore({hosts: [process.env.SESSION_STORE]});
}

twig.extend(twigMarkdown);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(log4js.connectLogger(accessLogger, {level: 'auto', format: ':method :url :status :response-time ms (:remote-addr)'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session(sessOptions))
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/vendor', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/vendor', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use((req, res, next) => {
  req.client = client;
  console.dir(req.query);
  res.locals.alert = req.query.message;
  if (!req.session.token) {
    next();
    return;
  }
  let userService = new UserService(client, req.session.token);
  userService.fetchUser(req.session.identityId).then(user => {
    res.locals.user = user;
    next();
  }).catch(err => next(err.message));
});

app.use('/', index);
app.use('/user', user);
app.use('/sign', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  let status = err.httpStatus || {};
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

client.on("handle", (data, response) => {
  apiLogger = log4js.getLogger("API-call");
  apiLogger.info(`${response.responseUrl} - ${response.statusCode} ${data.status.code} "${data.status.message}"`);
});

module.exports = app;
