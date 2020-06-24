var graymap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {	
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    //id: "mapbox.streets",
    id: "mapbox/streets-v11", 
    accessToken: API_KEY
})

var map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
  });

graymap.addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(link, function(data) {
    function styleInfo(feature) {
        return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "white",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
        };
    }

    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea822c";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "#dfee00";
            default:
                return "#98ee00";
        }
    }
    
    function getRadius (magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude *4;
    }

    console.log(data)
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + " <br>Location: " + feature.properties.place);
        }
    }).addTo(map);

    var legend = L.control({
        position: "bottomright"
    });


    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5];
        var labels = [],
        from, to;
    
        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
            labels.push(
                '<i style="background:' + getColor(from + 1) + '">[color]</i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);
});
