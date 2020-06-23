const DefaultBoundaryPoints = [new L.LatLng(24.4466667, -123.771694), new L.LatLng(49.384472, -66.949778)];
/** map attributes **/
let mymap = L.map('MapViewId').setView([43.5473, -96.7283], 13);
let latLngBoundary;

let Locations;
let markers = [];
let markerGroups = [];
let AllLocations;
let NNILocations;
let SDNLitBuildingLocations;
let overlays;
let selectedMarker;
let currentLayerID;
/** filter attributes layer **/
let filterLayer;
let filterCircle;

let filters = {
    locationType: new Array(),
    proximity: false
};


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFha2VzYmUiLCJhIjoiY2tiNnZpbWF1MDJrOTJzbnZqbTJ3eXlrcSJ9.NV7CRKISyOqH4x-yUClONg'
}).addTo(mymap);

var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

(async function populateMarkers() {
    locations = await window.fetchLocations;

    locations.forEach(location => {
        let locationMarker = L.marker([location.latitude, location.longitude]).on('click', markerOnClick);
        //locationMarker.setIcon(greenIcon);
        locationMarker.locationType = location.locationType;
        markers.push(locationMarker);
    });
    
    const NNIMarkers = markers.filter(marker => marker.locationType === 'NNI');
    const SDNLitBuildingMarkers = markers.filter(marker => marker.locationType === 'SDN Lit Bldgs').map(marker => marker.setIcon(greenIcon));

    AllLocations = L.layerGroup(markers).addTo(mymap);
    NNILocations = L.layerGroup(NNIMarkers).addTo(mymap);
    SDNLitBuildingLocations = L.layerGroup(SDNLitBuildingMarkers).addTo(mymap);

    let locationMarkerGroups = {
        "All": markers,
        "NNI": NNIMarkers,
        "SDN Lit Buildings": SDNLitBuildingMarkers
    };
    markerGroups = locationMarkerGroups;

    let overlayMaps = {
        "All": AllLocations,
        "NNI": NNILocations,
        "SDN Lit Buildings": SDNLitBuildingLocations
    };
    overlays = overlayMaps;

    L.control.layers(overlayMaps).addTo(mymap);

    const latLngs = locations.map(location => {
        let latLng = new L.LatLng(location.latitude, location.longitude);

        return latLng;
    });

    if (latLngs.length === 0) { latLngs.push(DefaultBoundaryPoints); }
    latLngBoundary = getBoundsFromPoints(latLngs);
    mymap.fitBounds(latLngBoundary);
})();


function getBoundsFromPoints(latLngs) {
    return latLngs.map(x => x.toBounds(1)).reduce((a, b) => a.extend(b));
}

$("#locationTypeFilter")

$("#locationTypeFilter").change(function () {
    removeLayers();
    clearFilterLayer();

    if (filters['locationType'])
        filters['locationType'] = [];

    let locationTypeFilterState = $("#locationTypeFilter option:selected");
    console.log("you rang?");
    locationTypeFilterState.each(function () {
        //overlays[$(this).val()].addTo(mymap);
        filters["locationType"].push($(this).val().toString());

    });

    if (locationTypeFilterState.length === 0) {
        filters["locationType"].push("All");
        console.log("pushed all onto loc type");
    }

    filter();
}).trigger("change");

function removeLayers() {
    if (overlays)
        mymap.removeLayer(overlays["All"]);
    if (overlays)
        mymap.removeLayer(overlays["NNI"]);
    if (overlays)
        mymap.removeLayer(overlays["SDN Lit Buildings"]);
    if (filterLayer)
        mymap.removeLayer(filterLayer);
    if (filterCircle)
        mymap.removeLayer(filterCircle);
}

function clearFilterLayer() {[]
    if (filterCircle)
        mymap.removeLayer(filterCircle);
}

function markerOnClick(e) {
    console.log(this);
    //let marker = L.marker([this.getLatLng().lat, this.getLatLng().lng,], { icon: yellowIcon }).on('click', markerOnClick);
    //marker.addTo(mymap);
    selectedMarker = this;

    document.getElementById("selectedCoordsPanel").innerText = "Lat: " + this.getLatLng().lat + " Lng: " + this.getLatLng().lng + " ";
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Filter";
    btn.onclick = function () { filterProximity(selectedMarker); };
    document.getElementById("selectedCoordsPanel").appendChild(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Reset";
    btn.onclick = function () { resetFilter(); };
    document.getElementById("selectedCoordsPanel").appendChild(btn);
}

function filterProximity() {
    filters['proximity'] = true;
    //TODO add to pub sub
    removeLayers();
    filter();
    redrawMapBounds();
}

function resetFilter() {
    filters['proximity'] = false;
    //TODO add to pub sub
    clearFilterLayer();
    filter();
    redrawMapBounds();
}

function redrawMapBounds() {
    if (filters['proximity']) {
        var bounds = L.latLngBounds(selectedMarker.getLatLng(), selectedMarker.getLatLng());
        mymap.fitBounds(bounds);
    }
    else {
        mymap.fitBounds(latLngBoundary);
    }
}

function filter() {   
    console.log(filters);
    let markersToFilter = new Array();

    if (filters['locationType']) {
        filters['locationType'].forEach(filter => {
            console.log(markerGroups[filter]);
            if (markerGroups[filter])
                markersToFilter = markersToFilter.concat(markerGroups[filter]);
        });
    }
    console.log("location type markers: {}", markersToFilter);

    if (filters['proximity']) {
        $("#perimeterFilter").val()
        filterCircle = L.circle(selectedMarker.getLatLng(), 50000, {
            opacity: 1,
            weight: 1,
            fillOpacity: 0.4
        }).addTo(mymap);

        markersToFilter = markersToFilter.filter(x => x.getLatLng().distanceTo(selectedMarker.getLatLng()) < 50000);
    }
    //console.log("proximity markers: {}", markersToFilter);

    filterLayer = L.layerGroup(markersToFilter).addTo(mymap);
    //var filteredLocations = L.geoJSON(markers, { filter: proximityFilter }).addTo(mymap);
}

mymap.on('baselayerchange', function (e) {
    currentLayerID = e.layer._leaflet_id;
});

//var RADIUS = 500000;
//var filterCircle = L.circle(L.latLng(40, -75), RADIUS, {
//    opacity: 1,
//    weight: 1,
//    fillOpacity: 0.4
//}).addTo(map);

/*** Location Class ***/
function Location(latlng) {
    this.latitude = latlng.lat;
    this.longitude = latlng.long;
};

Location.prototype.getLat = function() {
    return this.latitude;
}

Location.prototype.getLong = function () {
    return this.longitude;
}

/*** NNI Class ***/
function NNI(latlng) {
    Location.call(this, latlng);
}

/*** SDN Lit Building Class ***/
function SDNLitBuilding(latlng) {
    Location.call(this, latlng);
}