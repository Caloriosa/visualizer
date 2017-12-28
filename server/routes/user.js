const { UserService, User, Util } = require("@caloriosa/rest-dto");
const log4js = require("log4js");
const WebError = require("../misc/WebError");
const { isAuthenticated } = require("../misc/middleware");

var express = require('express');
var router = express.Router();
var logger = log4js.getLogger("User");

/* GET users listing. */
router.get('/@:userLogin', async (req, res, next) => {
  try {
  var userService = new UserService(req.client);
  // Is requested user me? Get me!
  if (res.locals.loggedUser && res.locals.loggedUser.login === req.params.userLogin){
    res.render('user/profile', {
      title: "@" + res.locals.loggedUser.login,
      user: res.locals.loggedUser
    });
    return;
  }

  // Get requested user by login name
  let users = await userService.fetchUsers({
    filter: {
      login: req.params.userLogin
    }
  });
  if (!users.size) {
    next(new WebError("Page Not Found!", 404));
    return;
  }
  let user = users.first();
  logger.trace(user);
  res.render('user/profile', {
    title: "@" + user.login,
    user: user
  });
  } catch (err) {
    next(new Error(err.message));
  }
});

router.get('/settings', isAuthenticated, (req, res, next) => {
  res.render('user/edit', {
    title: "Edit profile",
    user: res.locals.loggedUser
  });
});

router.post('/settings', isAuthenticated, async (req, res, next) => {

  req.checkBody('email', 'Please enter your valid email.').isEmail();
  
  var errors = req.validationErrors();
  if (errors) {
    res.render('user/edit', {title: "Edit profile", errors: errors});
    return;
  }

  var userService = new UserService(req.client);
  var user = res.locals.loggedUser;

  var [err, user ] = await Util.saferize(userService.setMe({
    email: req.body.email, 
    name: req.body.name
  }));
  if (err) {
    next(err);
    return;
  }
  logger.info(`User profile updated: ${user.login}`);
  logger.trace(user);
  req.flash("success", "Your profile has been updated!");
  res.redirect("settings");
});

module.exports = router;
