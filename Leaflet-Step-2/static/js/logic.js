// Creating map object
var QuakeMarkers=[]


// Adding tile layer to the map
var Street=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var baseMaps = {
  "Light": light,
  "Dark": dark,
  "Street" : Street
};



var quake_data_url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let faultLines_data_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

function markerSize(mag) {
  var rmag=mag*2;
  return rmag;
}
function colorchoice(mag){

  var color ="greenyellow";

  if (mag >5)
    color="red"
  else if (mag >4)
    color="orange"
  else if (mag>3)
    color ="gold"
  else if (mag>2)
    color="yellow"
  else if (mag>1)
    color="yellowgreen"
  else 
    color = color;

  return color;
}

renderAll(quake_data_url,faultLines_data_url);

function renderAll(quake_data_url,faultLines_data_url){
d3.json(quake_data_url, function(response) {

  let EarthquakeData=response;

  d3.json(faultLines_data_url, function(response) {
    
    let FaultLinesData=response;

    buildLayers(EarthquakeData,FaultLinesData);
    });

  });
}


  function buildLayers(EarthquakeData, FaultLinesData) {
  // Loop through data
  for (var i = 0; i < response.features.length; i++) {

    // Set the data location property to a variable
    var location = response.features[i].geometry;
    var property = response.features[i].properties;
    // Check for location property
    if (location) {
     
      QuakeMarkers.push(

     L.circleMarker([location.coordinates[1],location.coordinates[0]], {
      opacity: 0.73,
      fillOpacity: 0.91,
      color: "black",
      fillColor: colorchoice(property.mag),
      weight: 1,
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: markerSize(property.mag)
    }).bindPopup("<h3>" + property.place + "</h3><hr><p>" + new Date(property.time) + "</p><hr><p>Magnitude: " + property.mag + "</p>"));
  }

  }

  var EarthQuakesLayer = L.layerGroup(QuakeMarkers)
  var  overlayMaps = {
          "EarthQuakes": EarthQuakesLayer };
  

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [light, EarthQuakesLayer]
  });

  L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
  }).addTo(myMap);


}