
var firebase = require('firebase-admin');
var request = require('request');

var API_KEY = "AAAA4aMrHeI:APA91bFoDhKYhDaTJfUo-dVd1UY9oVOWZ-dhQSWGJcq6V11-0Ud59uHDxsAeMFpY7oxP6FGC9Qb_N7tPUADeBog_La2RCkP25tz31UPJSoNdQnUDQ1gTL0Ql92nGvX2YBJhzvv_nHOMp_O5sL3aIkyLkdaE1IhYqxQ";

const serviceAccount = require('./serviceAccountKey.json')
const client1 = "eHIJfESLuqg:APA91bH6946NRzPhFClGLcXYDkhwCItACSSdhY-Fffm1EGqgy51pbbk4vnjoomDcps3HPqpNJLNZ5CFIHj0jtzcgtfz_Lvot2TdsIZwTi_ig0b7a5jS7efooeBC3wuBoV1jcsoc0C7BI";

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: "https://kirontestapp.firebaseio.com/"
});

function sendNotification(deviceId, message, onSuccess){
	request({
		 url: 'https://fcm.googleapis.com/fcm/send',
		 method: 'POST',
		 headers: {
		 	'Content-Type': 'application/json',
		 	'Authorization': "key="+API_KEY
		 },
		 body: JSON.stringify({
		 	"notification": {
		 		"title": "Hi",
		 		"body": "Body"
		 	},
		 	"to": deviceId
		 })
	}, (error, response, body) =>{
		if(error) {console.log(error);}
		else if (response.statusCode >= 400){
			console.log("HTTP Error: " + response.statusCode + ' - ' + response.statusMessage);
		}else {onSuccess();}
	})
}

sendNotification(client1, "Prueba", ()=> {
	console.log('done!');
})