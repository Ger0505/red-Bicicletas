var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

beforeEach(function(){
    Bicicleta.allBicis = [];
});

describe("Bicicleta API",() =>{
    describe("GET bicicletas",()=>{
        it("status 200",() =>{
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1,"blue","Fond");
            Bicicleta.add(a);

            request.get("http://localhost:3000/api/bicicletas",function(error,response,body){
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe("POST bicicletas/create",()=>{
        it("status 200",(done) =>{
            var headers = {'content-type': 'application/json'};
            var aBici = '{"id":10,"color":"green","modelo":"Json","lat":-34,"lng":-54}';
            request.post({
                headers : headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
                },function(error,response,body){
                    expect(response.statusCode).toBe(200);
                    expect(Bicicleta.findById(10).color).toBe("green");
                    done();
            });
        });
    });

    describe("POST bicicletas/:id/update",()=>{
        it("status 200",(done) =>{
            var bici = new Bicicleta(10,"green","Json",[-34,-54]);
            Bicicleta.add(bici);

            var headers = {'content-type': 'application/json'};
            var aBici = '{"id":10,"color":"blue","modelo":"Json","lat":-100,"lng":-54}';
            request.post({
                headers : headers,
                url: 'http://localhost:3000/api/bicicletas/10/update',
                body: aBici
                },function(error,response,body){
                    expect(response.statusCode).toBe(200);
                    expect(Bicicleta.findById(10).color).toBe("blue");
                    expect(Bicicleta.findById(10).ubicacion[0]).toBe(-100);
                    done();
            });
        });
    });

    describe("DELETE bicicletas/:id/delete",()=>{
        it("status 200",(done) =>{
            var bici = new Bicicleta(10,"green","Json",[-34,-54]);
            Bicicleta.add(bici);

            var headers = {'content-type': 'application/json'};
            var aBici = '{"id":10,"color":"blue","modelo":"Json","lat":-100,"lng":-54}';
            request.delete({
                headers : headers,
                url: 'http://localhost:3000/api/bicicletas/10/delete',
                },function(error,response,body){
                    expect(Bicicleta.allBicis.length).toBe(0);
                    done();
            });
        });
    });
});