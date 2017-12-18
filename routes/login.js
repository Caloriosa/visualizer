var express = require('express');
var router = express.Router();
var log4js = require("log4js");
var WebError = require("../misc/WebError");
var { UserService, User, AuthService, AuthInfo, Util, typedefs } = require("@caloriosa/rest-dto");

var logger = log4js.getLogger("Sign");

router.get('/in', (req, res, next) => {
  res.render('sign/login', {title: "Sign in"});
});

router.post('/in', (req, res, next) => {
  req.checkBody('login', 'You must put your <strong>login name</strong>').notEmpty();
  req.checkBody('password', '<strong>Missing password</strong>').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('sign/login', {title: "Sign in", errors: errors});
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
    logger.error(err.message);
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
  res.render('sign/register', {title: "Sign up"});
});

router.post('/up', async (req, res, next) => {
  req.checkBody('login', 'Please choose your login name.').notEmpty();
  req.checkBody('email', 'Please enter your valid email.').isEmail();
  req.checkBody('password', 'Password must have <b>6 chars</b> or more.').isLength({ min: 6 });

  var errors = req.validationErrors();
  if (errors) {
    res.render('sign/register', {title: "Sign up", errors: errors, fill: req.body});
    return;
  }
  var userService = new UserService(req.client);
  var [err, user ] = await Util.saferize(userService.register(
    User.precreate(req.body.login, req.body.password, req.body.email)
  ));
  if (err && err.code == typedefs.ApiStatuses.DUPLICATED) {
    req.flash("error", "User login already taken!");
    res.render('sign/register', {title: "Sign up", fill: req.body });
    return;
  }
  if (err) {
    next(err);
    return;
  }
  logger.trace(user);
  req.flash('success', 'Your are registered as <b>' + user.login + "</b>! Before login you must activate your account. Check your email for activation code.");
  res.redirect("/sign/verify");
});

router.get('/verify', (req, res, next) => {
  res.render('sign/verify', {title: "Verify email & activate account"});
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
