var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (res.locals.loggedUser) {
    res.redirect("/dashboard");
    return;
  }
  res.render('index', { title: 'Home sensor measuring'});
});

module.exports = router;
