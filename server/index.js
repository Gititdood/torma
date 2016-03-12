// Express App
var express = require('express');
var app = express();
// Create a server separately
var server = require('http').Server(app);

// pretty maybe?
app.locals.pretty = true;

// Serve static files http://expressjs.com/en/starter/static-files.html
app.use(express.static('client'));
/*
  sidenote: since middlewares are executed progressively,
  it's best to put static file server at the top
  because it most certainly will not be requiring any of the
  complicated stuff required for other routes configured below
*/


// To parse input form's body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To parse cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());


// User Database
var User = require('./db/user');


// To enable sessions
var session = require('express-session');
// A session store to store sessions in a database
// Otherwise sessions are lost when you restart node app
var RedisStore = require('connect-redis')(session);
var sessionSecret = 'unique phrase, like "keyboard cat"';
var sessionStore = new RedisStore({
  db: 1,
});
app.use(session({
  store: sessionStore,
  secret: sessionSecret,
  saveUninitialized: true,
  resave: true,
}));


// User authentication http://passportjs.org/guide/configure/
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, done));
app.use((req, res, next) => {
  // Lets make the user available to all templates
  res.locals.user = req.user;
  // If you use a custom middleware be sure to call next otherwise it won't progress
  next();
  // Unless of course you're actually "fulfilling" the request by sending client something like res.send(...)
})


/*
    Routes
*/
// Log requests to console
var morgan = require('morgan');
app.use(morgan(':method :url :status :response-time[0]\\ms'))

// Set default templating engine
// http://expressjs.com/en/guide/using-template-engines.html
app.set('view engine', 'jade');
// Set default views directory
app.set('views', './views');

// Routes
// It's a good idea to separate out the routes
var routes = require('./routes');
app.use(routes);

// Not found handler
app.use(function(req, res, next) {
  res.status(404).send('Not found');
});
// Catch all error handler
app.use(function(err, req, res, next) {
	//console.log(err, req, res)
  res.status(500).send('Server error: ' + err);
});


// Websocket
var io = require('socket.io')(server); // attached to same server as app
// passport in socket
var passportSIO = require('passport.socketio');
io.use(passportSIO.authorize({
  cookieParser: cookieParser,
  secret: sessionSecret,
  store: sessionStore,
}));
io.on('connection', function(socket) {
  var user = socket.request.user;
  socket.join(user.id);
  console.log('Socket connection established with a client');
  socket.on('data', function(data) {
    socket.emit('data', {
      hash: 'key',
      one: 1,
      two: 2,
      three: 3,
    });
  });
});


// Start the server
server.listen(8080, () => console.log('Server listening on 8080'));
