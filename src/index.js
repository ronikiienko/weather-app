import storageChangedEmitter from 'storage-changed';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
    detectPosition,
    findCheckedRadioForName,
    getPositionByCity,
    getWeatherByPosition,
    setGraphSwitchesData
} from "./utils";
import {
    chooseCityInput,
    chooseDegreeUnitsRadios,
    citySuggestions,
    detectPositionButton,
    graphCheckboxes,
    updateWeatherButton
} from "./variables";
import {init, renderCurrentTime, renderMyPosition, renderAllWeather} from "./renderer";

dayjs.extend(utc);
dayjs.extend(timezone);


for (let chooseDegreeUnitsRadio of chooseDegreeUnitsRadios) {
    chooseDegreeUnitsRadio.addEventListener('change', () => {
        const units = findCheckedRadioForName(chooseDegreeUnitsRadios);
        localStorage.setItem('degreeUnits', units)
    })
}


let suggestedCitiesInfo = null;

chooseCityInput.addEventListener('input', async () => {
    citySuggestions.textContent = '';
    const suggestionsResponse = await getPositionByCity(chooseCityInput.value);
    if (!suggestionsResponse.results) return
    suggestedCitiesInfo = suggestionsResponse.results;

    for (let suggestedCityInfo of suggestedCitiesInfo) {
        const div = document.createElement('div');
        const cityDiv = citySuggestions.appendChild(div);
        cityDiv.setAttribute('id', suggestedCityInfo.id);
        cityDiv.classList.add('citySuggestion');
        cityDiv.textContent = `${suggestedCityInfo.name}, ${suggestedCityInfo.country}. Administrative: ${suggestedCityInfo.admin1}`
    }
    if (chooseCityInput.value === '') {
        citySuggestions.textContent = '';
    }
})

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
                timeZone: city.timezone
            }
            JSON.stringify(position);
            localStorage.setItem('position', position);


            break;
        }
    }
    citySuggestions.textContent = '';
    chooseCityInput.value = '';
})


detectPositionButton.addEventListener('click', () => {
    detectPosition()
})
updateWeatherButton.addEventListener('click', () => {
    renderAllWeather()
})


storageChangedEmitter(window.localStorage, {
    eventName: 'storageChanged'
})
window.addEventListener('storageChanged', (event) => {
    if (event.detail.value) {
        renderMyPosition();
        renderAllWeather();
        renderCurrentTime();
    }

});


for (graphCheckbox of graphCheckboxes) {
    graphCheckbox.addEventListener('change', () => {
        setGraphSwitchesData();
    })
}

init();

renderCurrentTime();
window.setInterval(function () {
    renderCurrentTime()
}, 1000);


const position = JSON.parse(localStorage.getItem('position'));
getWeatherByPosition(position)
    .then((weather) => {
        canvas.addEventListener('mousemove', (event) => {
            let graphData = weather.daily.temperature_2m_max;
            let graphDataArrayLength = graphData.length;
            let mouseMoveOffsetRatio = event.offsetX * 5 / canvasWidth;
            let arrayNumberFromRatio = Math.floor(graphDataArrayLength * mouseMoveOffsetRatio);

        })
    })






