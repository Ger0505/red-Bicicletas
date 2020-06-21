var map = L.map('main_map').setView([17.267182, -97.680185], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([17.267182,-97.680185]).addTo(map)
    .bindPopup('Tlaxiaco Park')
    .openPopup();