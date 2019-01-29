var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Users = require('../controllers/users');
var passport = require('passport');
var multer = require('multer');
var uuid = require('uuid/v1');

var tipospub = ['post', 'evento', 'registo', 'foto'];

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/photos/')
  },
  filename: function (req, file, cb) {
    var ext = file.mimetype.split("/");
    cb(null, uuid()+'.'+ext[ext.length - 1])
  }
})

var upload = multer({ storage: storage })

router.get('/', function(req, res, next) {
  if (req.user)
    res.redirect('/home')
  else 
    res.render('index', { title: 'MyFacebook', message: req.flash('message')});
});

router.get('/home', function(req, res, next) {
  if (req.user) {
    if (req.query.tipo) 
      var pubs = Users.publicacoesTipo(req.query.tipo.split(","), req.user.username)
    else if (req.query.tags)
      var pubs = Users.publicacoesTag(req.query.tags.split(","), req.user.username)
    else if(req.query.tags &&req.query.tipo)
      var pubs = Users.publicacoesTipoTag(req.query.tipo.split(","), req.query.tags.split(","), req.user.username)
    else 
      var pubs = Users.todasPublicacoes(req.user.username)
    pubs.then((doc)=>{
      var photo = "/photos/default.jpg"
      if (req.user.photo.path) {
        photo = req.user.photo.path
      }
      res.render('user', {title: 'Homepage', tipospubs: tipospub, pubs: doc, name: req.user.firstname+" " + req.user.lastname, photo: photo, username: req.user.username});
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/edit/:id', function(req, res, next) {
  if (req.user){
    Users.obterPublicacao(req.params.id).then((doc)=>{
      res.render("edit", {title: 'Edit Post', pub: doc, username: req.user.username})
    })
  }
})

router.post('/edit/:id/:tipo', function(req, res, next){
  if (req.user){
    if (req.params.tipo=="post")
      Users.atualizar({_id: req.params.id, texto: req.body.texto, publica: req.body.publica, tags: req.body.tags})
    else if (req.params.tipo == "evento")
      Users.atualizar({_id: req.params.id, data: req.body.data, local: req.body.local, hinicio: req.body.hinicio, hfim: req.body.hfim, titulo: req.body.titulo, desc: req.body.desc, publica: req.body.publica, tags: req.body.tags})
    else if (req.params.tipo == "foto")
      Users.atualizar({_id: req.params.id, desc: req.body.desc, publica: req.body.publica, tags: req.body.tags})
    else 
      Users.atualizar({_id: req.params.id, data: req.body.data, titulo: req.body.titulo, descricao: req.body.descricao, publica: req.body.publica, tags: req.body.tags})
    res.redirect("/home")
  }
})

router.get('/publicar/:tipo', function(req, res, next){
  if (req.user){
    switch(req.params.tipo){
      case("post"):
        res.render('post', {title: 'Make post'})
        break
      case("evento"):
        res.render('evento', {title: 'Create event'})
        break
      case("registo"):
        res.render('registo', {title: 'Make record'})
        break
      case("foto"):
        res.render('foto', {title: 'Publish photo'})
        break
      default:
        res.redirect('/home')
    }
  }
})

router.post("/user", function(req, res, next){
  res.redirect("/user/"+req.body.user)
})

router.post('/home/foto', upload.single('photo'), function(req, res, next) {
  if (req.user) {
    var publica = false
    if (req.body.publica)
      publica = true
    var tags = req.body.tags
    for (index = 0; index < tags.length; ++index) {
      Users.novoClassificador(tags[index])
    }
    Users.criarFoto(req.user.username, req.file.filename, tags, req.body.desc, publica)
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

router.post('/home/post', upload.none(), function(req, res, next) {
  if (req.user) {
    var publica = false
    if (req.body.publica)
      publica = true
    var tags = req.body.tags
    for (index = 0; index < tags.length; ++index) {
      Users.novoClassificador(tags[index])
    }
    Users.criarPost(req.user.username, req.body.texto, tags, publica)
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

router.post('/home/evento', upload.none(), function(req, res, next) {
  if (req.user) {
    var publica = false
    if (req.body.publica)
      publica = true
    var tags = req.body.tags
    for (index = 0; index < tags.length; ++index) {
      Users.novoClassificador(tags[index])
    }
    Users.criarEvento(req.user.username, req.body.data, req.body.local, req.body.hinicio, req.body.hfim, req.body.titulo, req.body.desc, tags, publica)
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

router.post('/home/registo', upload.none(), function(req, res, next) {
  if (req.user) {
    var publica = false
    if (req.body.publica)
      publica = true
    var tags = req.body.tags
    for (index = 0; index < tags.length; ++index) {
      Users.novoClassificador(tags[index])
    }
    Users.criarRegisto(req.user.username, req.body.data, req.body.titulo, req.body.desc, tags, publica)
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

router.get('/user/:username', function(req, res, next) {
  var pubs = Users.publicacoesPublicas(req.params.username)
  pubs.then((doc)=>{
    if (doc.length){
      res.render('userpage', {title: 'Homepage', tipospubs: tipospub, pubs: doc});
    } else {
      res.render('userpage', {title: req.params.username, message: "O utilizador pesquisado não existe!"})
    }
  })
});

router.get('/signin', function(req, res, next){
  if (!req.user){
    res.render('signin', {title: 'Sign In', message: req.flash('message')})
  }else 
    res.redirect('/home')
});

router.post('/signin', upload.single('photo'), passport.authenticate('signup', {
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
