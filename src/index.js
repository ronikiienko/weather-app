import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import storageChangedEmitter from 'storage-changed';
import {drawGraphs} from './graphDrawer';
import {renderAllWeather, renderCurrentTime, renderMyPosition} from './renderer';
import {
    detectPosition,
    findCheckedRadioForName,
    getPositionByCity,
    getWeatherAndPosition,
    setGraphSwitchesData,
} from './utils';
import {
    canvas,
    canvasWidth,
    chooseCityInput,
    chooseDegreeUnitsRadios,
    citySuggestions,
    detectPositionButton,
    graphCheckboxes,
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
window.addEventListener('storageChanged', (event) => {
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
let weather;

(async function () {
    const data = await getWeatherAndPosition();
    weather = data[0];
}());
console.log(weather);
canvas.addEventListener('mousemove', (event) => {
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
        console.log(graphData[arrayNumberFromRatio]);
    }

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







