var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

describe("Bicicleta API",() =>{
    describe("GET Bicicletas",()=>{
        it("status 200",() =>{
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1,"blue","Fond");
            Bicicleta.add(a);

            request.get("http://localhost:3000/api/bicicletas",function(error,response,body){
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe("POST Bicicletas /create",()=>{
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
});