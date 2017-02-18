var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	// TODO: get emails from Firebase server
	var usersRef = firebase.database().ref().child('users');
	var users = [];
	usersRef.orderByChild('email') // try to look up this user in our firebase db users table
    .on('value', function(snapshot) {
    	snapshot.forEach(function(userData) {
    		console.log(userData.val());
    		var email = userData.val().email;
    		users.push({'email': email, 'name': email.substring(0, email.indexOf('@')), 'fcmTokens': userData.val().fcmTokens});
    	});
    	console.log(users);
    	// console.log(snapshot.val());
    });
	results = {}
  res.render('index', { title: 'Search', names: results, users: users});
});

module.exports = router;
