var express = require('express');
var router = express.Router();
var Users = require('../controllers/users');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyFacebook', message: req.flash('message')});
});

/* GET Sign in page */
router.get('/signin', function(req, res, next){
  res.render('signin', {title: 'Sign In', message: req.flash('message')})
});

/* POST sign in page */
router.post('/signin', passport.authenticate('signup', {
  successRedirect: '/home',
  successFlash: true,
  failureRedirect: '/signin',
  failureFlash: true
}));

/* GET log in page */
router.get('/login', function(req, res, next){
  res.render('login', {title: 'Log In', message: req.flash('message')})
})

/* POST log in page */
router.post('/login', passport.authenticate('login', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash : true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* FACEBOOK ROUTER */
router.get('/facebook', passport.authenticate('fb'));

router.get('/facebook/callback', passport.authenticate('fb', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });

  /* GOOGLE ROUTER */
router.get('/google',
passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));

router.get('/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/home');
});

module.exports = router;
