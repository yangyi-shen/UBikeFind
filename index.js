// CODE FOR API STUFF HERE
const apiURL = 'https://api.kcg.gov.tw/api/service/Get/b4dd9c40-9027-4125-8666-06bef1756092';
const wantedStations = [
    'YouBike2.0_高雄師範大學(活動中心)',
    'YouBike2.0_財政部高雄國稅局',
    'YouBike2.0_高雄市文化中心(廣州一街)',
    'YouBike2.0_高雄市文化中心(和平一路)'
]

async function getStations() {
    const response = await fetch(apiURL)
        .then(response => response.json())
        .then(response => response.data.retVal)
    // .then(response => response.filter(station => wantedStations.includes(station.sna)))

    const stationListRaw = response.map(station => station = {
        name: station.sna,
        coords: [station.lat, station.lng],
        yb2: parseInt(station.sbi_detail.yb2),
        eyb: parseInt(station.sbi_detail.eyb),
    })

    const stationListSorted = await findClosestStations(stationListRaw)
    const stationList = stationListSorted.slice(0, 5);

    console.log(stationList)

    return stationList
}

// SET UP AND CONFIGURE LEAFLET.JS FEATURES
const map = L.map('map').setView([22.61626, 120.30033], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// get station data
const stationList = await getStations();

// create markers for each station
for (const station of stationList) {
    // create custom icon
    var customIcon = L.icon({
        iconUrl: createIcon(station.yb2 + station.eyb),
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    // draw marker on station coords
    const marker = L.marker(station.coords, { icon: customIcon }).addTo(map);

    // style popup with easy-on-eyes colors, nice design etc.
}

// UTILS BELOW
async function findClosestStations(stationList) {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const coords = [position.coords.latitude, position.coords.longitude];

            // INTERJECT: fly to user location (I know this is messy but I don't want to make a second geolocation call!)
            map.flyTo(coords, 16, {
                animate: true,
                duration: 1.5
            });

            const mappedList = stationList.map((station) => {
                return [station, haversine(coords, station.coords)]
            })
            mappedList.sort((a, b) => a[1] - b[1])
            const sortedList = mappedList.map(stationData => stationData[0])

            resolve(sortedList)
        })
    });
}

function haversine(userCoords, locationCoords) {
    const R = 6371; // earth radius in km

    const [userLat, userLng] = userCoords.map(x => x * Math.PI / 180);
    const [locationLat, locationLng] = locationCoords.map(x => x * Math.PI / 180);

    const dlat = locationLat - userLat;
    const dlon = locationLng - userLng;

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(userLat) * Math.cos(locationLat) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in km
}

function createIcon(total) {
    var canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 67; // Adjusted height to maintain aspect ratio
    var ctx = canvas.getContext('2d');

    // fill color based on bike availability
    if (total < 5) {
        ctx.fillStyle = '#f87171'
    } else {
        ctx.fillStyle = '#a3e635'
    }

    // Draw the main body of the popup
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 0);
    ctx.lineTo(100, 42); // Adjusted height
    ctx.lineTo(58, 42); // Adjusted x-coordinate
    ctx.lineTo(50, 58); // Adjusted coordinates for the pointer
    ctx.lineTo(42, 42); // Adjusted x-coordinate
    ctx.lineTo(0, 42); // Adjusted height
    ctx.closePath();
    ctx.fill();

    // Draw a border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2; // Increased line width for better visibility
    ctx.stroke();

    // Add number
    ctx.scale(2.67, 1.67); // Adjusted scale factor
    ctx.translate(-11.5, 0); // Adjusted translation
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, 30, 15);

    // Convert to image URL
    return canvas.toDataURL();
}