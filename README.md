# Simple Firebase Notifications
A simple Node script to send notifications to an iOS or Android device using Firebase Cloud Messaging.

### How to run

```shell
npm install -s
node notification.js
```

if the notification was sent, _done!_ will be printed in the console, the error will be printed otherwise.

### Considerations

This is just an example and the following variables MUST be changed to your custom values in order for this to work:

- *client1*

    This is the firebase token retrived by the device.

    Visit [Android instructions](https://goo.gl/MnoHLu) and [this](https://goo.gl/IkFPsC) and [this](https://goo.gl/AVzi5g) for _iOS_ instructions.


- *API_KEY*

    Can be found in the firebase console, click in the 3 vertical dots in your proyect and then under the tab _cloud messaging_

- *serviceAccount*

    This is the .json file you download form firebase

- *databaseURL*

    Can be found in the firebase console under database



For further information about Firebase Cloud Messaging and how to build more complex notifications, please visit
https://firebase.google.com/docs/cloud-messaging/downstream


RUN ACTUAL NODE SERVER
## Clone repo and install dependencies
```git clone https://github.com/liezl200/KironNodeNotificationServer.git```

```cd KironNodeNotificationServer && sudo npm install```

## Run app
Make sure you cd into the repo then run: ```npm start```

## Go to index
In your browser, navigate to the homepage: http://localhost:3000/(http://localhost:3000/)
