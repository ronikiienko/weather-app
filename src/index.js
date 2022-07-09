import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import storageChangedEmitter from 'storage-changed';
import {drawGraphs} from './graphDrawer';
import {renderAllWeather, renderCurrentTime, renderMyPosition} from './renderer';
import {
    averageFromTwoArrays,
    detectPosition,
    findCheckedRadioForName,
    getPositionByCity,
    setGraphSwitchesData,
    weather,
} from './utils';
import {
    canvasWidth,
    canvasWrapper,
    chooseCityInput,
    chooseDegreeUnitsRadios,
    citySuggestions,
    detectPositionButton,
    graphCheckboxes,
    graphDetailsBar,
    updateWeatherButton,
} from './variables';


dayjs.extend(utc);
dayjs.extend(timezone);

for (let chooseDegreeUnitsRadio of chooseDegreeUnitsRadios) {
    chooseDegreeUnitsRadio.addEventListener('change', () => {
        const units = findCheckedRadioForName(chooseDegreeUnitsRadios);
        localStorage.setItem('degreeUnits', units);
    });
}


let suggestedCitiesInfo = null;

chooseCityInput.addEventListener('input', async () => {
    citySuggestions.textContent = '';
    const suggestionsResponse = await getPositionByCity(chooseCityInput.value);
    if (!suggestionsResponse.results) return;
    suggestedCitiesInfo = suggestionsResponse.results;

    for (let suggestedCityInfo of suggestedCitiesInfo) {
        const div = document.createElement('div');
        const cityDiv = citySuggestions.appendChild(div);
        cityDiv.setAttribute('id', suggestedCityInfo.id);
        cityDiv.classList.add('citySuggestion');
        cityDiv.textContent = `${suggestedCityInfo.name}, ${suggestedCityInfo.country}. Administrative: ${suggestedCityInfo.admin1}`;
    }
    if (chooseCityInput.value === '') {
        citySuggestions.textContent = '';
    }
});

citySuggestions.addEventListener('click', (event) => {
    if (!event.target.classList.contains('citySuggestion')) return;
    const id = event.target.id;
    for (let i = 0; i < suggestedCitiesInfo.length; i++) {
        const city = suggestedCitiesInfo[i];
        if (city.id === Number(id)) {
            const position = {
                country: city.country,
                city: city.name,
                latitude: city.latitude,
                longitude: city.longitude,
                administrative: city.admin1,
                timeZone: city.timezone,
            };
            JSON.stringify(position);
            localStorage.setItem('position', position);


            break;
        }
    }
    citySuggestions.textContent = '';
    chooseCityInput.value = '';
});


detectPositionButton.addEventListener('click', () => {
    detectPosition();
});
updateWeatherButton.addEventListener('click', () => {
    renderAllWeather();
});


storageChangedEmitter(window.localStorage, {
    eventName: 'storageChanged',
});
window.addEventListener('storageChanged', async (event) => {
    if (event.detail.value) {
        if (event.detail.key === 'checkedGraphDataTypeCheckboxes') {
            drawGraphs();
        } else {
            renderAllWeather();
            renderCurrentTime();
            drawGraphs();

        }
    }
});


for (let graphCheckbox of graphCheckboxes) {
    graphCheckbox.addEventListener('change', () => {
        setGraphSwitchesData();
    });
}

function init() {
    if (localStorage.getItem('position')) {
        renderAllWeather();
        drawGraphs();

    }
    if (!localStorage.getItem('degreeUnits')) {
        const units = findCheckedRadioForName(chooseDegreeUnitsRadios);
        localStorage.setItem('degreeUnits', units);
    } else {
        const units = localStorage.getItem('degreeUnits');
        document.getElementById(units).checked = true;
    }
    for (let graphCheckbox of graphCheckboxes) {
        const checkedGraphCheckboxes = window.localStorage.getItem('checkedGraphDataTypeCheckboxes');
        if (checkedGraphCheckboxes.includes(graphCheckbox.id)) {
            graphCheckbox.checked = true;
        }
    }
}

