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
        .then(response => response.filter(station => wantedStations.includes(station.sna)))

    const stationList = response.map(station => station = {
        name: station.sna,
        coords: [station.lat, station.lng],
        yb2: station.sbi_detail.yb2,
        eyb: station.sbi_detail.eyb
    })

    return stationList;
}