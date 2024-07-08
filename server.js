// DECLARE GLOBAL CONSTANTS
const API_URL = 'https://api.kcg.gov.tw/api/service/Get/b4dd9c40-9027-4125-8666-06bef1756092';

// MAP-RELATED CODE
var map = L.map('map').setView([22.61626, 120.31333], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// pan map to user's location
map.locate({setView: true, maxZoom: 16});

// query kaohsiung government api
const allUbikeStations = await getData();

//

// sort ubike station array by distance of station relative to current location

// take top 3 stations from this list

// add markers for each ubike locations

// add popups to each marker with no. of ubikes

// UTIL FUNCTIONS
// get measure of difference between two coordinates
function haversine(latFirst, lonFirst, latSecond, lonSecond) {
    // Convert degrees to radians
    const toRadians = angle => angle * (Math.PI / 180);

    const dLat = toRadians(latSecond - latFirst);
    const dLon = toRadians(lonSecond - lonFirst);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(latFirst)) * Math.cos(toRadians(latSecond)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return distance;
}


// retrieve data from government
async function getData() {
    const response = await fetch(API_URL)
        .then(response => response.json())
        .then(response => response.data.retVal);

    return response;
}