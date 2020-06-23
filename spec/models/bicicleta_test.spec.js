var Bicicleta = require('../../models/bicicleta');

beforeEach(() =>{
    Bicicleta.allBicis = [];
});

describe("Bicicleta.allbicis",() => {
    it('comienza vacia',() =>{
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe("Bicicletas.add",() =>{
    it("agregamos una",() =>{
        expect(Bicicleta.allBicis.length).toBe(0);
        
        var bici1 = new Bicicleta(11,'orange','Max Steel',[19.421209, -99.115825]);
        Bicicleta.add(bici1);
        
        expect(Bicicleta.allBicis.length).toBe(1);
    });
});

describe("Bicicleta.findById",() =>{
    it("Encuentra la bici con el id 11",() =>{
        expect(Bicicleta.allBicis.length).toBe(0);

        var bici2 = new Bicicleta(11,'red','Min Steel',[19.421209, -99.115825]);
        var bici3 = new Bicicleta(12,'green','Steel',[19.421209, -99.115825]);
        Bicicleta.add(bici2);
        Bicicleta.add(bici3);

        var bici = Bicicleta.findById(11);
        expect(bici.id).toBe(bici2.id);
        expect(bici.color).toBe(bici2.color);
        expect(bici.modelo).toBe(bici2.modelo);
    });
});

describe("Bicicleta.removeById",() =>{
    it("borra la bicicleta con el id 11",() =>{
        expect(Bicicleta.allBicis.length).toBe(0);

        var bici2 = new Bicicleta(11,'red','Min Steel',[19.421209, -99.115825]);
        var bici3 = new Bicicleta(12,'green','Steel',[19.421209, -99.115825]);
        Bicicleta.add(bici2);
        Bicicleta.add(bici3);

        var bici = Bicicleta.removeById(11);
        expect(Bicicleta.allBicis.length).toBe(1);
    });
});

