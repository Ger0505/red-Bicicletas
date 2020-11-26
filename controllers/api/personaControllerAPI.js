var Persona = require('../../models/persona');

exports.personas_list = function(req,res){
    Persona.find({},function(err,personas){
        res.status(200).json({
            personas:personas
        });
    });
};

exports.persona_session = function(req,res){
    var session = {
        nombre : req.body.nombre,
        password: req.body.password
    }
    Persona.findOne(session,function (err,persona) {
        res.status(200).json({
            persona: persona
        });
    })
};

exports.persona_create = function(req,res){
    var persona = new Persona({
        code:req.body.code,
        nombre:req.body.nombre,
        password:req.body.password,
        direccion:req.body.direccion,
        telefono: req.body.telefono
    });

    persona.save(function(err){
        if(err) res.status(500).json(err);
        res.status(200).json(persona);
    });
};

exports.persona_update = function (req, res) {
    
    Persona.findByCode(req.params.code,function(err,person){
        if(err) console.log(err);
        
        var data = {
            code: req.body.code,
            nombre: req.body.nombre,
            password: req.body.password,
            direccion: req.body.direccion,
            telefono: req.body.telefono
        }

        Persona.updateOne({code: req.params.code},data,function(err,person){
            res.status(200).json({
                persona: person
            });
        });
    });
}

exports.persona_delete = function (req, res) {
    Persona.deleteOne({code: req.params.code},function(err,oldPerson){
        if(err) console.log(err);
        res.status(200).json({
            result: oldPerson
        }); 
    });
}