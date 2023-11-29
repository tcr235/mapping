// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'points', function () {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'points', function () {
    map.getCanvas().style.cursor = '';
});

var points = {
    //pasta
    'EE_Moreira_e_Silva': { 'name': 'EE_Moreira_e_Silva', 'coordinates': [-35.73938771809209, -9.641382059592544]},
    'EE_Prof_Afranio_Lages': { 'name': 'EE_Prof_Afranio_Lages', 'coordinates': [ -35.74202524865233, -9.646182701863564]},
    'Condominio_Armando_Lobo': { 'name': 'Condominio_Armando_Lobo', 'coordinates': [-35.74141643145757, -9.641263712633204]}
 
}

map.on('click', 'points', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var properties = e.features[0].properties;
    
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML("<a href='#" + properties.name + "' class='popup-link'>" + properties.name + "</a>")
    .addTo(map);
});

map.on('load', function() {
    map.loadImage('../js/icon.png', function(error, image) {
        if (error) throw error;
        map.addImage('pin', image);
        
        var features = Object.keys(points).map(function(point) {
            return {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": points[point].coordinates
                },
                "properties": {
                    "name": points[point].name
                }
            }
        })
        
        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": features
                }
            },
            "layout": {
                'icon-allow-overlap': true,
                "icon-image": "pin",
                "icon-size": 0.25
            }
        });
    });
});

function onHash(hash) {
    var hash = location.hash.split('#')[1]
    if (hash === undefined) {
        document.querySelector('#popup-wrapper').style.display = 'none';
        return;
    }
    
    var popupHtml =
    '<a id="close-button" href="#"></a>' +
    '<h1 align="center">' + points[hash].name + '</h1>' +
    '<iframe width="100%" height="100%" src="./images/' + hash + '/relatorio.pdf" />';
    
    var popup = document.querySelector('#popup');
    popup.innerHTML = popupHtml;
    
    document.querySelector('#popup-wrapper').style.display = 'block';
}

window.addEventListener("hashchange", onHash, false);
if (window.location.hash) {
    onHash(window.location.hash)
}
