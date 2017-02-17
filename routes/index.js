var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	// TODO: get emails from Firebase server
	var usersRef = firebase.database().ref().child('users');
	var emails = [];
	usersRef.orderByChild('email') // try to look up this user in our firebase db users table
    .on('value', function(snapshot) {
    	snapshot.forEach(function(userData) {
    		console.log(userData.val());
    		var email = userData.val().email;
    		emails.push({'email': email, 'name': email.substring(0, email.indexOf('@'))});
    	});
    	console.log(emails);
    	// console.log(snapshot.val());
    });
	results = {}
  res.render('index', { title: 'Search', names: results, emails: emails});
});

module.exports = router;
