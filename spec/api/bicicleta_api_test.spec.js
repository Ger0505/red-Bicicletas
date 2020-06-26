var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
//var server = require('../../bin/www');
var request = require('request');

describe('Bicicleta API',() =>{
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

    describe("GET bicicletas",()=>{
        it("status 200",(done) =>{
            request.get("http://localhost:3000/api/bicicletas",function(error,response,body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(1);
                done();
            });
        });
    });

    describe("POST bicicletas/create",()=>{
        it("status 200",(done) =>{
            var headers = {'content-type': 'application/json'};
            var aBici = '{"id":11,"color":"green","modelo":"Json","lat":-110.8571443,"lng":32.4586858}';
            request.post({
                headers : headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
                },function(error,response,body){
                    expect(response.statusCode).toBe(200);
                    var bici = JSON.parse(body).bicicleta;
                    expect(bici.color).toBe("green");
                    expect(bici.ubicacion[0]).toBe(-110.8571443);
                    expect(bici.ubicacion[1]).toBe(32.4586858);
                    done();
            });
        });
    });

    describe("POST bicicletas/:id/update",()=>{
        it("status 200",(done) =>{
            Bicicleta.allBicis(function(err,bicis){
                if(err) console.log(err);
                
                expect(bicis.length).toBe(0);
            });
            var bici = new Bicicleta({
              code: 12,
              color: "green",
              modelo: "Json",
              ubicacion: [-110.8571443,32.4586858]
            });
            Bicicleta.add(bici,function(err,newBici){
                if(err) console.log(err);
                Bicicleta.allBicis(function(err,bicis){
                    if(err) console.log(err);
                    
                    expect(bicis.length).toBe(1);
                });
                var headers = {'content-type': 'application/json'};
                var aBici = '{"id":12,"color":"red","modelo":"Jackson","lat":-110.8571443,"lng":32.4586858}';
                request.post({
                    headers : headers,
                    url: 'http://localhost:3000/api/bicicletas/12/update',
                    body: aBici
                },function(error,response,body){
                    if(err) console.log(err);
                    var info = JSON.parse(body);
                    console.log(info);
                    
                    expect(response.statusCode).toBe(200);
                    Bicicleta.findByCode(12,function(err,ebici){
                        console.log(ebici);
                        
                        if(err) console.log(err);
                        expect(ebici.color).toBe("red");
                        expect(ebici.modelo).toBe("Jackson");
                        done(); 
                    });
                });
            });
        });
    });

    describe("DELETE bicicletas/:id/delete",()=>{
        it("status 200",(done) =>{
            var bici = new Bicicleta({
              code: 12,
              color: "green",
              modelo: "Json",
              ubicacion: [-110.8571443,32.4586858]
            });
            Bicicleta.add(bici,function(err,bici){
                Bicicleta.allBicis(function(err,bicis){
                    expect(bicis.length).toBe(1);
                });
                request.delete('http://localhost:3000/api/bicicletas/12/delete',
                function(error,response,body){
                    if(error) console.log(error);
                    
                    Bicicleta.allBicis(function(err,bicis){
                        expect(bicis.length).toBe(0);
                        done();
                    });
                });
            });
        });
    });
});


