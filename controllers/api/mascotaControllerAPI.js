var Mascota = require('../../models/mascota');

exports.mascotas_list = function(req,res){
    Mascota.find({},function(err,mascotas){
        res.status(200).json({
            mascotas:mascotas
        });
    });
};

exports.mascota_get = function(req,res){
    Mascota.findByCode(req.params.code,function(err,mascota){
        if(err) res.status(500).json(err);
        res.status(200).json(mascota);
    });
}

exports.mascota_create = function(req,res){
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
        res.status(200).json(mascota);
    });
};

exports.mascota_update = function (req, res) {
    
    Mascota.findByCode(req.params.code,function(err,mascota){
        if(err) console.log(err);
        
        var data = {
            code: req.body.code,
            nombre:req.body.nombre,
            descripcion:req.body.descripcion,
            tipo:req.body.tipo,
            sexo:req.body.sexo,
            puesto: req.body.puesto,
            tamanio: req.body.tamanio,
            imagen: req.body.imagen
        }

        Mascota.updateOne({code: req.params.code},data,function(err,mascota){
            res.status(200).json({
                mascota: mascota
            });
        });
    });
}

exports.mascota_delete = function (req, res) {
    Mascota.deleteOne({code: req.params.code},function(err,oldMascota){
        if(err) console.log(err);
        res.status(200).json({
            result: oldMascota
        }); 
    });
}