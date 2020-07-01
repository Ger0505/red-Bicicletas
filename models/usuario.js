var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
const saltRounds = 10;

const Token = require('../models/token');
const mailer = require('../mailer/mailer');

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
        unique:true,
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

usuarioSchema.plugin(uniqueValidator,{message: 'El {PATH} ya es por otro usuario'});

usuarioSchema.pre('save',function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password,saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password,this.password);
}

usuarioSchema.methods.resetPassword = function (cb){
    const token = new Token({_userId:this.id,token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) {return cb(err);}

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola,\n\n'+ 'Por favor, para resetear password haga click en este link:\n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions,function (err) {
            if(err){return cb(err);}

            console.log('Se ha enviado un email de bienvenida a: '+ email_destination + '.');        
        });
        cb(null);
    });
}

usuarioSchema.methods.reservar = function(biciID,desde,hasta,cb){
    var reserva = new Reserva({usuario:this._id,bicicleta:biciID,desde:desde,hasta:hasta});
    console.log(reserva);
    reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
    const token = new Token({_userId:this.id,token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) {
            return console.log(err.message);
        }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n'+ 'Por favor, para verificar su cuenta haga click en este link:\n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token
        };

        mailer.sendMail(mailOptions,function (err) {
            if(err){return console.log(err.message);}

            console.log('Se ha enviado un email de bienvenida a: '+ email_destination + '.');        
        });
        
    });
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition,callback){
    const self = this;
    console.log(condition);
    self.findOne({
        $or:[{'googleId': condition.id},{'email':condition.emails[0].value}
    ]},(err,result) =>{
        if(result){
            callback(err,result);
        }else{
            console.log('------------- CONDITION --------------');
            console.log(condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            values.password = condition._json.sub;
            console.log('-------------- VALUES ---------------');
            console.log(values);
            self.create(values,(err,result) =>{
                if(err) {console.log(err);}
                return callback(err,result);
            });
        }
    });
}

module.exports = mongoose.model("Usuario",usuarioSchema);