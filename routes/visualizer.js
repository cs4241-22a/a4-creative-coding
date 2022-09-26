var express = require('express');
var router = express.Router();

/* GET visualizer page. */
router.get('/', function(req, res, next) {
    res.render('visualizer', { title: 'Visualizer' });
});

module.exports = router;
