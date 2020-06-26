var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color:String,
    modelo: String,
    ubicacion:{
        type: [Number],index:{type: '2dsphere', sparse:true}
    }
});

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
       code:code,
       color:color,
       modelo:modelo,
       ubicacion:ubicacion 
    });
};

bicicletaSchema.methods.toString = function () {
    return "Id: " + this.code + "|" + "Color: " + this.color; 
};

bicicletaSchema.statics.allBicis = function(cb){
    return this.find({},cb);
};

bicicletaSchema.statics.add = function(bici,cb){
    this.create(bici,cb);
};

bicicletaSchema.statics.findByCode = function(code,cb){
    return this.findOne({code:code},cb);
};

bicicletaSchema.statics.updateBici = function(code,bici,cb){
    this.updateOne({code:code},bici,cb);
};

bicicletaSchema.statics.removeByCode = function(code,cb){
    return this.deleteOne({code:code},cb);
};

module.exports = mongoose.model('Bicicleta',bicicletaSchema);
