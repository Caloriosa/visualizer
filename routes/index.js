var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*if (!res.locals.loggedUser) {
    res.render('index', { title: 'Home sensor measuring'});
    return;
  }*/
  res.render('dashboard', { title: 'Dashboard'});
});

router.get('/ajax/graph', function(req, res, next) {
  var data = {
    labels: [
      "0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00",
      "7:00", "8:00", "9:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", 
      "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"
    ],
    datasets: [
      {
        label: "Inside °C",
        backgroundColor: "#ff0000",
        borderColor: "#ff0000",
        fill: false,
        data: []
      },
      {
        label: "Outside °C",
        backgroundColor: "#0000ff",
        borderColor: "#0000ff",
        fill: false,
        data: []
      }
    ]
  };
  for (let i = 0; i < 18; i++) {
    data.datasets[0].data.push(getRndInteger(10, 25));
    data.datasets[1].data.push(getRndInteger(-30, 15));
  }
  res.send(data);
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports = router;
