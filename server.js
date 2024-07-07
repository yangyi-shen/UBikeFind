const API_URL = 'https://api.kcg.gov.tw/api/service/Get/b4dd9c40-9027-4125-8666-06bef1756092';

async function getData() {
    const response = await fetch(API_URL)
        .then(response => response.json())
        .then(response => response.data.retVal);

    return response;
}

const responseData = await getData();
const relevantData = responseData.filter(station => (station.sna == 'YouBike2.0_財政部高雄國稅局' || station.sna == 'YouBike2.0_高雄師範大學(活動中心)'));

console.log(relevantData)

const stationList = document.getElementById('station-list');
for (const station of relevantData) {
    const listItem = document.createElement('li');
    listItem.className = 'station';
    listItem.innerHTML = `
        <h3 class="station-name">Name: ${station.sna}</h3>
        <p class="station-numbikes">Number of bikes: ${station.sbi_detail.yb2}</p>
    `;
    stationList.appendChild(listItem);
}