import express from 'express';
import passport from 'passport';
import YahooStrategy from 'passport-yahoo-oauth2';
import cookieSession from 'cookie-session';
import YahooFantasy from 'yahoo-fantasy';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const app = express();
const pool = new pg.Pool();
app.yf = new YahooFantasy(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

async function getYahooGameCodes() {
  try {
    const results = await pool.query('SELECT distinct yahoogamecode FROM gamecodetype');
    return [...new Set(results.rows.map((item) => item.yahoogamecode))];
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function insertYahooGameCodes(code) {
  pool.query(
    `INSERT INTO gamecodetype(yahoogamecode, yahoogamename) VALUES ('${code.code}', '${code.name}')`,
    (err, res) => {
      console.log(err, res);
    }
  );
}

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

app.get('/database', async (req, res) => {
  const queryResult = await pool.query('SELECT NOW()');
  console.log(queryResult);
  res.redirect('/');
});

// Secret route
app.get('/secret', isUserAuthenticated, async (req, res) => {
  const returnedData = await app.yf.user.games();

  const data = await returnedData.games.reduce((data, game) => {
    if (game.code === 'mlb' || game.code === 'nfl') {
      data.push(game);
    }
    return data;
  }, []);

  console.log(data.length);

  const gamecodes = []; const gameCodeOutput = [];
  for (let i = 0; i < data.length; i++) {
    if (gamecodes[data[i].code]) continue;
    gamecodes[data[i].code] = true;
    gameCodeOutput.push({ code: data[i].code, name: data[i].name });
  }

  const existingTypes = await getYahooGameCodes();
  console.log(existingTypes);

  gameCodeOutput.forEach((gamecode) => {
    if (existingTypes.length === 0 || !existingTypes.includes(gamecode.code)) {
      insertYahooGameCodes(gamecode);
    }
  });

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
