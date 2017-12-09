var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

const { Client } = require("@caloriosa/rest-dto");

var index = require('./routes/index');
var user = require('./routes/user');

var app = express();
var client = new Client({
  url: process.env.SERVICE_URL || "http://10.0.0.143:8080"
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/vendor', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/vendor', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use((req, res, next) => {
  req.client = client;
  next();
});

app.use('/', index);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  let status = err.httpStatus || {};
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Remap code from API status
  if (status instanceof Object) {
    status = status.code || 500;
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

client.on("handle", (data, response) => {
  console.log(`API call: ${response.responseUrl} - ${response.statusCode} ${data.status.code} "${data.status.message}"`);
});

module.exports = app;
