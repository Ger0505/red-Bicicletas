var mongoose = require('mongoose');
var Comentario = require('./comentario');
var Publicacion = require('./publicacion');
var Schema = mongoose.Schema;

var personaSchema = new Schema({
    code:{
        type: String,
        trim: true,
        required: [true, "El code es obligatorio"]
    },
    nombre: {
        type: String,
        trim:true,
        required: [true, "El nombre es obligatorio"]
    },
    password:{
        type:String,
        trim:true,
        required:[true,"El password es obligatorio"],
    },
    direccion: {
        type: String,
        trim:true,
        required: [true, "La dirección es obligatoria"]
    },
    telefono: {
        type: Number,
        required: [true, "El nombre es obligatorio"]
    }
});

personaSchema.statics.findByCode = function(code,cb){
    return this.findOne({code:code},cb);
};

personaSchema.methods.deleteComentarios = function () {
    Comentario.deleteMany({persona: this._id}, function(err,data){
        console.log("Elimados todos los comentarios...");
    });    
};

personaSchema.methods.deletePublicaciones = function () {
    Publicacion.deleteMany({persona: this._id}, function(err,data){
        console.log("Elimados todos los comentarios...");
    });    
};

module.exports = mongoose.model('Persona',personaSchema);