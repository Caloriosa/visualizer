var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var sassMiddleware = require('node-sass-middleware');
var log4js = require('log4js');
var twigMarkdown = require('twig-markdown');
var twig = require('twig');
var MemcachedStore = require('connect-memcached')(session);
var flash = require('connect-flash');

const { Client, UserService } = require("@caloriosa/rest-dto");

var WebError = require("./misc/WebError");

var index = require('./routes/index');
var user = require('./routes/user');
var login = require('./routes/login');
var devices = require('./routes/devices');

var logger = log4js.getLogger();
var accessLogger = log4js.getLogger("Access");
var app = express();

/**
 * Client configuration
 */
const clientOptions = {
  url: process.env.SERVICE_URL || "http://localhost:6060"
};

/**
 * Session configuration
 */
var sessOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
};
if (process.env.SESSION_STORE) {
  // Init memcached session store if host defined by environment
  logger.info("Using memcached session store: " + process.env.SESSION_STORE);
  sessOptions.store = new MemcachedStore({hosts: [process.env.SESSION_STORE]});
}

/**
 * Setup Twig extensions
 */
twig.extend(twigMarkdown);

/**
 * View engine setup
 */
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
app.use(flash());
app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, "public"),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compressed',
  error: (err) => {
    let _logger = log4js.getLogger("SassCompiler")
    _logger.error(err);
  },
  log: (severity, key, value) => {
    let _logger = log4js.getLogger("SassCompiler")
    _logger.debug(`${severity} ${key} ${value}`);
  }
}));
app.use(renderOverhead);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/vendor', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/vendor', express.static(__dirname + '/node_modules/jquery-validation/dist'));
app.use('/vendor', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));
app.use((req, res, next) => {
  req.client = createClient(req.session.token || null);
  if (!req.session.token) {
    next();
    return;
  }
  let userService = new UserService(req.client);
  userService.fetchMe().then(user => {
    res.locals.loggedUser = user;
    logger.trace(user);
    next();
  }).catch(err => next(err.message));
});

app.use('/', index);
app.use('/', user);
app.use('/', devices);
app.use('/sign', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new WebError('Page Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err.constructor.name != "WebError") {
    let _err = new WebError("Server Error");
    _err.status = 500;
    _err.parent = err;
    err = _err;
  }

  //Log errors, but ignore 404
  if (err.status !== 404) {
    logger.error(err);
  }

  // set locals, only providing error in development
  res.locals.e_message = err.message;
  res.locals.e_status = err.status;
  res.locals.error = req.app.get('env') === 'development' ? err : null;

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: err.message});
});

function createClient(token = null) {
  let opts = Object.assign(clientOptions, {token: token});
  let client = new Client(opts);
  client.on('handle', clientHandle);
  return client;
}

function clientHandle (data, response) {
  apiLogger = log4js.getLogger("API-call");
  apiLogger.info(`${response.req.method} ${response.responseUrl} - ${response.statusCode} ${data.status.code} "${data.status.message}"`);
}

function renderOverhead(req, res, next) {
  var render = res.render;
  res.render = (view, options, fn) => {
    options = Object.assign(options || {}, {flash: req.flash()});
    render.call(res, view, options, fn);
  }
  next();
}

logger.info("Service URL: " + clientOptions.url);

module.exports = app;