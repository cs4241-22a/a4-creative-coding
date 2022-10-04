var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'KMoene\'s 135 Machine' });
});

module.exports = router;
