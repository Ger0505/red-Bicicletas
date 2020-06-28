var mongoose = require('mongoose');
var Reserva = require('./reserva');
var bcrypt = require('bcrypt');

const saltRounds = 10;

var Schema = mongoose.Schema;

const validarEmail = function (email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/;
    return re.test(email);
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim:true,
        required: [true, "El nombre es obligatorio"]
    },
    email:{
        type: String,
        trim:true,
        required: [true, "El correo es obligario"],
        lowercase: true,
        validate: [validarEmail,"Ingrese un email válido"],
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/
    },
    password:{
        type:String,
        required:[true,"El password es obligatorio"],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.pre('save',function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password,saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password,this.password);
}

usuarioSchema.methods.reservar = function(biciID,desde,hasta,cb){
    var reserva = new Reserva({usuario:this._id,bicicleta:biciID,desde:desde,hasta:hasta});
    console.log(reserva);
    reserva.save(cb);
};

module.exports = mongoose.model("Usuario",usuarioSchema);