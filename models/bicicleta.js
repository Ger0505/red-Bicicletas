var Bicicleta = function (id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function () {
    return "Id: " + this.id + "|" + "Color: " + this.color; 
}

Bicicleta.allBicis = [];

Bicicleta.add = function(newBici){
    Bicicleta.allBicis.push(newBici);
}

Bicicleta.findById = function(id){
    var bici = Bicicleta.allBicis.find(x => x.id == id);

    if(bici){
        return bici;
    }else{
        throw new Error(`No existe una bicicleta con el id ${id}`);
    }
}

Bicicleta.removeById = function(id){
    for (let i = 0; i < Bicicleta.allBicis.length; i++) {
       if(Bicicleta.allBicis[i].id == id){
           Bicicleta.allBicis.splice(i,1);
           break;
       }
    }
}

//var bici1 = new Bicicleta(11,'orange','Max Steel',[19.421209, -99.115825]);
//var bici2 = new Bicicleta(12,'red','Wheels',[19.422691, -99.120518]);
// Bicicleta.add(bici1);
// Bicicleta.add(bici2);

module.exports = Bicicleta;

