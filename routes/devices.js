var express = require('express');
var router = express.Router();

router.get('/D:id([A-z0-9]){8}', function(req, res, next) {
  res.render('device', { title: 'device'});
});

module.exports = router;
