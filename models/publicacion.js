var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var publicacionSchema = new Schema({
    code: {
        type: String,
        trim:true,
        required: [true, "El code es obligatorio"]
    },
    persona: {type: mongoose.Schema.Types.ObjectId, ref: 'Persona'},
    mascota: {type: mongoose.Schema.Types.ObjectId, ref: 'Mascota'},
    latitud: {
        type: Number,
        required: [true, "La latitud es obligatoria"]
    },
    longitud: {
        type: Number,
        required: [true, "La longitud es obligatorio"]
    },
    tipo:{
        type: Number,
        required: [true, "El tipo es obligatorio"]
    },
    fecha:{
        type: String,
        required: [true, "La fecha es obligatoria"]
    },
    hora:{
        type: String,
        required: [true, "La hora es obligatoria"]
    }
});

publicacionSchema.statics.findByCode = function(code,cb){
    return this.findOne({code:code},cb);
};

module.exports = mongoose.model("Publicacion",publicacionSchema);