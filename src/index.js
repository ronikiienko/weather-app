import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import storageChangedEmitter from 'storage-changed';
import {drawGraphs} from './graphDrawer';
import {renderAllWeather, renderCurrentTime, renderMyPosition} from './renderer';
import {
    detectPosition,
    findCheckedRadioForName,
    getDayInfoForDate,
    getPositionByCity,
    handleCheckedGraphCheckboxesForDetails,
    setGraphSwitchesData,
    weather,
} from './utils';
import {
    canvas,
    canvasHeight,
    canvasWidth,
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
        for (let graphDetailDiv of graphDetailsBar.childNodes) {
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


canvas.addEventListener('mousemove', (event) => {
    event.stopPropagation();
    graphDetailsBar.style.display = 'block';
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
        let arrayHourNumberFromRatio = Math.floor(168 * mouseMoveOffsetRatio);
        fillInfo.detailDivToFill.textContent = `${fillInfo.dataName}${fillInfo.dataToFill[arrayNumberFromRatio]}°`;
        document.getElementById('graphTimeDetails').textContent = weather.hourly.time[arrayHourNumberFromRatio].slice(11, 16);


        const graphDayInfo = getDayInfoForDate(weather.daily.time[arrayDateNumberFromRatio]);
        let graphDayInfoString;
        if (arrayDateNumberFromRatio === 0) {
            graphDayInfoString = 'Today';
        } else if (arrayDateNumberFromRatio === 1) {
            graphDayInfoString = 'Tomorrow';
        } else {
            graphDayInfoString = `${graphDayInfo.dayOfWeekShort}, ${graphDayInfo.monthShort} ${graphDayInfo.dayOfMonth}`;
        }
        document.getElementById('graphDateDetails').textContent = graphDayInfoString;

    }
    const graphDetailsBarWidth = graphDetailsBar.offsetWidth;
    const graphDetailsBarHeight = graphDetailsBar.offsetHeight;
    if (event.offsetX >= canvasWidth - graphDetailsBarWidth * 2) {
        if (event.offsetY >= canvasHeight - graphDetailsBarHeight) {
            graphDetailsBar.style.top = `${event.pageY - graphDetailsBarHeight}px`;
        } else {
            graphDetailsBar.style.top = `${event.pageY + 10}px`;
        }

        graphDetailsBar.style.left = `${event.pageX - 10 - graphDetailsBarWidth}px`;
    } else {
        if (event.offsetY >= canvasHeight - graphDetailsBarHeight / 2) {
            graphDetailsBar.style.top = `${event.pageY - graphDetailsBarHeight}px`;
        } else {
            graphDetailsBar.style.top = `${event.pageY + 10}px`;
        }
        graphDetailsBar.style.left = `${event.pageX + 10}px`;
    }


});
// TODO finish pointer graph details, make open day details on click
canvas.addEventListener('mouseleave', () => {
    graphDetailsBar.style.display = 'none';
});
/*async function delay(delay) {
    for (let i = 0; i < 100; i++) {
        await wait(delay);
        console.log('hello');
    }
}
delay(200)
    .catch(() => {
        console.log('error');
    })*/








