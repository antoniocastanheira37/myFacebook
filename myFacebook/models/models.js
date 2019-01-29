var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;

var HashtagSchema = new Schema({
  tag: {type: String, unique: true, required: true}
})

var PublicacaoSchema = new Schema({
  username: {type: String, required: true},
  tags: [{type: String}],
  texto: {type: String, required: true},
  publica: {type: Boolean, required: true, default: false}
}, {timestamps: true, discriminatorKey: "tipo", collection: 'pubs'})

var EventoSchema = new Schema({
  username: {type: String, required: true},
  data: {type: String, required: true},
  local: {type: String, required: true},
  hinicio: {type: String, required: true},
  hfim: {type: String, required: true},
  titulo: {type: String, required: true},
  descricao: {type: String, required: true},
  tags: [{type: String}],
  publica: {type: Boolean, default: false}
}, {timestamps: true, discriminatorKey: "tipo", collection: 'pubs'})

var RegistoSchema = new Schema({
  username: {type: String, required: true},
  data: {type: String, required: true},
  titulo: {type: String, required: true},
  tags: [{type: String}],
  descricao: {type: String, required: true},
  publica: {type: Boolean, default: false}
}, {timestamps: true, discriminatorKey: "tipo", collection: 'pubs'})

var FotoSchema = new Schema({
  username: {type: String, required: true},
  tags: [{type: String}],
  fotoPath: {type: String, required: true},
  descricao: {type: String},
  publica: {type: Boolean, default: false}
}, {timestamps: true, discriminatorKey: "tipo", collection: 'pubs'})

var UserSchema = new Schema({
  photo: {path: {type: String}, desc: {type: String}},
  username: {type: String, unique: true},
  firstname: {type: String},
  lastname: {type: String},
  password: {type: String}
})

var BasePubSchema =new Schema({}, {
  discriminatorKey: "tipo", 
  collection: "pubs", 
  timestamps: true
})

UserSchema.methods.isValidPassword = function(password){
  return bCrypt.compareSync(password, this.password);
};

var Base = mongoose.model('Base', BasePubSchema);
Base.discriminator('post', PublicacaoSchema);
Base.discriminator("registo", RegistoSchema);
Base.discriminator("evento", EventoSchema);
Base.discriminator("foto", FotoSchema);
module.exports = mongoose.model('Publicacao', PublicacaoSchema);
module.exports = mongoose.model("Registo", RegistoSchema);
module.exports = mongoose.model("Evento", EventoSchema);
module.exports = mongoose.model("Foto", FotoSchema);
module.exports = mongoose.model("Tag", HashtagSchema, 'tags');
module.exports = Base;
module.exports = mongoose.model("User", UserSchema, 'users');