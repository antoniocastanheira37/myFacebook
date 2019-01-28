var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs')

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
    firstname: {type: String},
    lastname: {type: String},
    password: {type: String},
    publicacoes: [PublicacaoSchema|FotoSchema|RegistoFormacaoSchema|RegistoDesportivoSchema|EventoSchema]
})
  
UserSchema.methods.isValidPassword = function(password){
    return bCrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model("User", UserSchema, 'users');