const express = require('express');
const request = require('request');

const router = express.Router();


const API_KEY = 'AAAA4aMrHeI:APA91bFoDhKYhDaTJfUo-dVd1UY9oVOWZ-dhQSWGJcq6V11-0Ud59uHDxsAeMFpY7oxP6FGC9Qb_N7tPUADeBog_La2RCkP25tz31UPJSoNdQnUDQ1gTL0Ql92nGvX2YBJhzvv_nHOMp_O5sL3aIkyLkdaE1IhYqxQ';

function htmlToPlainText(html) {
  return html.replace(/<(?:.|\n)*?>/gm, '');
}

function addNotificationToList(title, body) {
  // eslint-disable-next-line no-undef
  const notifsRef = firebase.database().ref().child('notifs');
  const newNotif = notifsRef.push();
  const newNotifKey = newNotif.key;
  newNotif.set({
    title,
    text: htmlToPlainText(body),
    html: body,
    timeSent: Date.now(),
  });
  return newNotifKey; // console.log(newNotifKey);
}

function sendNotification(devices, title, body) {
  const requestObj = {
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${API_KEY}`,
    },
  };
  const requestBodyObj = {
    data: {
      custom_notification: {
        body: htmlToPlainText(body),
        title,
        color: '#00ACD4',
        priority: 'high',
        show_in_foreground: false,
      },
    },
  };
  if (devices) {
    requestBodyObj.registration_ids = devices;
  } else {
    requestBodyObj.to = 'topics/all'; // send to all users (the companion RN app auto-subscribes users to "all" topic)
  }

  const requestBody = JSON.stringify(requestBodyObj);
  requestObj.body = requestBody;
  request(requestObj);
}

/* GET home page. */
router.get('/', (req, res) => {
  // eslint-disable-next-line no-undef
  const usersRef = firebase.database().ref().child('users');
  const users = [];
  usersRef.orderByChild('email') // try to look up this user in our firebase db users table
    .once('value', (snapshot) => {
      snapshot.forEach((userData) => {
        const email = userData.val().email;
        users.push({ email, name: email.substring(0, email.indexOf('@')), fcmTokens: userData.val().fcmTokens });
      });
      res.render('index', { title: 'Search', sendResults: null, users });
    });
});

/* POST to send notification */
router.post('/send', (req) => {
  const targetEmailsStr = req.body.emails;
  const notificationTitle = req.body.title;
  const notificationBody = req.body.body;
  const storedNotifKey = addNotificationToList(notificationTitle, notificationBody);
  if (targetEmailsStr !== 'null') {
    const targetEmails = targetEmailsStr.split(',');
    // get FCM tokens from Firebase server -- only if emails are specified
    // eslint-disable-next-line no-undef
    const usersRef = firebase.database().ref().child('users');
    usersRef.orderByChild('email') // try to look up this user in our firebase db users table
      .once('value', (snapshot) => {
        const targetDevices = [];
        snapshot.forEach((userData) => {
          const email = userData.val().email;
          if (userData.val().fcmTokens && (targetEmails.indexOf(email) > -1)) {
            // if the current user has a registered FCM token
            userData.val().fcmTokens.forEach((fcmToken) => {
              targetDevices.push(fcmToken);
            });
          }

          // add this notification key to each user that it was addressed to
          // TODO: encapsulate the following into a function addNotificationKeyToList
          // get the user reference that matches this user
          const userKey = userData.key;
          const notifsInfoList = usersRef.child(userKey).child('notifsInfo');

          // associate this new notification with this user
          const notifInfo = {
            notifKey: storedNotifKey,
            read: false,
          };
          notifsInfoList.push(notifInfo);
        });
        // send notification to the listed recipients based on the retrieved
        sendNotification(targetDevices, notificationTitle, notificationBody);
      });
  }
});

router.post('/clearUsers', (req) => {
  const targetEmailsStr = req.body.emails;
  if (targetEmailsStr !== 'null') {
    const targetEmails = targetEmailsStr.split(',');
    // eslint-disable-next-line no-undef
    const usersRef = firebase.database().ref().child('users');
    usersRef.orderByChild('email').once('value', (snapshot) => {
      snapshot.forEach((userData) => {
        const email = userData.val().email;
        // if the current firebase user is in the list of selected users
        if (targetEmails.indexOf(email) > -1) {
          usersRef.child(userData.key).child('notifsInfo').remove((error) => {
            if (!error) {
              usersRef.child(userData.key).child('notifsInfo').set({
                welcome: {
                  notifKey: 'welcome',
                  read: false,
                },
              });
            }
          });
        }
      });
    });
  }
});

router.post('/clearNotifications', () => {
  // eslint-disable-next-line no-undef
  const notifsRef = firebase.database().ref().child('notifs');
  notifsRef.remove((error) => {
    if (!error) {
      notifsRef.set({
        welcome: {
          html: 'welcome',
          text: 'welcome',
          timeSent: 0,
          title: 'Welcome to Kiron!',
        },
      });
    }
  });
});

module.exports = router;
