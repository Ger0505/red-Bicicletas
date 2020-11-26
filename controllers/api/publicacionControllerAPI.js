var Publicacion = require('../../models/publicacion');
var Mascota = require('../../models/mascota');
const mascota = require('../../models/mascota');

exports.publicacions_list = function(req,res){
    Mascota.find({},function(err,publicacions){
        res.status(200).json({
            publicacions:publicacions
        });
    });
};

exports.publicacion_get = function(req,res){
    Publicacion.findByCode(req.params.code,function(err,publicacion){
        if(err) res.status(500).json(err);
        res.status(200).json(publicacion);
    });
}

exports.publicacion_create = function(req,res){
    var mascota = new Mascota({
        code: req.body.code,
        nombre:req.body.nombre,
        descripcion:req.body.descripcion,
        tipo:req.body.tipo,
        sexo:req.body.sexo,
        puesto: req.body.puesto,
        tamanio: req.body.tamanio,
        imagen: req.body.imagen
    });
    mascota.save(function(err){
        if(err) res.status(500).json(err);
        var publicacion = new Publicacion({
            code: req.body.code,
            persona: req.body.id_persona,
            mascota: mascota._id,
            solicitud:req.body.solicitud,
            latitud:req.body.latitud,
            longitud:req.body.longitud,
            fecha:req.body.fecha,
            hora: req.body.hora
        });
    
        publicacion.save(function(err){
            if(err) res.status(500).json(err);
            res.status(200).json(publicacion);
        });
    });
};

// exports.publicacion_update = function (req, res) {
    
//     Publicacion.findByCode(req.params.code,function(err,publicacion){
//         if(err) console.log(err);
        
//         var data = {
//             code: req.body.code,
//             nombre:req.body.nombre,
//             descripcion:req.body.descripcion,
//             tipo:req.body.tipo,
//             sexo:req.body.sexo,
//             puesto: req.body.puesto,
//             tamanio: req.body.tamanio,
//             imagen: req.body.imagen
//         }

//         Publicacion.updateOne({code: req.params.code},data,function(err,publicacion){
//             res.status(200).json({
//                 publicacion: publicacion
//             });
//         });
//     });
// }

exports.publicacion_delete = function (req, res) {
    Publicacion.deleteOne({code: req.params.code},function(err,old){
        if(err) console.log(err);
        res.status(200).json({
            result: old
        }); 
    });
}