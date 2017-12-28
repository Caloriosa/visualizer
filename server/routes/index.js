var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!res.locals.loggedUser) {
    res.render('index', { title: 'Home sensor measuring'});
    return;
  }
  res.render('dashboard', { title: 'Dashboard'});
});

module.exports = router;
