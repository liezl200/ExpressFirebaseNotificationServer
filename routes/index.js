var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	// TODO: get tags from Firebase server
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
        res.render('index', { title: 'Search', sendResults: null, users: users});
    });
});

/* POST to send notification */
router.post('/send', function(req, res, next) {
    var targetEmails = req.body.emails;
    var topics = req.body.tags;
    console.log('send');
    console.log(targetEmails);
    console.log(topics);
    if (targetEmails) {
        // get FCM tokens from Firebase server -- TODO: only if emails are specified
        var usersRef = firebase.database().ref().child('users');
        var users = [];
        usersRef.orderByChild('email') // try to look up this user in our firebase db users table
        .on('value', function(snapshot) {
            snapshot.forEach(function(userData) {
                console.log(userData.val());
                var email = userData.val().email;
                users.push({'email': email, 'name': email.substring(0, email.indexOf('@')), 'fcmTokens': userData.val().fcmTokens});
            });
            // console.log(users);
            // console.log(snapshot.val());

            // TODO: send notification to the listed recipients based on the retrieved
        });
    } else {

    }

});

module.exports = router;
