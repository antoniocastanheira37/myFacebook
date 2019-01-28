var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.obterUser = (username) => {
    return User
    .findOne({'username': username})
    .exec()
}

module.exports.publicacoesPublicas = (username) => {
    return User.findOne({'username': username, 'publicacoes.publica': true}, 'photo username firstname lastname publicacoes').sort('-publicacoes.createdAt').exec()   
}

module.exports.todasPublicacoes = (username) => {
    return User.findOne({'username': username}, 'photo firstname lastname publicacoes').sort('-publicacoes.createdAt').exec()   
}

module.exports.userExiste = (username) => {
    return User.count({'username': username}, (err, count)=>{
        if (count>0)
            return true
        return false
    })
}