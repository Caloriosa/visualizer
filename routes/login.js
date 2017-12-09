var express = require('express');
var router = express.Router();
var log4js = require("log4js");
var { AuthService, AuthInfo } = require("@caloriosa/rest-dto");

var logger = log4js.getLogger("Login");

function validateForm(req, res, next) {
  
}

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/', (req, res, next) => {
  req.checkBody('login', 'You must put your <strong>login name</strong>').notEmpty();
  req.checkBody('password', '<strong>Missing password</strong>').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('login', {errors: errors});
    return;
  }
  var authService = new AuthService(req.client);
  authService.authenticate(req.body.login, req.body.password).then(authInfo => {
    console.dir(authInfo);
    req.session.token = authInfo.token;
    req.session.save();
    res.redirect("/");
  }).catch(err => { 
    logger.error(err);
    next(new Error(err.message))
  });
});

module.exports = router;
