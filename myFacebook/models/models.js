var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var ClassificadorSchema = new Schema({
    tipo: {type: String, required: true}
})

var PublicacaoSchema = new Schema({
    tipo: {type: String, default: 'post'},
    tipo: {type: ClassificadorSchema, required: true},
    texto: {type: String, required: true},
    publica: {type: Boolean, required: true, default: false}
}, {timestamps: true})

var EventoSchema = new Schema({
    tipo: {type: String, default: 'evento'},
    data: {type: String, required: true},
    local: {type: String, required: true},
    hinicio: {type: String, required: true},
    hfim: {type: String, required: true},
    titulo: {type: String, required: true},
    descricao: {type: String, required: true},
    tipo: {type: ClassificadorSchema, required: true},
    publica: {type: Boolean, default: false}
}, {timestamps: true})

var RegistoDesportivoSchema = new Schema({
    tipo: {type: String, default: 'rdesportivo'},
    data: {type: String, required: true},
    titulo: {type: String, required: true},
    desporto: {type: String, required: true},
    descricao: {type: String, required: true},
    publica: {type: Boolean, default: false}
}, {timestamps: true})


var RegistoFormacaoSchema = new Schema({
    tipo: {type: String, default: 'rformacao'},
    data: {type: String, required: true},
    titulo: {type: String, required: true},
    desporto: {type: String, required: true},
    descricao: {type: String, required: true},
    publica: {type: Boolean, default: false}
}, {timestamps: true})

var FotoSchema = new Schema({
    tipo: {type: String, default: 'foto'},
    fotoPath: {type: String, required: true},
    descricao: {type: String, required: true},
    publica: {type: Boolean, default: false}
}, {timestamps: true})

var UserSchema = new Schema({
    username: {type: String, unique: true},
    name: {type: String},
    hash: {type: String},
    publicacoes: [PublicacaoSchema|FotoSchema|RegistoFormacaoSchema|RegistoDesportivoSchema|EventoSchema]
})

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
  
UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
  
UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
  
    return jwt.sign({
        username: this.username,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}
  
UserSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        username: this.username,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model("User", UserSchema, 'users');