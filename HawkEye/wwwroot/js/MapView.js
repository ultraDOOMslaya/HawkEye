const DefaultBoundaryPoints = [new L.LatLng(24.4466667, -123.771694), new L.LatLng(49.384472, -66.949778)];
const FeetToMetersConversion = 3.2808;
const MilesToFeetConversion = 0.00018939;

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
let filterDistance;

let serviceAreaOptions = {
    "None": "None",
    "SDNServiceArea": "SDNServiceArea"
};

let distanceOptions = {
    "500 feet": { distance: 500, type:"feet" },
    "10 miles": { distance: 10, type:"miles" }
};

let filters = {
    locationType: new Array(),
    proximity: false
};

let geojsonSDNServiceAreaStyles = {
    fillColor: "#57d674",
    fillOpacity: 0.8
}

/** Experimental GeoJSON polygons **/
let SDNServiceAreaGeometry = {
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.8202, 41.1400],
            [-109.0565, 44.5263],
            [-110.7624, 43.4799],
            [-111.8910, 40.7608]
        ]]
    }
};
let SDNServiceAreaLayer = new L.layerGroup();
SDNServiceAreaLayer.addTo(mymap);
//SDNServiceAreaLayer.addLayer(L.geoJSON(SDNServiceAreaGeometry));

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

$("#locationTypeFilter").change(function () {
    removeLayers();
    clearFilterLayer();

    if (filters['locationType'])
        filters['locationType'] = [];

    let locationTypeFilterState = $("#locationTypeFilter option:selected");
    locationTypeFilterState.each(function () {
        filters["locationType"].push($(this).val().toString());

    });

    if (locationTypeFilterState.length === 0)
        filters["locationType"].push("All");

    filter();
}).trigger("change");

$("#perimeterFilter").change(function () {

    let perimeterFilterState = $("#perimeterFilter option:selected");
    perimeterFilterState.each(function () {
        let distanceOption = distanceOptions[$(this).val()];

        if (distanceOption.type == "miles")
            filterDistance = milesToMeters(distanceOption.distance);

        if (distanceOption.type == "feet")
            filterDistance = feetToMeters(distanceOption.distance);

        if (filters["proximity"]) {
            resetFilter();
            filterProximity();
        }
            
    });
}).trigger("change");

$("#ServiceAreaToggle").change(function () {

    let serviceAreaToggleState = $("#ServiceAreaToggle option:selected");
    serviceAreaToggleState.each(function () {
        if (serviceAreaOptions["None"] == $(this).val())
            mymap.removeLayer(SDNServiceAreaLayer);

        if (serviceAreaOptions["SDNServiceArea"] == $(this).val())
            SDNServiceAreaLayer.addTo(mymap);
//SDNServiceAreaLayer.addLayer(L.geoJSON(SDNServiceAreaGeometry));
        mymap.addLayer(SDNServiceAreaLayer.addLayer(L.geoJSON(SDNServiceAreaGeometry)));
    });
});

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

function clearFilterLayer() {
    if (filterCircle)
        mymap.removeLayer(filterCircle);
}

function markerOnClick(e) {
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
        let zoom = 13;
        mymap.setView(selectedMarker.getLatLng(), zoom);
    }
    else {
        mymap.fitBounds(latLngBoundary);
    }
}

function filter() {   
    let markersToFilter = new Array();

    if (filters['locationType']) {
        filters['locationType'].forEach(filter => {
            if (markerGroups[filter])
                markersToFilter = markersToFilter.concat(markerGroups[filter]);
        });
    }

    if (filters['proximity']) {
        $("#perimeterFilter").val()
        filterCircle = L.circle(selectedMarker.getLatLng(), filterDistance, {
            opacity: 1,
            weight: 1,
            fillOpacity: 0.4
        }).addTo(mymap);

        console.log(filterDistance);
        markersToFilter = markersToFilter.filter(x => x.getLatLng().distanceTo(selectedMarker.getLatLng()) < filterDistance);
    }

    filterLayer = L.layerGroup(markersToFilter).addTo(mymap);
}

mymap.on('baselayerchange', function (e) {
    currentLayerID = e.layer._leaflet_id;
});

/** Util functions **/
//var RADIUS = 500000;
//var filterCircle = L.circle(L.latLng(40, -75), RADIUS, {
//    opacity: 1,
//    weight: 1,
//    fillOpacity: 0.4
//}).addTo(map);

function milesToMeters(distanceInMiles) {
    let distanceInFeet = distanceInMiles / MilesToFeetConversion;
    return feetToMeters(distanceInFeet);
}

function feetToMeters(distanceInFeet) {
    return distanceInFeet / FeetToMetersConversion;
}

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