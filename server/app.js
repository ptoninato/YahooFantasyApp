import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import YahooStrategy from 'passport-yahoo-oauth2';
import cookieSession from 'cookie-session';
import YahooFantasy from 'yahoo-fantasy';
import dotenv from 'dotenv';
import pg from 'pg';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ImportRoutesImport from './routes/importRoutes.js';
import TransactionSearchRouter from './routes/api/transactionSearchRouter.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.yf = new YahooFantasy(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
const importRoutes = new ImportRoutesImport();
const transactionSearchRoutes = new TransactionSearchRouter();
app.use('/import', importRoutes);
app.use('/api/transactionSearch', transactionSearchRoutes);

// cookieSession config
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
  keys: ['key1']
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
  app.user = profile;
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
// function isUserAuthenticated(req, res, next) {
//   if (req.user) {
//     console.log(req.user);
//     next();
//   } else {
//     res.send('You must login!');
//   }
// }

function isUserAuthenticated(req, res, next) {
  let userObj;
  console.log('here');
  console.log(req);

  if (req.isAuthenticated()) {
    userObj = {
      name: req.user.name,
      avatar: req.user.avatar
    };
    console.log('user is authenticated');
  } else {
    res.send('You must login!');
}

  req.userObj = userObj;

  next();
}

// Routes
app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/index', (req, res) => {
  res.render('index.ejs');
});

app.get('/test', (req, res) => {
  console.log(req.body);
  return res.send(req.body);
});

// passport.authenticate middleware is used here to authenticate the request
app.get('/auth/yahoo', passport.authenticate('yahoo', {
  scope: 'profile fspt-r', // Used to specify the required data,
}));

// // The middleware receives the data from Yahoo and runs the function on Strategy config
app.get('/auth/yahoo/callback', passport.authenticate('yahoo'), (req, res) => {
  // console.log(req);
  // res.redirect('/import/importTransactions');
  // res.redirect('/import/importAll');
  res.redirect('/index');
});

app.get('/database', async (req, res) => {
  const pool = new pg.Pool();
  const queryResult = await pool.query('SELECT NOW()');
  console.log(queryResult);
  res.redirect('/');
});

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
  const data = 'You are logged in';
  res.render('secret.ejs', { data });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PROTOCOL}${process.env.DOMAIN}`);
});

export default app;
