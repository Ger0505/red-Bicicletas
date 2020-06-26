var mongoose = require('mongoose');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');
var Bicicleta = require('../../models/bicicleta');
const { ExpectationFailed } = require('http-errors');

describe('Testing Usuario',function(){
    beforeEach(function(done){
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.set('useCreateIndex', true);
        const db = mongoose.connection;
        db.on('error',console.error.bind(console,'connection error'));
        db.once('open',function(){
            console.log('We are connected to test database');
            done();
        });
    });

    afterEach(function(done){
        Reserva.deleteMany({},function(err,success){
            if(err) console.log(err);
            Bicicleta.deleteMany({},function(err,success){
                if(err) console.log(err);
                Usuario.deleteMany({},function(err,success){
                    if(err) console.log(err);
                    done();
                });
            });
        });
    });

    describe('Usuario.reservar',() =>{
        it('guarda una reserva',(done) =>{
            var bici = new Bicicleta({code: 12, color: "green", modelo: "Json", ubicacion: [-110.8571443,32.4586858]});
            bici.save();
            var usuario = new Usuario({nombre:"Viktor"});
            usuario.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate()+1);
            usuario.reservar(bici.id,hoy,mañana,function(err,reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err,reservas){
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(bici.code);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });
        });
    });
});
