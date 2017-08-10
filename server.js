const express = require('express');
const session = require('express-session');
const {json} = require('body-parser')
const passport = require('passport');
const auth0strategy = require('passport-auth0');
const config = require('./config');
const port = 3000;
const app = express();

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret
}));

app.use(json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new auth0strategy({
  domain: config.domain,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackURL
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/me'}), (req, res) => {
    res.status(200).send(req.user);
});
app.get('/me', (req, res, next) => {
  if (req.user) res.json(req.user);
  else res.json({message: 'Failure'});
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
