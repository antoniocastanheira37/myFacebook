var mongoose = require('mongoose');
var User = mongoose.model('User');
var Photo = mongoose.model('Foto');
var Registo = mongoose.model('Registo');
var Evento = mongoose.model('Evento');
var Publicacao = mongoose.model('Publicacao');
var Classificador = mongoose.model('Tag');
var Base = mongoose.model('Base');

module.exports.obterUser = (username) => {
    return User.findOne({'username': username}).exec()
}

module.exports.publicacoesPublicas = (username) => {
    return Base.find({'username': username, 'publica': true}).sort('-createdAt').exec()   
}

module.exports.todasPublicacoes = (username) => {
    return Base.find({'username': username}).sort('-createdAt').exec()   
}

module.exports.criarFoto = (username, path, tags, descricao=null, publica=false) => {
    var photo = new Photo()
    photo.username = username
    photo.fotoPath = path
    if (descricao)
        photo.descricao = descricao
    photo.publica = publica
    photo.tags = tags
    photo.save()
    return photo
}

module.exports.criarPost = (username, texto, tags, publica=false) => {
    var pub = new Publicacao()
    pub.username = username
    pub.texto = texto
    pub.publica = publica
    pub.tags = tags
    pub.save()
    return pub
}


module.exports.criarEvento = (username, data, local, hinicio, hfim, titulo, desc, tags, publica=false) => {
    var evento = new Evento()
    evento.username = username
    evento.data = data
    evento.local = local
    evento.hinicio = hinicio
    evento.hfim = hfim
    evento.titulo = titulo
    evento.descricao = desc
    evento.tags = tags
    evento.publica = publica
    evento.save()
    return evento
}

module.exports.criarRegisto = (username, data, titulo, desc, tags, publica=false) => {
    var registo = new Registo()
    registo.username = username
    registo.data = data
    registo.titulo = titulo
    registo.descricao = desc
    registo.tags = tags
    registo.publica = publica
    registo.save()
    return registo
}

module.exports.classificadores = () => {
    return Classificador.find().exec()
}

module.exports.obterClassificador = (tag) => {
    return Classificador.findOne({'tag': tag}).exec()
}

module.exports.novoClassificador = (tag) => {
    var c= new Classificador()
    c.tag = tag
    c.save((err)=>{})
    return c
}

module.exports.publicacoesTipo = (tipo, user) => {
    return Base.find({tipo: {$in: tipo}, username: user}).exec()
}

module.exports.publicacoesTag = (tags, user) => {
    return Base.find({tags: {$in: tags}, username: user}).exec()
}

module.exports.publicacoesTipoTag = (tipo, tags, user) => {
    return Base.find({tipo: {$in: tipo}, tags: {$in: tags}, username: user}).exec()
}

module.exports.atualizar = (pub) => {
    return Base.findOneAndUpdate({_id: pub._id}, pub)
}

module.exports.obterPublicacao = (id)=>{
    return Base.findOne({_id: id}).exec()
}