var express = require('express');
var router = express.Router();
var Users = require('../controllers/users');
var auth = require('./auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*POST sign in page*/
router.post('/signin', auth.optional, (req, res, next) => {

  if(!req.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if(!req.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return Users.inserir(req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).send('Erro na inserção de utilizador.'));
});

/* GET home page. */
router.get('/mainPage', function(req, res, next) {
  res.render('mainPage', { title: 'Express' });
});

module.exports = router;
