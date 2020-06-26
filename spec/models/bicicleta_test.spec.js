var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
const { ExpectationFailed } = require('http-errors');

describe('Testing Bicicletas',function(){
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
        Bicicleta.deleteMany({},function(err,success){
            if(err) console.log(err);
            done();
        });
    });

    describe('Bicicleta.createInstance',() =>{
        it('crea una instancia de Bicicleta',() =>{
            var bici = Bicicleta.createInstance(1,'verde','urbana',[-34.5,-54.1]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe('verde');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
        });
    });

    describe('Bicicleta.allBicis',() =>{
        it('Comienza vacía',(done) =>{
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add',()=>{
        it('agrega una nueva bicicleta',(done) =>{
            var bici = new Bicicleta({code:1,color:'verde',modelo:'Zuru',ubicacion:[-110.8571443, 32.4586858]});
            Bicicleta.add(bici,function(err,newBici){
                if(err) console.log(err);
                Bicicleta.allBicis(function(err,bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toBe(bici.code);
                    done();
                });
            });
        });
    });

    describe('Bicicleta.findByCode',() =>{
        it('busca una bicicleta',(done)=>{
            var bici1 = new Bicicleta({code:1,color:'verde',modelo:'Zuru',ubicacion:[-110.8571443, 32.4586858]});
            Bicicleta.add(bici1,function(err,newBici1){
                if(err) console.log(err);
                var bici2 = new Bicicleta({code:2,color:'blue',modelo:'Uru',ubicacion:[-110.8571443, 32.4586858]});
                Bicicleta.add(bici2,function(err,newBici2){
                    if(err) console.log(err);
                    Bicicleta.findByCode(1,function(err,targetBici){
                        expect(targetBici.code).toBe(bici1.code);
                        expect(targetBici.ubicacion[0]).toBe(bici1.ubicacion[0]);
                        done();
                    });
                });
            });
        });
    });

    describe('Bicicleta.removeByCode',() =>{
        it('borrar una bicicleta',(done) =>{
            var bici1 = new Bicicleta({code:1,color:'verde',modelo:'Zuru',ubicacion:[-110.8571443, 32.4586858]});
            Bicicleta.add(bici1,function(err,newBici1){
                if(err) console.log(err);
                var bici2 = new Bicicleta({code:2,color:'blue',modelo:'Uru',ubicacion:[-110.8571443, 32.4586858]});
                Bicicleta.add(bici2,function(err,newBici2){
                    if(err) console.log(err);
                    Bicicleta.removeByCode(1,function(err,targetBici){
                        Bicicleta.allBicis(function(err,bicis){
                            if(err) console.log(err);
                            expect(bicis.length).toBe(1);
                            expect(bicis[0].code).toBe(2);
                            done();
                        });
                    });
                });
            });
        });
    });
});