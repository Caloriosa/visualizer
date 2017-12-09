var express = require('express');
var router = express.Router();
var log4js = require("log4js");
var { AuthService, AuthInfo } = require("@caloriosa/rest-dto");

var logger = log4js.getLogger("Auth");

router.get('/in', (req, res, next) => {
  res.render('login');
});

router.post('/in', (req, res, next) => {
  req.checkBody('login', 'You must put your <strong>login name</strong>').notEmpty();
  req.checkBody('password', '<strong>Missing password</strong>').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('login', {errors: errors});
    return;
  }
  var authService = new AuthService(req.client);
  authService.authenticate(req.body.login, req.body.password).then(authInfo => {
    logger.debug(authInfo);
    req.session.token = authInfo.token;
    req.session.identityId = authInfo.identityId;
    req.session.save();
    logger.info(`Login success! UserID: ${authInfo.identityId}`);
    res.redirect("/");
    return;
  }).catch(err => { 
    logger.error(err);
    next(new Error(err.message));
    return;
  });
});

router.get("/out", (req, res, next) => {
  if (!req.session.token) {
    logger.info("User already logged out!");
    res.redirect("/sign/in");
  }
  var authService = new AuthService(req.client, req.session.token || null);
  authService.logout().then(metaInfo => {
    logger.debug(metaInfo);
    req.session.regenerate(err => {
      if (err) {
        logger.error(err.message);
        next(err);
        return;
      }
      logger.info("Session regenerated!");
      res.redirect("/sign/in?message=You are been sucessfully logged out!");
      return;
    });
  }).catch(err => {
    logger.error(err.message);
    next(err);
    return;
  });
});

module.exports = router;
