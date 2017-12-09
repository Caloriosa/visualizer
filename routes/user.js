const { UserService, User } = require("@caloriosa/rest-dto");

var express = require('express');

var router = express.Router();
//var client = require("../dto");

/* GET users listing. */
router.get('/:userLogin', function(req, res, next) {
  var userService = new UserService(req.client);
  userService.fetchUsers({
    filter: {
      login: req.params.userLogin
    }
  }).then(users => {
    if (!users.size) {
      next(new Error("User not found!"));
      return;
    }
    res.render('user', {
      user: users.first()
    });
  }).catch(err => next(new Error(err.message)));
});

module.exports = router;
