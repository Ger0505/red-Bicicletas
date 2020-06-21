var map = L.map('main_map').setView([19.419863, -99.118615], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$.ajax({
    dataType: "json",
    url:"api/bicicletas",
    success: function(res){
        console.log(res);
         res.bicicletas.forEach(element => {
             L.marker(element.ubicacion,{title: element.id}).addTo(map);
         });
    }
});