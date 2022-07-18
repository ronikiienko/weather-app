import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import storageChangedEmitter from 'storage-changed';
import {drawGraphs, isDrawing} from './graphDrawer';
import {renderAllWeather, renderCurrentTime, renderDayDetails} from './renderer';
import {
    detectPosition,
    getDayInfoStringForArrNum,
    getPositionByCity,
    handleCheckedGraphCheckboxesForDetails,
    handleOffsetFromCanvas,
    setGraphSwitchesData,
    setOrDeleteBackgroundWhite,
    setSelectionByDayNumber,
    setUnitSwitchesData,
    weather,
} from './utils';
import {
    canvas,
    canvasWidth,
    chooseCityInput,
    chooseDegreeUnitRadios,
    citySuggestions,
    detectPositionButton,
    drawGraphsButton,
    forecastDayDivs,
    graphCheckboxes,
    graphCheckboxesIds,
    graphDetailsBar,
    updateCanvasDimensions,
    weatherDisplay,
    weatherForecastDisplay,
} from './variables';


dayjs.extend(utc);
dayjs.extend(timezone);

for (let chooseDegreeUnitRadio of chooseDegreeUnitRadios) {
    chooseDegreeUnitRadio.addEventListener('change', () => {
        setUnitSwitchesData();
    });
}


let suggestedCitiesInfo = null;
chooseCityInput.addEventListener('click', () => {
    if (chooseCityInput.value === '') {
        detectPositionButton.classList.toggle('hidden');
    }
});
chooseCityInput.addEventListener('input', async () => {
    detectPositionButton.classList.remove('hidden');
    citySuggestions.classList.add('hidden');
    citySuggestions.textContent = '';
    if (chooseCityInput.value === '') {
        detectPositionButton.classList.add('hidden');
        citySuggestions.classList.add('hidden');
    }
    const suggestionsResponse = await getPositionByCity(chooseCityInput.value);
    if (!suggestionsResponse.results) {
        return;
    }
    citySuggestions.classList.remove('hidden');
    suggestedCitiesInfo = suggestionsResponse.results;

    for (let suggestedCityInfo of suggestedCitiesInfo) {
        const div = document.createElement('div');
        const cityDiv = citySuggestions.appendChild(div);
        cityDiv.setAttribute('id', suggestedCityInfo.id);
        cityDiv.classList.add('citySuggestion');
        cityDiv.textContent = `${suggestedCityInfo.name}, ${suggestedCityInfo.country}. ${suggestedCityInfo.admin1}`;
    }
    if (chooseCityInput.value === '') {
        citySuggestions.textContent = '';
    }
});

citySuggestions.addEventListener('click', (event) => {
    if (!event.target.classList.contains('citySuggestion')) return;
    detectPositionButton.classList.add('hidden');
    citySuggestions.classList.add('hidden');
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


storageChangedEmitter(window.localStorage, {
    eventName: 'storageChanged',
});
window.addEventListener('storageChanged', async (event) => {
    if (event.detail.value) {
        if (event.detail.key !== 'checkedGraphDataTypeCheckboxes') {
            renderAllWeather();
            renderCurrentTime();
            drawGraphs();
        }
    }
});
drawGraphsButton.addEventListener('click', () => {
    drawGraphs()
        .catch(() => {
            console.log('interval');
        });
});

for (let graphCheckbox of graphCheckboxes) {
    graphCheckbox.addEventListener('change', () => {
        setGraphSwitchesData();
        for (let graphDetailDiv of graphDetailsBar.children) {
            graphDetailDiv.textContent = '';
        }
    });
}

function init() {
    setOrDeleteBackgroundWhite(weatherForecastDisplay.querySelectorAll('.weatherForecastDayDiv')[0], 'set');
    if (!localStorage.getItem('position')) {
        detectPosition();
    }
    if (localStorage.getItem('position') === null) {
        weatherDisplay.style.display = 'none';
        console.log('position is null');
    } else {
        weatherDisplay.style.display = 'block';
    }
    setGraphSwitchesData();
    setUnitSwitchesData('init');
    if (localStorage.getItem('position')) {
        renderAllWeather();

        drawGraphs();
    }
    const checkedGraphCheckboxes = window.localStorage.getItem('checkedGraphDataTypeCheckboxes');
    for (let graphCheckbox of graphCheckboxes) {
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


canvas.addEventListener('mousemove', (event) => {

    const offsetFromCanvasX = event.offsetX;
    const arrNumbers = handleOffsetFromCanvas(offsetFromCanvasX);
    graphDetailsBar.style.display = 'block';
    if (!weather || event.offsetX < 10) {
        return;
    }

    let fillInfo;
    let arrayDateNumberFromRatio = arrNumbers.numberInDailyArr;
    let arrayHourNumberFromRatio = arrNumbers.numberInHourlyArr;
    document.getElementById('graphTimeDetails').textContent = weather.hourly.time[arrayHourNumberFromRatio].slice(11, 16);
    document.getElementById('graphDateDetails').textContent = getDayInfoStringForArrNum(weather, arrayDateNumberFromRatio, true);

    // I could use only checked checkboxes to write info but I use all graph checkboxes instead
    for (let checkedGraphDataTypeCheckbox of graphCheckboxesIds) {
        fillInfo = handleCheckedGraphCheckboxesForDetails(checkedGraphDataTypeCheckbox);
        let graphDataArrayLength = fillInfo.dataToFill.length;
        let arrayNumberFromRatio = handleOffsetFromCanvas(offsetFromCanvasX, graphDataArrayLength).numberInGivenArr;
        fillInfo.detailDivToFill.textContent = `${fillInfo.dataName}${fillInfo.dataToFill[arrayNumberFromRatio]}°`;
    }


    const graphDetailsBarWidth = graphDetailsBar.offsetWidth;
    if (offsetFromCanvasX >= canvasWidth - graphDetailsBarWidth * 4) {
        graphDetailsBar.style.top = `${event.pageY + 10}px`;
        graphDetailsBar.style.left = `${event.pageX - 10 - graphDetailsBarWidth}px`;
    } else {
        graphDetailsBar.style.top = `${event.pageY + 10}px`;
        graphDetailsBar.style.left = `${event.pageX + 10}px`;
    }


});

canvas.addEventListener('mouseleave', () => {
    graphDetailsBar.style.display = 'none';
});

canvas.addEventListener('click', (event) => {
    let arrNumbers = handleOffsetFromCanvas(event.offsetX);
    renderDayDetails(weather, arrNumbers.numberInDailyArr);
    setSelectionByDayNumber(forecastDayDivs, arrNumbers.numberInDailyArr);
});

let interval;
window.addEventListener('resize', () => {
    clearTimeout(interval);
    if (isDrawing) {
        clearTimeout();
    }
    interval = setTimeout(() => {
        updateCanvasDimensions();
        drawGraphs();

    }, 1000);

});


weatherForecastDisplay.addEventListener('click', (event) => {
    let target = event.target;
    console.log(target);

    function goNodeUp() {
        if (!target.classList.contains('weatherForecastDayDiv')) {
            target = target.parentElement;
            goNodeUp();
        } else {
            renderDayDetails(weather, target.id[8]);
            setSelectionByDayNumber(forecastDayDivs, target.id[8]);
        }
    }

    goNodeUp();
});










