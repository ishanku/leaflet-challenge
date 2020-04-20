// Creating map object
var QuakeMarkers=[]
var FaultLinesMarkers;


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
    console.log(response);    
    let FaultLinesData=response;

    buildLayers(EarthquakeData,FaultLinesData);
    });

  });

}


  function buildLayers(EarthquakeData, FaultLinesData) {
  // Loop through data
  for (var i = 0; i < EarthquakeData.features.length; i++) {

    // Set the data location property to a variable
    var location = EarthquakeData.features[i].geometry;
    var property = EarthquakeData.features[i].properties;
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
  function DrawFaultLines(feature, layer) {
    L.polyline(feature.geometry.coordinates);
}
// let FaultLinesMarkers = L.geoJSON(FaultLinesData,{  
//   style: function(feature){
//       return {
//           color:"orange",
//           fillColor: "white",
//           fillOpacity:0
//       }
//   },      
//   onEachFeature: function(feature,layer){
//       console.log(feature.coordinates);
//       layer.bindPopup("Plate Name: "+feature.properties.PlateName);
//   }
// });
let FaultLinesMarkers  = L.choropleth(FaultLinesData, {

  // Define what  property in the features to use
  valueProperty: "Name",

  // Set color scale
  scale: ["#ffffb2", "#b10026"],

  // Number of breaks in step range
  steps: 10,

  // q for quartile, e for equidistant, k for k-means
  mode: "q",
  style: {
    // Border color
    color: "#fff",
    weight: 1,
    fillOpacity: 0.8
  },

  // Binding a pop-up to each layer
  onEachFeature: function(feature, layer) {
    layer.bindPopup("Place: " + feature.properties.Name + "<br>Source:<br>" +
      "$" + feature.properties.Source);
  }
});
buildMap(QuakeMarkers,FaultLinesMarkers)

}

function buildMap(QuakeMarkers,FaultLinesMarkers){
var EarthQuakesLayer = L.layerGroup(QuakeMarkers)
var FaultLinesLayer = L.layerGroup(FaultLinesMarkers)

var  overlayMaps = {
  "EarthQuakes": EarthQuakesLayer, 
  "FaultLines": FaultLinesLayer
};
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
  layers: [light, EarthQuakesLayer]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: true
  }).addTo(myMap);

  // let legend = L.control({position: 'bottomright'});
  // legend.onAdd = function(map) {
  //   let div = L.DomUtil.create('div', 'info legend'),
  //     grades = [0, 1, 2, 3, 4, 5],
  //     labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

  //   for (let i = 0; i < grades.length; i++) {
  //     div.innerHTML += '<i style="background:' + colorchoice(grades[i] + 1) + '"></i> ' +
  //             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  //   }

  //   return div;
  // };
  // legend.addTo(map);

  }