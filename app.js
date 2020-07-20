import express from 'express';
import passport from 'passport';
import YahooStrategy from 'passport-yahoo-oauth2';
import cookieSession from 'cookie-session';
import YahooFantasy from 'yahoo-fantasy';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const MongoStore = connectMongo(session);
app.yf = new YahooFantasy(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

mongoose.connect('mongodb://localhost:27017/sess', { useNewUrlParser: true, useUnifiedTopology: true });
// const mongoStore =
//   ((err) => {
//     console.log(err || 'connect-mongodb setup ok');
//   }));

// cookieSession config
// app.use(cookieSession({
//   maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
//   keys: ['key1']
// }));

app.use(session({
  secret: process.env.CLIENT_SECRET,
  maxAge: new Date(Date.now() + 3600000),
  resave: true,
  saveUninitialized: true,
  Store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// Strategy config
passport.use(new YahooStrategy.Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.PROTOCOL}${process.env.DOMAIN}${process.env.CALLBACK_PATH}`,
  accessTokenUri: 'https://api.login.yahoo.com/oauth2/get_token',
  authorizationUri: 'https://api.login.yahoo.com/oauth2/request_auth',
  scope: 'profile fspt-r'
},
((token, tokenSecret, profile, done) => {
  app.yf.setUserToken(token);
  done(null, profile);
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
  scope: 'profile fspt-r'// Used to specify the required data
}));

// // The middleware receives the data from Yahoo and runs the function on Strategy config
app.get('/auth/yahoo/callback', passport.authenticate('yahoo'), (req, res) => {
  res.redirect('/secret');
});

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
  app.yf.league.transactions(
    '398.l.51361',
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        // // define Schema
        // const transactionSchema = mongoose.Schema({
        //   id: String
        // });

        // const transaction = mongoose.model('transaction', transactionSchema, 'sess');

        // const transaction1 = new transaction({ id: data.league_key });

        // transaction1.save((err2, result) => {
        //   if (err2) return console.error(err);
        //   console.log(`${result.id} saved to sess collection.`);
        // });

        res.render('secret.ejs', { data });
      }
    }
  );
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PROTOCOL}${process.env.DOMAIN}:${process.env.PORT}!`);
});
