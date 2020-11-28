var Publicacion = require('../../models/publicacion');
var Mascota = require('../../models/mascota');
var Persona = require('../../models/persona');
var Comentario = require('../../models/comentario');

exports.publicacions_list = function(req,res){
    Publicacion.find({solicitud: req.params.tipo},function(err,publicacions){
        Mascota.populate(publicacions,{path: "mascota"},function (err,publicacions) {
            Persona.populate(publicacions,{path: "persona", select: "code telefono"},function(err,publicacions){
                res.status(200).json({
                    publicaciones:publicacions
                }); 
            })
        });
    });
};

exports.publicacion_get = function(req,res){
    Publicacion.findByCode(req.params.code,function(err,publicacion){
        if(err) res.status(500).json(err);
        Mascota.populate(publicacion,{path: "mascota"},function (err,publicacion) {
            Persona.populate(publicacion,{path: "persona"},function (err,publicacion) {
                res.status(200).json({
                    publicacion:publicacion
                }); 
            });
        });
    });
}

exports.publicacion_create = function(req,res){
    Persona.findByCode(req.body.code_persona,function (err,persona) {
        if(err) res.status(500).json(err);
        var mascota = new Mascota({
            code: req.body.code_mascota,
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
                persona: persona._id,
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
    });
};

exports.publicacion_delete = function (req, res) {
    Publicacion.deleteOne({code: req.params.code},function(err,old){
        if(err) console.log(err);
        res.status(200).json({
            result: old
        }); 
    });
}

exports.publicacion_comments = function(req,res){
    Publicacion.findByCode(req.params.code,function(err,pub){
        if(err) res.status(500).json(err);
        Comentario.find({publicacion: pub._id},null,{sort:{code:"desc"}},function(err,comentarios){ // Donde está null poner los campos regresar ["descripcion","fecha"]
            if(err) res.status(500).json(err);
            Persona.populate(comentarios,{path: "persona", select:"nombre"},function(err,comentarios){
                res.status(200).json({
                    comentarios:comentarios
                }); 
            });
        });
    });
}

exports.publicacion_addcomment = function(req,res){
    Publicacion.findByCode(req.body.code_publicacion,function(err,pub){
        if(err) res.status(500).json(err);
        Persona.findByCode(req.body.code_persona,function(err,persona){
            if(err) res.status(500).json(err);
            var comentario = new Comentario({
                persona: persona._id,
                publicacion: pub._id,
                descripcion: req.body.descripcion,
                fecha: req.body.fecha,
                hora: req.body.hora
            });

            comentario.save(function(err){
                if(err) res.status(500).json(err);
                res.status(200).json(comentario);
            });
        });
    });
}