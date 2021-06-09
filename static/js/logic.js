var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(URL).then(data => {
    createFeatures(data.features)
});

function colorPicker(depth) {
    var fillColor = "";
    if (depth < 10) { fillColor = "#03fc2c"; }
    else if (depth < 30) { fillColor = "#f0f029"; }
    else if (depth < 50) { fillColor = "#fcdb00"; }
    else if (depth < 70) { fillColor = "#ffb300"; }
    else if (depth < 90) { fillColor = "#ff7300"; }
    else { fillColor = "#f53520"; }
    return fillColor;
}

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>");
    }
    var weekEarthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var attCircles = {
                radius: (3 * feature.properties.mag),
                fillColor: colorPicker(feature.geometry.coordinates[2]),
                color: "#0d0d06",
                weight: .3,
                opacity: 1,
                fillOpacity: 1
            };
            return L.circleMarker(latlng, attCircles);
        }
    });
    
    createMap(weekEarthquakes);
}

function createMap(weekEarthquakes) {
    var earthquakeMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });
 
    var myMap = L.map("map", {
        center: [15.523456, -52.785976],
        zoom: 2,
        layers: [earthquakeMap, weekEarthquakes]
    });

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function (myMap) {    
        var div = L.DomUtil.create("div", "info.legend"),
        limitsDepth = [-10, 10, 30, 50, 70, 90],
        labelDepth = ["-10 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90 +"]
        labels = [];
  
        div.innerHTML += 'Depth<br><hr>'
        //var legendInfo = "<h1>Depth</h1>" +
        //"<div class=\"labels\">" +
        //"<div class=\"min\">" + limits[0] + "</div>" +
       // "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        //"</div>";
    
        for (var i = 0; i < limitsDepth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorPicker(limitsDepth[i] + 1) + '">.  .</i> ' + limitsDepth[i] + (limitsDepth[i + 1] ? ' - ' + limitsDepth[i + 1] + '<br>' : '+');
        }
    
    return div;
        
    };
    
    legend.addTo(myMap);
}
