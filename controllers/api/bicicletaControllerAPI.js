var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function (req, res) {
    Bicicleta.allBicis(function (err, bicis) {
        res.status(200).json({
            bicicletas: bicis
        });
    });
}

exports.bicicleta_create = function (req, res) {
    var bici = new Bicicleta({
      code: req.body.id,
      color: req.body.color,
      modelo: req.body.modelo,
      ubicacion: [req.body.lat,req.body.lng]
    });

    Bicicleta.add(bici,function(err,newBici){
        if(err) console.log(err);

        res.status(200).json({
            bicicleta: newBici
        }); 
    });
}

exports.bicicleta_update = function (req, res) {
    
    Bicicleta.findByCode(req.params.id,function(err,bici){
        if(err) console.log(err);
        
        var bici = {
            code: req.body.id,
            color: req.body.color,
            modelo: req.body.modelo,
            ubicacion: [req.body.lat,req.body.lng]
        }

        Bicicleta.updateBici(req.params.id,bici,function(err,bici){
            res.status(200).json({
                bicicleta: bici
            });
        });
    });
}

exports.bicicleta_delete = function (req, res) {
    Bicicleta.removeByCode(req.params.id,function(err,oldBici){
        if(err) console.log(err);
        res.status(200).json({
            result: oldBici
        }); 
    });
}