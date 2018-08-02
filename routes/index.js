var router = require('express').Router();
var passport = require('passport');

// The root route renders only view
router.get('/', function(req, res) {
  res.render('index', { user: req.user }); //login/logout UI
});

// Google 0Auth login route
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

// Google 0Auth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

// 0Auth logout route
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;