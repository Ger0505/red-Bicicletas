var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mascotaSchema = new Schema({
    code: {
        type: String,
        trim:true,
        required: [true, "El code es obligatorio"]
    },
    nombre: {
        type: String,
        trim:true,
        required: [true, "El nombre es obligatorio"]
    },
    descripcion:{
        type: String,
        trim:true,
        required: [true, "La descripción es obligaria"]
    },
    tipo:{
        type: String,
        trim:true,
        required: [true, "El tipo es obligario"]
    },
    sexo:{
        type: Number,
        required: [true, "El sexo es obligatorio"]
    },
    puesto:{
        type: Number,
        required: [true, "El sexo es obligatorio"]
    },
    tamanio:{
        type: Number,
        required: [true, "El tamaño es obligatorio"]
    },
    imagen:{
        type: String,
        trim: true,
        required: [true, "La imagen es obligatoria"]
    }
});

mascotaSchema.statics.findByCode = function(code,cb){
    return this.findOne({code:code},cb);
};

module.exports = mongoose.model("Mascota",mascotaSchema);