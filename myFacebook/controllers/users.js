var User = require('../models/models');

module.exports.obterUser = (username) => {
    return User
    .findOne({'username': username})
    .exec()
}

module.exports.publicacoesPublicas = (username) => {
    return User.findOne({'username': username, 'publicacoes.publica': true}, 'username publicacoes').sort('-publicacoes.createdAt').exec()   
}

module.exports.todasPublicacoes = (username) => {
    return User.findOne({'username': username}, 'username publicacoes').sort('-publicacoes.createdAt').exec()   
}

module.exports.registarUser = (user) => {
    
  var finalUser = User.create(user);

  finalUser.setPassword(user.password);

  return finalUser.save().toAuthJSON();
}