var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	// TODO: get emails from Firebase server
	results = {}
  res.render('index', { title: 'Search', names: results});
});

module.exports = router;
