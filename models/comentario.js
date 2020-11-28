var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var comentarioSchema = new Schema({
    code: {
        type: Number
    },
    persona: {type: mongoose.Schema.Types.ObjectId, ref: 'Persona'},
    publicacion: {type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion'},
    descripcion: {
        type: String,
        trim:true,
        required: [true, "La descripcion es obligatoria"]
    },
    fecha: {
        type: String,
        required: [true, "La fecha es obligatoria"]
    },
    hora: {
        type: String,
        required: [true, "La hora es obligatorio"]
    }
});

comentarioSchema.plugin(autoIncrement.plugin, { model: 'Comentario', field: 'code' });

comentarioSchema.statics.findByCode = function(code,cb){
    return this.findOne({code:code},cb);
};

module.exports = mongoose.model("Comentario",comentarioSchema);