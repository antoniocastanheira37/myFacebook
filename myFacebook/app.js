var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/myFacebook', {useNewUrlParser:true})
  .then(()=> console.log('Mongo ready: ' + mongoose.connection.readyState))
  .catch(()=> console.log('Erro de conexão.'))
require('./models/models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var passport = require('passport');
var session = require('express-session')
var flash = require('connect-flash');
var bCrypt = require('bcrypt-nodejs')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var app = express();

var User = mongoose.model('User');


app.use(session({secret: "dweb 2018"}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('fb', new FacebookStrategy({
  clientID: "377899359668769",
  clientSecret: "46a707d9f05743a8a3b3a79c66add47d",
  callbackURL: "http://localhost:3000/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'username':profile.id},function(err, user) {
      if (err){
        console.log('Erro no Registo: '+err);
        return done(err);
      }
      if (user) {
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.username = profile.id;
        newUser.firstname = profile.displayName.split(" ")[0];
        newUser.lastname = profile.displayName.split(" ")[1];
        newUser.save(function(err) {
          if (err){
            throw err;
          }
          return done(null, newUser);
        });
      }
    });
  }
));

passport.use('google', new GoogleStrategy({
    clientID: "1096954492511-imnrhk88fiettlcn0ab1u0aetk4393d9.apps.googleusercontent.com",
    clientSecret: "Tn4bJemD6Wa_SV_uUpdsEz2o",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({'username':profile.id},function(err, user) {
      if (err){
        console.log('Erro no Registo: '+err);
        return done(err);
      }
      if (user) {
        return done(null, user);
      } else {
        var newUser = new User();
        newUser.username = profile.id;
        newUser.firstname = profile.displayName.split(" ")[0];
        newUser.lastname = profile.displayName.split(" ")[1];
        newUser.save(function(err) {
          if (err){
            throw err;
          }
          return done(null, newUser);
        });
      }
    });
  }
));

passport.use('login', new LocalStrategy({
  passReqToCallback : true
}, function(req, username, password, done) {
  
  User.findOne({ 'username' :  username },
    function(err, user) {
      if (err)
        return done(err);
      if (!user){
        return done(null, false, req.flash('message', 'Username ou password incorreta!'));
      }
      if (!user.isValidPassword(password)){
        return done(null, false, req.flash('message', 'Username ou password incorreta!'));
      }
      return done(null, user);
    }
  );
}));

passport.use('signup', new LocalStrategy({
  passReqToCallback : true
}, function(req, username, password, done) {
  User.findOne({'username':username},function(err, user) {
    if (err){
      console.log('Erro no Registo: '+err);
      return done(err);
    }
    if (user) {
      return done(null, false, req.flash("message", 'O utilizador já existe'));
    } else {
      var newUser = new User();
      newUser.username = username;
      newUser.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
      newUser.firstname = req.body.firstname;
      newUser.lastname = req.body.lastname;
      newUser.save(function(err) {
        if (err){
          throw err;
        }
        return done(null, newUser);
      });
    }
  });
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
