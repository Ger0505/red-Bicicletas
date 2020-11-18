var mongoose = require('mongoose');

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

module.exports = mongoose.model('Persona',personaSchema);