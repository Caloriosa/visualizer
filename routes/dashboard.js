var express = require('express');
var router = express.Router();

/* GET dashboard main page. */
router.get('/ajax', function(req, res, next) {
    res.send({ajax: true});
});

/* GET dashboard main page. */
router.get('*', function(req, res, next) {
    res.render('dashboard', { title: 'Dashboard'});
});

module.exports = router;
