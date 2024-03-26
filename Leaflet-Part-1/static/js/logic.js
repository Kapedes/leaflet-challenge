// Define the URL for the earthquake data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine marker size
function markerSize(magnitude) {
  return magnitude * 2;
}

// Function to determine marker color by depth
function chooseColor(depth) {
  if (depth < 10) return "yellow";
  else if (depth < 30) return "orange";
  else if (depth < 50) return "pink";
  else if (depth < 70) return "red";
  else if (depth < 90) return "purple";
  else return "blue";
}

// Create a map centered at a specific location and zoom level
const map = L.map('map').setView([34.9773 , 33.2552], 2.1);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the earthquake data from the URL
fetch(earthquakeUrl)
    .then(response => response.json())
    .then(data => {
        // Process the earthquake data and plot on the map using Leaflet
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // Determine the style of markers based on properties
                var markers = {
                    radius: markerSize(feature.properties.mag),
                    fillColor: chooseColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.7,
                    color: "black",
                    stroke: true,
                    weight: 0.5
                };
                return L.circleMarker(latlng, markers);
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
            }
        }).addTo(map);

        // Add legend
        var legend = L.control({position: "bottomright"});
        legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend"),
          depth = [-10, 10, 30, 50, 70, 90];

          div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

          for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
          }
          return div;
        }
        legend.addTo(map);
      })     
