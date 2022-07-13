import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import storageChangedEmitter from 'storage-changed';
import {drawGraphs, isDrawing} from './graphDrawer';
import {closeDayDetails, openDayDetails, renderAllWeather, renderCurrentTime, renderMyPosition} from './renderer';
import {
    detectPosition,
    findCheckedRadioForName,
    getDayInfoStringForArrNum,
    getPositionByCity,
    handleCheckedGraphCheckboxesForDetails,
    setGraphSwitchesData,
    weather,
} from './utils';
import {
    canvas,
    canvasWidth,
    chooseCityInput,
    chooseDegreeUnitsRadios,
    citySuggestions,
    closeButton,
    detectPositionButton,
    drawGraphsButton,
    graphCheckboxes,
    graphDetailsBar,
    updateCanvasDimensions,
    updateWeatherButton,
    weatherForecastDisplay,
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

function handleOffsetFromCanvas(offsetX, arrayLength) {
    const offsetFromCanvasX = offsetX;

    let mouseMoveOffsetRatio = offsetFromCanvasX / canvasWidth;
    let data;
    if (arrayLength) {
        data = {
            numberInDailyArr: Math.floor(7 * mouseMoveOffsetRatio),
            numberInHourlyArr: Math.floor(168 * mouseMoveOffsetRatio),
            numberInGivenArr: Math.floor(arrayLength * mouseMoveOffsetRatio),
        };
    } else {
        data = {
            numberInDailyArr: Math.floor(7 * mouseMoveOffsetRatio),
            numberInHourlyArr: Math.floor(168 * mouseMoveOffsetRatio),
        };
    }

    return data;
}
canvas.addEventListener('mousemove', (event) => {

    const offsetFromCanvasX = event.offsetX;
    const arrNumbers = handleOffsetFromCanvas(offsetFromCanvasX);
    graphDetailsBar.style.display = 'block';
    if (!weather || event.offsetX < 10) {
        return;
    }

    const checkedGraphDataTypeCheckboxes = JSON.parse(localStorage.getItem('checkedGraphDataTypeCheckboxes'));
    let fillInfo;
    let mouseMoveOffsetRatio = offsetFromCanvasX / canvasWidth;
    let arrayDateNumberFromRatio = arrNumbers.numberInDailyArr;
    let arrayHourNumberFromRatio = arrNumbers.numberInHourlyArr;
    document.getElementById('graphTimeDetails').textContent = weather.hourly.time[arrayHourNumberFromRatio].slice(11, 16);
    document.getElementById('graphDateDetails').textContent = getDayInfoStringForArrNum(weather, arrayDateNumberFromRatio, true);

    for (let checkedGraphDataTypeCheckbox of checkedGraphDataTypeCheckboxes) {
        fillInfo = handleCheckedGraphCheckboxesForDetails(checkedGraphDataTypeCheckbox);
        let graphDataArrayLength = fillInfo.dataToFill.length;
        let arrayNumberFromRatio = handleOffsetFromCanvas(offsetFromCanvasX, graphDataArrayLength).numberInGivenArr;
        fillInfo.detailDivToFill.textContent = `${fillInfo.dataName}${fillInfo.dataToFill[arrayNumberFromRatio]}°`;
    }


    const graphDetailsBarWidth = graphDetailsBar.offsetWidth;
    const graphDetailsBarHeight = graphDetailsBar.offsetHeight;
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
    openDayDetails(weather, arrNumbers.numberInDailyArr);
});

let interval;
window.addEventListener('resize', () => {
    clearTimeout(interval);
    if (isDrawing) {
        clearTimeout();
    }
    interval = setTimeout(() => {
        console.log('interval hello)');
        updateCanvasDimensions();
        drawGraphs();

    }, 1000);

});


weatherForecastDisplay.addEventListener('click', (event) => {
    let target = event.target;

    function goNodeUp() {
        target = target.parentElement;
        if (!target.classList.contains('weatherForecastDayDiv')) {
            goNodeUp();
        } else {
            openDayDetails(weather, target.id[8]);
            console.log(target.id);
        }
    }

    goNodeUp();
});
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeDayDetails();
    }
});

closeButton.addEventListener('click', () => {
    closeDayDetails();
});










