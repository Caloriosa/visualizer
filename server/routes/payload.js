var express = require('express');
var router = express.Router();

router.get('/featured', function(req, res, next) {
  res.send({
      featuredSensor: {
          title: "Inside",
          value: "25°C"
      }
  })
});

router.get('/me', function(req, res, next) {
    if (!res.locals.loggedUser) {
        res.status(401);
        res.send({error: "You are not logged in!"});
    }
    res.send(res.locals.loggedUser);
});

router.get('*', function(req, res, next){
    req.client.get(req.url).then(response => {
        res.send(response);
    }).catch(err => {
        let message;
        res.status(err.response ? err.response.status : 500)
        res.send({
            error: err.message,
            code: err.code
        });
    });
});

module.exports = router;
