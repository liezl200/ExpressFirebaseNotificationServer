var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();

// FIREBASE
var firebase = require('firebase-admin');
var API_KEY = "AAAA4aMrHeI:APA91bFoDhKYhDaTJfUo-dVd1UY9oVOWZ-dhQSWGJcq6V11-0Ud59uHDxsAeMFpY7oxP6FGC9Qb_N7tPUADeBog_La2RCkP25tz31UPJSoNdQnUDQ1gTL0Ql92nGvX2YBJhzvv_nHOMp_O5sL3aIkyLkdaE1IhYqxQ";

const serviceAccount = require('./serviceAccountKey.json')
const client1 = "eHIJfESLuqg:APA91bH6946NRzPhFClGLcXYDkhwCItACSSdhY-Fffm1EGqgy51pbbk4vnjoomDcps3HPqpNJLNZ5CFIHj0jtzcgtfz_Lvot2TdsIZwTi_ig0b7a5jS7efooeBC3wuBoV1jcsoc0C7BI";

// INTIALIZE FIREBASE
// TODO: figure out how to make this a global reference thru all express routes!
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://kirontestapp.firebaseio.com/"
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// ERROR HANDLERS
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
