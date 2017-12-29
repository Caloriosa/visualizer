var express = require('express');
var router = express.Router();
var { isAuthenticated } = require("../misc/middleware");

/* GET home page. */
router.get('/', function(req, res, next) {
  if (res.locals.loggedUser) { // WARN: After dashboard dev done, remove the ! at begin of if !!!
    res.render('dashboard', { title: 'Dashboard'});
    return;
  }
  res.render('index', { title: 'Home sensor measuring'});
});

router.get('/dashboard', /*isAuthenticated,*/ xhrDashboard, function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard'});
});

function xhrDashboard(req, res, next) {
  if (!req.xhr) {
    next();
    return;
  }
  res.send({
    featuredSensor: {
        title: "Inside",
        value: "25,2°C",
        type: "TEMPERATURE"
    },
    loggedUser: res.locals.loggedUser || null
  });
}

module.exports = router;