init();

renderCurrentTime();
window.setInterval(function () {
    renderCurrentTime();
}, 1000);

// graphDetailsBar.style.display = 'none';
function handleCheckedGraphCheckboxesForDetails(checkboxId) {
    let data = null;
    let detailBar;
    let detailName;
    switch (checkboxId) {
        case 'graphDailyMaxTemperatureCheckbox':
            data = weather.daily.temperature_2m_max;
            detailBar = document.getElementById('graphDailyMaxDetails');
            detailName = 'Max';
            break;
        case 'graphDailyMinTemperatureCheckbox':
            data = weather.daily.temperature_2m_min;
            detailBar = document.getElementById('graphDailyMinDetails');
            detailName = 'Min';
            break;
        case 'graphHourlyTemperatureCheckbox':
            data = weather.hourly.temperature_2m;
            detailBar = document.getElementById('graphHourlyDetails');
            detailName = 'Hourly';
            break;
        case 'graphDailyAverageTemperatureCheckbox':
            const arr1 = weather.daily.temperature_2m_max;
            const arr2 = weather.daily.temperature_2m_min;
            data = averageFromTwoArrays(arr1, arr2);
            detailBar = document.getElementById('graphDailyAverageDetails');
            detailName = 'Average';
    }
    let graphDetailBarToFillInfo = {
        dataToFill: data,
        dataName: detailName,
        detailBarToFill: detailBar,

    };
    return graphDetailBarToFillInfo;
}

canvasWrapper.addEventListener('mousemove', (event) => {
    graphDetailsBar.style.display = 'block';
    console.log('a');
    if (!weather || event.offsetX < 10) {
        return;
    }

    const checkedGraphDataTypeCheckboxes = JSON.parse(localStorage.getItem('checkedGraphDataTypeCheckboxes'));
    let fillInfo;
    let mouseMoveOffsetRatio = event.offsetX / canvasWidth;
    for (let checkedGraphDataTypeCheckbox of checkedGraphDataTypeCheckboxes) {
        fillInfo = handleCheckedGraphCheckboxesForDetails(checkedGraphDataTypeCheckbox);
        let graphDataArrayLength = fillInfo.dataToFill.length;
        let arrayNumberFromRatio = Math.floor(graphDataArrayLength * mouseMoveOffsetRatio);
        let arrayDateNumberFromRatio = Math.floor(7 * mouseMoveOffsetRatio);
        fillInfo.detailBarToFill.textContent = `${fillInfo.dataName}:${fillInfo.dataToFill[arrayNumberFromRatio]}`;
        document.getElementById('graphDateDetails').textContent = weather.daily.time[arrayDateNumberFromRatio];


    }
    graphDetailsBar.style.top = `${event.offsetY}px`;
    graphDetailsBar.style.left = `${event.offsetX}px`;

});
// TODO finish pointer graph details, make open day details on click
canvasWrapper.addEventListener('mouseleave', () => {
    graphDetailsBar.style.display = 'none';
});

/*canvas.addEventListener('mousemove', (event) => {
    const checkedGraphDataTypeCheckboxes = JSON.parse(localStorage.getItem('checkedGraphDataTypeCheckboxes'));
    let graphData = null;
    for (let checkedGraphDataTypeCheckbox of checkedGraphDataTypeCheckboxes) {
        switch (checkedGraphDataTypeCheckbox) {
            case 'graphDailyMaxTemperatureCheckbox':
                graphData = weather[0].daily.temperature_2m_max;
            case 'graphDailyMinTemperatureCheckbox':
                graphData = weather[0].daily.temperature_2m_min;
            // case 'graphDailyAverageTemperatureCheckbox':
            case 'graphHourlyTemperatureCheckbox':
                graphData = weather[0].hourly.temperature_2m;
        }
        let graphDataArrayLength = graphData.length;
        let mouseMoveOffsetRatio = event.offsetX * 5 / canvasWidth;
        let arrayNumberFromRatio = Math.floor(graphDataArrayLength * mouseMoveOffsetRatio);
    }

});*/







