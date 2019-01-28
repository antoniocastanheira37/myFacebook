var express = require('express');
var router = express.Router();
var Users = require('../controllers/users');
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyFacebook', message: req.flash('message')});
});

router.get('/home', function(req, res, next) {
  if (req.user) {
    var pubs = Users.todasPublicacoes(req.user.username)
    pubs.then((doc)=>{
      res.render('home', {title: 'Homepage', pubs: doc});
    })
  } else {
    res.redirect('/login');
  }
});

/*router.post('/home', function(req, res, next) {
  if (req.user) {
    switch(req.body.tipo){
      case('foto'){

      }
    }
  }
})*/

router.get('/user/:username', function(req, res, next) {
  if (Users.userExiste(req.params.username)){ 
    var pubs = Users.publicacoesPublicas(req.params.username)
    pubs.then((doc)=>{
      res.render('userpage', {title: doc.username, pubs: doc});
    })
  } else {
    res.render('userpage', {title: req.params.username, message: "O utilizador pesquisado não existe!"})
  }
});

router.get('/signin', function(req, res, next){
  if (!req.user)
    res.render('signin', {title: 'Sign In', message: req.flash('message')})
  else 
    res.redirect('/home')
});

router.post('/signin', passport.authenticate('signup', {
  successRedirect: '/home',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/login', function(req, res, next){
  if (!req.user)  
    res.render('login', {title: 'Log In', message: req.flash('message')})
  else
    res.redirect('/home')
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash : true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/facebook', passport.authenticate('fb'));

router.get('/facebook/callback', passport.authenticate('fb', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
});

router.get('/google',
passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
});

module.exports = router;
