const { UserService, User } = require("@caloriosa/rest-dto");
const log4js = require("log4js");
const WebError = require("../misc/WebError");

var express = require('express');
var router = express.Router();
var logger = log4js.getLogger("User");

/* GET users listing. */
router.get('/:userLogin', async (req, res, next) => {
  try {
  var userService = new UserService(req.client);
  // Is requested user me? Get me!
  if (res.locals.loggedUser && res.locals.loggedUser.login === req.params.userLogin){
    let user = await userService.fetchMe();
    logger.trace(user);
    res.render('user', {
      user: user
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
    next(new WebError("User not found!", 404));
    return;
  }
  let user = users.first();
  logger.trace(user);
  res.render('user', {
    user: user
  });
  } catch (err) {
    next(new Error(err.message));
  }
});

module.exports = router;
