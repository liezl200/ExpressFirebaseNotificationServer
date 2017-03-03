var express = require('express');
var router = express.Router();
var request = require('request');

var API_KEY = "AAAA4aMrHeI:APA91bFoDhKYhDaTJfUo-dVd1UY9oVOWZ-dhQSWGJcq6V11-0Ud59uHDxsAeMFpY7oxP6FGC9Qb_N7tPUADeBog_La2RCkP25tz31UPJSoNdQnUDQ1gTL0Ql92nGvX2YBJhzvv_nHOMp_O5sL3aIkyLkdaE1IhYqxQ";

const serviceAccount = require('../serviceAccountKey.json')

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
    var targetEmailsStr = req.body.emails;
    var topicsStr = req.body.tags; // TODO pass this into the sendNotification function
    var notificationTitle = req.body.title;
    var notificationBody = req.body.body;

    // TODO (liezl): add this notification to notifications database -- make sure to have a timestamp field
    var storedNotifKey = addNotificationToList(notificationTitle, notificationBody, topicsStr);
    if ('null' !== targetEmailsStr) {
        var targetEmails = targetEmailsStr.split(',');
        // get FCM tokens from Firebase server -- only if emails are specified
        var usersRef = firebase.database().ref().child('users');
        usersRef.orderByChild('email') // try to look up this user in our firebase db users table
            .once('value', function(snapshot) {
                var targetDevices = [];
                snapshot.forEach(function(userData) {
                    console.log(userData.val());
                    var email = userData.val().email;
                    if (userData.val().fcmTokens && targetEmails.indexOf(email) > -1) { // if the current user has a registered FCM token
                        console.log('match ' + userData.val().fcmTokens);
                        console.log(typeof userData.val().fcmTokens);
                        userData.val().fcmTokens.forEach(function(fcmToken) {
                            targetDevices.push(fcmToken);
                        });
                    }

                    // add this notification key to each user that it was addressed to
                    // TODO: encapsulate the following into a function addNotificationKeyToList
                    // get the user reference that matches this user
                    var userKey = userData.key;
                    var notifsInfoList = usersRef.child(userKey).child('notifsInfo');

                    // associate this new notification with this user, set interactions ('read' 'archived' 'starred') to default values
                    var notifInfo = {
                        notifKey: storedNotifKey,
                        read: false,
                        archived: false,
                        starred: false
                    }
                    notifsInfoList.push(notifInfo);


                });
                // send notification to the listed recipients based on the retrieved
                console.log(JSON.stringify(targetDevices))
                sendNotification(targetDevices, notificationTitle, notificationBody, () => {
                    console.log('notification sent to ' + targetEmails.length + ' users (' + targetDevices.length + ' devices)');
                })
            });
    } else { // send to all users
        // add this notification key to the "all-notifs" table
        var allNotifsRef = firebase.database().ref().child('all-notifs');
        allNotifsRef.push().set({
            notifKey: storedNotifKey
        });
        // TODO: debug sending notifications to all users
        sendNotification(null, notificationTitle, notificationBody, () => {
            console.log('notification sent to all users!');
        })
    }

});

function addNotificationToList(title, body, topicsStr) {
    var topics = [];
    if (topicsStr !== "null") {
        topics = topicsStr.split(',');
    }

    var notifsRef = firebase.database().ref().child('notifs');
    var updates = {}
    var newNotif = notifsRef.push();
    var newNotifKey = newNotif.key;
    newNotif.set({
        title: title,
        text: body,
        topcs: topics
    });
    return newNotifKey; // console.log(newNotifKey);
}

// NOTE: we can never have a topic called "null"
function sendNotification(devices, title, body, onSuccess){
    var requestObj = {
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "key="+API_KEY
        },
    }
    var requestBodyObj = {
        // "notification": {
        //      "title": title,
        //      "body": body
        // },
        "data": {
            "custom_notification": {
                "body": body,
                "title": title,
                "color":"#00ACD4",
                "priority":"high",
                "show_in_foreground": false
            }
        }
    }
    console.log(devices);
    if (devices) {
        requestBodyObj["registration_ids"] = devices;
    } else {
        requestBodyObj["to"] = "topics/all"; // send to all users (because RN app auto-subscribes users to "all" topic)
    }

    var body = JSON.stringify(requestBodyObj);
    console.log(body);
    requestObj.body = body;

    request(requestObj, (error, response, body) => {
        if(error) {console.log(error);}
        else if (response.statusCode >= 400){
            console.log("HTTP Error: " + response.statusCode + ' - ' + response.statusMessage);
        } else {onSuccess();}
    });
}


module.exports = router;
