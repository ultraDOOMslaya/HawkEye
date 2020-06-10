const DefaultBoundaryPoints = [new L.LatLng(24.4466667, -123.771694), new L.LatLng(49.384472, -66.949778)];

let mymap = L.map('MapViewId').setView([43.5473, -96.7283], 13);

let markers = [];
let AllLocations;
let NNILocations;
let SDNLitBuildingLocations;
let overlays;
let selectedMarker;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ''
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
    const locations = await window.fetchLocations;

    

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
    const latLngBoundary = getBoundsFromPoints(latLngs);
    mymap.fitBounds(latLngBoundary);
})();


function getBoundsFromPoints(latLngs) {
    return latLngs.map(x => x.toBounds(1)).reduce((a, b) => a.extend(b));
}


$("#locationTypeFilter").change(function () {
    removeOverlays();

    $("#locationTypeFilter option:selected").each(function () {
        overlays[$(this).val()].addTo(mymap);
    });
});

function removeOverlays() {
    mymap.removeLayer(overlays["All"]);
    mymap.removeLayer(overlays["NNI"]);
    mymap.removeLayer(overlays["SDN Lit Buildings"]);
}

function markerOnClick(e) {
    console.log(this);
    let marker = L.marker([this.getLatLng().lat, this.getLatLng().lng,], { icon: yellowIcon }).on('click', markerOnClick);
    marker.addTo(mymap);
    selectedMarker = this;

    document.getElementById("selectedCoordsPanel").innerText = "Lat: " + this.getLatLng().lat + " Lng: " + this.getLatLng().lng + " ";
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Filter";
    btn.onclick = function () { filterProximity(); };
    document.getElementById("selectedCoordsPanel").appendChild(btn);
    
    
}

function filterProximity(e) {
    console.log(this);

    $("#perimeterFilter").val()
    let filterCircle = L.circle(selectedMarker.getLatLng(), 5000, {
        opacity: 1,
        weight: 1,
        fillOpacity: 0.4
    }).addTo(mymap);

    const filteredLocations = L.mapbox.featureLayer().setFilter(function showAirport(feature) {
        console.log(feature);
        return selectedMarker.getLatLng().distanceTo(L.latLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0])) < 5000;
    });
    console.log(filteredLocations);
}

//var RADIUS = 500000;
//var filterCircle = L.circle(L.latLng(40, -75), RADIUS, {
//    opacity: 1,
//    weight: 1,
//    fillOpacity: 0.4
//}).addTo(map);