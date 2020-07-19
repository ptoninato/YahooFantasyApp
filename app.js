import express from 'express';
import passport from 'passport';
import YahooStrategy from 'passport-yahoo-oauth2';
import cookieSession from 'cookie-session';

// eslint-disable-next-line import/extensions
import keys from './data/keys.js';

const app = express();

// cookieSession config
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
  keys: ['randomstringhere']
}));

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// Strategy config
passport.use(new YahooStrategy.OAuth2Strategy({
// eslint-disable-next-line max-len
  clientID: keys.ClientId,
  clientSecret: keys.SecretId,
  callbackURL: 'https://c9bf59fed9a2.ngrok.io/auth/yahoo/callback',
  scope: null
},
((token, tokenSecret, profile, done) => {
  console.log('26');
  User.findOrCreate({ yahooId: profile.id }, (err, user) => done(err, user));
})));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send('You must login!');
  }
}

// Routes
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// passport.authenticate middleware is used here to authenticate the request
app.get('/auth/yahoo', passport.authenticate('yahoo', {
  scope: null // Used to specify the required data
}));

// // The middleware receives the data from Yahoo and runs the function on Strategy config
app.get('/auth/yahoo/callback', passport.authenticate('yahoo'), (req, res) => {
  console.log('61');
  res.redirect('/secret');
});

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
  res.send('You have reached the secret route');
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(8000, () => {
  console.log('Server Started!');
});
