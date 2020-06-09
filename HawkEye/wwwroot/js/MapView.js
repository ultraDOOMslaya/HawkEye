const DefaultBoundaryPoints = [new L.LatLng(24.4466667, -123.771694), new L.LatLng(49.384472, -66.949778)];

var mymap = L.map('MapViewId').setView([43.5473, -96.7283], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ''
}).addTo(mymap);

//L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{tileSize}/{x}/{y}?access_token={accessToken}', {
//    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//    minZoom: 1,
//    maxZoom: 18,
//    id: 'mapbox/streets-v11',
//    tileSize: 512,
//    zoomOffset: -1,
//    accessToken: 'pk.eyJ1IjoibWFha2VzYmUiLCJhIjoiY2tiNnZpbWF1MDJrOTJzbnZqbTJ3eXlrcSJ9.NV7CRKISyOqH4x-yUClONg'
//}).addTo(mymap);

//L.tileLayer('https://api.mapbox.com/styles/v1/examples/cjikt35x83t1z2rnxpdmjs7y7?access_token={accessToken}', {
//    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//    minZoom: 1,
//    maxZoom: 20,
//    id: 'mapbox/streets-v11',
//    tileSize: 512,
//    zoomOffset: -1,
//    accessToken: 'pk.eyJ1IjoibWFha2VzYmUiLCJhIjoiY2tiNnZpbWF1MDJrOTJzbnZqbTJ3eXlrcSJ9.NV7CRKISyOqH4x-yUClONg'
//}).addTo(mymap);

(async function populateMarkers() {
    const locations = await window.fetchLocations;
    locations.forEach(location => {
        L.marker([location.latitude, location.longitude]).addTo(mymap);
    });

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
