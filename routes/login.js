var express = require('express');
var router = express.Router();
var log4js = require("log4js");
var { AuthService, AuthInfo, typedefs } = require("@caloriosa/rest-dto");

var logger = log4js.getLogger("Auth");

router.get('/in', (req, res, next) => {
  res.render('login', {title: "Sign in"});
});

router.post('/in', (req, res, next) => {
  req.checkBody('login', 'You must put your <strong>login name</strong>').notEmpty();
  req.checkBody('password', '<strong>Missing password</strong>').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('login', {title: "Sign in", errors: errors});
    return;
  }
  var authService = new AuthService(req.client);
  authService.authenticate(req.body.login, req.body.password).then(authInfo => {
    logger.debug(authInfo);
    // Setup session logged in
    req.session.token = authInfo.token;
    req.session.identityId = authInfo.identityId;
    req.session.save();
    // Redirect
    logger.info(`Login success! UserID: ${authInfo.identityId}`);
    res.redirect("/");
    return;
  }).catch(err => { 
    logger.error(err);
    if (err.status && err.status.code == typedefs.ApiStatuses.INVALID_CREDENTIALS) {
      req.flash("error", "Wrong username or invalid password");
      res.redirect("/sign/in");
      return;
    }
    next(new Error(err.message));
    return;
  });
});

router.get('/up', (req, res, next) => {
  res.render('register', {title: "Sign up"});
});

router.get("/out", (req, res, next) => {
  if (!req.session.token) {
    logger.info("User already logged out!");
    res.redirect("/sign/in");
  }
  var authService = new AuthService(req.client);
  authService.logout().then(metaInfo => {
    logger.debug(metaInfo);
    req.session.regenerate(err => {
      if (err) {
        logger.error(err.message);
        next(err);
        return;
      }
      logger.info("Session regenerated!");
      req.flash("info", "You are been sucessfully logged out!");
      res.redirect("/sign/in");
      return;
    });
  }).catch(err => {
    logger.error(err.message);
    next(err);
    return;
  });
});

module.exports = router;
