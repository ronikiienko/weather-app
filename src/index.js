import storageChangedEmitter from 'storage-changed';
import weatherIcons from './images/pack1svg/*.svg';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


const citySuggestions = document.getElementById('citySuggestions');
const chooseCityInput = document.getElementById('searchCity');
const detectPositionButton = document.getElementById('detectPositionButton');
const myPositionDisplay = document.getElementById('myPositionDisplay');


const currentWeatherPictureDiv = document.getElementById('currentWeatherPictureDiv');
const currentWeatherDescriptionDiv = document.getElementById('currentWeatherDescriptionDiv');
const currentWeatherDisplay = document.getElementById('currentWeatherDisplay');
const currentTemperatureDisplayDiv = document.getElementById('currentTemperatureDisplayDiv');
const currentWindSpeedDiv = document.getElementById('currentWindSpeedDiv');
const currentSunriseTimeDiv = document.getElementById('currentSunriseTimeDiv');
const currentSunsetTimeDiv = document.getElementById('currentSunsetTimeDiv');
const currentTime = document.getElementById('currentTime');
const currentDate = document.getElementById('currentDate');

let graphCheckboxes = document.querySelectorAll('input[name=graphDataTypeCheckbox]');


const weatherForecastDayDiv = document.querySelectorAll('weatherForecastDayDiv');


const updateWeatherButton = document.getElementById('updateWeatherButton');
const chooseDegreeUnitsRadios = document.querySelectorAll("input[name='chooseDegreeUnits']");
const weatherForecastDisplay = document.getElementById('weatherForecastDisplay');
if (1 === 1) {
    const h = 1 + 1;
}

function findCheckedRadioForName(name) {
    const inputs = name;
    for (let input of inputs) {
        if (input.checked) {
            return input.id;
        }

    }
}

function setGraphSwitchesData() {
    const checkedGraphCheckboxes = document.querySelectorAll('input[name=graphDataTypeCheckbox]:checked');
    let checkedGraphChekboxesIds = [];
    for (checkedGraphCheckbox of checkedGraphCheckboxes) {
        checkedGraphChekboxesIds.push(checkedGraphCheckbox.id);
    }
    const checkedGraphCheckboxesIdsStringified = JSON.stringify(checkedGraphChekboxesIds);
    window.localStorage.setItem('checkedGraphDataTypeCheckboxes', checkedGraphCheckboxesIdsStringified);

}

for (let chooseDegreeUnitsRadio of chooseDegreeUnitsRadios) {
    chooseDegreeUnitsRadio.addEventListener('change', () => {
        const units = findCheckedRadioForName(chooseDegreeUnitsRadios);
        localStorage.setItem('degreeUnits', units)
    })
}




function renderMyPosition() {
    const position = JSON.parse(localStorage.getItem('position'));
    myPositionDisplay.textContent = `My position is: ${position.city}, ${position.country}, ${position.administrative}`
}

function handleWeathercode(weathercode, timeOfTheDay) {
    let weathercodeTextMessage;
    let weathercodeImage;
    switch (weathercode) {
        case 0:
            weathercodeTextMessage = 'Clear sky';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Clear-Night'];
            } else {
                weathercodeImage = weatherIcons['Mostly-Sunny'];
            }
            break;
        case 1:
            weathercodeTextMessage = 'Mainly clear';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Partly-Cloudy-Night'];
            } else {
                weathercodeImage = weatherIcons['Partly-Cloudy'];
            }
            break;
        case 2:
            weathercodeTextMessage = 'Partly cloudy';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Partly-Cloudy-Night'];
            } else {
                weathercodeImage = weatherIcons['Partly-Cloudy'];
            }
            break;
        case 3:
            weathercodeTextMessage = 'Overcast';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Mostly-Cloudy-Night'];
            } else {
                weathercodeImage = weatherIcons['Mostly-Cloudy'];
            }
            break;
        case 45:
            weathercodeTextMessage = 'Fog';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Fog-Night'];
            } else {
                weathercodeImage = weatherIcons['Fog']
            }
            break;
        case 48:
            weathercodeTextMessage = 'Depositing rime fog';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Fog-Night'];
            } else {
                weathercodeImage = weatherIcons['Fog'];
            }
            break;
        case 51:
            weathercodeTextMessage = 'Light drizzle';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Drizzle-Night'];
            } else {
                weathercodeImage = weatherIcons['Drizzle'];
            }
            break;
        case 53:
            weathercodeTextMessage = 'Moderate drizzle';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Drizzle-Night'];
            } else {
                weathercodeImage = weatherIcons['Drizzle'];
            }
            break;
        case 55:
            weathercodeTextMessage = 'Dense drizzle';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Drizzle-Night'];
            } else {
                weathercodeImage = weatherIcons['Drizzle'];
            }
            break;
        case 56:
            weathercodeTextMessage = 'Light freezing drizzle';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Drizzle-Night'];
            } else {
                weathercodeImage = weatherIcons['Drizzle'];
            }
            break;
        case 57:
            weathercodeTextMessage = 'Dense freezing drizzle';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Drizzle-Night'];
            } else {
                weathercodeImage = weatherIcons['Drizzle'];
            }
            break;
        case 61:
            weathercodeTextMessage = 'Slight rain';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Rain-Night']
            } else {
                weathercodeImage = weatherIcons['Rain']
            }
            break;
        case 63:
            weathercodeTextMessage = 'Moderate rain';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Rain-Night']
            } else {
                weathercodeImage = weatherIcons['Rain']
            }
            break;
        case 65:
            weathercodeTextMessage = 'Heavy rain';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Heavy-Rain-Night'];
            } else {
                weathercodeImage = weatherIcons['Heavy-Rain'];
            }
            break;
        case 66:
            weathercodeTextMessage = 'Light freezing rain';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Sleet-Night'];
            } else {
                weathercodeImage = weatherIcons['Sleet'];
            }
            break;
        case 67:
            weathercodeTextMessage = 'Heavy freezing rain';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Sleet-Night'];
            } else {
                weathercodeImage = weatherIcons['Sleet'];
            }
            break;
        case 71:
            weathercodeTextMessage = 'Slight snow fall';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Snow-Night'];
            } else {
                weathercodeImage = weatherIcons['Snow'];
            }
            break;
        case 73:
            weathercodeTextMessage = 'Moderate snow fall';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Snow-Night'];
            } else {
                weathercodeImage = weatherIcons['Snow'];
            }
            break;
        case 75:
            weathercodeTextMessage = 'Heavy snow fall';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Blizzard-Night'];
            } else {
                weathercodeImage = weatherIcons['Blizzard'];
            }
            break;
        case 77:
            weathercodeTextMessage = 'Snow grains';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Snow-Night'];
            } else {
                weathercodeImage = weatherIcons['Snow'];
            }
            break;
        case 80:
            weathercodeTextMessage = 'Slight rain showers';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Scattered-Showers-Night']
            } else {
                weathercodeImage = weatherIcons['Scattered-Showers']
            }
            break;
        case 81:
            weathercodeTextMessage = 'Moderate rain showers';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Scattered-Showers-Night']
            } else {
                weathercodeImage = weatherIcons['Scattered-Showers']
            }
            break;
        case 82:
            weathercodeTextMessage = 'Violent rain showers';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Scattered-Showers-Night']
            } else {
                weathercodeImage = weatherIcons['Scattered-Showers']
            }
            break;
        case 85:
            weathercodeTextMessage = 'Slight snow showers';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Snow-Night'];
            } else {
                weathercodeImage = weatherIcons['Snow'];
            }
            break;
        case 86:
            weathercodeTextMessage = 'Heavy snow showers';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Blizzard-Night'];
            } else {
                weathercodeImage = weatherIcons['Blizzard'];
            }
            break;
        case 95:
            weathercodeTextMessage = 'Thunderstorm';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Scattered-Thunderstorm-Night'];
            } else {
                weathercodeImage = weatherIcons['Scattered-Thunderstorm'];
            }
            break;
        case 96:
            weathercodeTextMessage = 'Thunderstorm with slight hail';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Severe-Thunderstorm-Night'];
            } else {
                weathercodeImage = weatherIcons['Severe-Thunderstorm'];
            }
            break;
        case 99:
            weathercodeTextMessage = 'Thunderstorm with heavy hail';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Severe-Thunderstorm-Night'];
            } else {
                weathercodeImage = weatherIcons['Severe-Thunderstorm'];
            }
            break;
    }
    const weathercodeResult = {
        message: weathercodeTextMessage,
        image: weathercodeImage
    }
    return weathercodeResult;
}

function handleWindspeed(windspeed) {
    let windName;
    let windDescription;

    if (windspeed < 0.5) {
        windName = 'Calm';
        windDescription = 'Smoke drifts with air, weather vanes inactive';
    } else if (windspeed >= 0.5 && windspeed < 1.5) {
        windName = 'Light  air';
        windDescription = 'Weather vanes active, wind felt on face, leaves rustle';
    } else if (windspeed >= 1.5 && windspeed < 3) {
        windName = 'Light breeze';
        windDescription = 'Weather vanes active, wind felt on face, leaves rustle';
    } else if (windspeed >= 3 && windspeed < 5) {
        windName = 'Gentle breeze';
        windDescription = 'Leaves & small twigs move, light flags extend';
    } else if (windspeed >= 5 && windspeed < 8) {
        windName = 'Moderate breeze';
        windDescription = 'Small branches sway, dust & loose paper blows about';
    } else if (windspeed >= 8 && windspeed < 10.5) {
        windName = 'Fresh breeze';
        windDescription = 'Small trees sway, waves break on inland waters';
    } else if (windspeed >= 10.5 && windspeed < 13.5) {
        windName = 'Strong breeze';
        windDescription = 'Large branches sway, umbrellas difficult to use';
    } else if (windspeed >= 13.5 && windspeed < 16.5) {
        windName = 'Moderate gale';
        windDescription = 'Whole trees sway, difficult to walk against wind';
    } else if (windspeed >= 16.5 && windspeed < 20) {
        windName = 'Fresh gale';
        windDescription = 'Twigs broken off trees, walking against wind very difficult';
    } else if (windspeed >= 20 && windspeed < 23.5) {
        windName = 'Strong gale'
        windDescription = 'Slight damage to buildings, shingles blown off roof';
    } else if (windspeed >= 23.5 && windspeed < 27.5) {
        windName = 'Whole gale';
        windDescription = 'Trees uprooted, considerable damage to buildings';
    } else if (windspeed >= 27.5 && windspeed < 31.5) {
        windName = 'Storm';
        windDescription = 'Widespread damage, very rare occurrence';
    } else if (windspeed >= 31.5) {
        windName = 'Hurricane';
        windDescription = 'Violent destruction';
    }
    let windspeedInfo = {
        windspeedName: windName,
        windspeedDescription: windDescription
    };
    return windspeedInfo;
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
    renderWeather()
})


storageChangedEmitter(window.localStorage, {
    eventName: 'storageChanged'
})
window.addEventListener('storageChanged', (event) => {
    if (event.detail.value) {
        renderMyPosition();
        renderWeather();
        renderCurrentTime();
    }

});
for (graphCheckbox of graphCheckboxes) {
    graphCheckbox.addEventListener('change', () => {
        setGraphSwitchesData();
    })
}


function init() {
    if (localStorage.getItem('position')) {
        renderMyPosition();
        renderWeather();
    }
    if (!localStorage.getItem('degreeUnits')) {
        const units = findCheckedRadioForName(chooseDegreeUnitsRadios);
        localStorage.setItem('degreeUnits', units);
    } else {
        const units = localStorage.getItem('degreeUnits')
        document.getElementById(units).checked = true;
    }
    for (graphCheckbox of graphCheckboxes) {
        const checkedGraphCheckboxes = window.localStorage.getItem('checkedGraphDataTypeCheckboxes');
        if (checkedGraphCheckboxes.includes(graphCheckbox.id)) {
            graphCheckbox.checked = true;
        }
    }
}

init();


renderCurrentTime();
window.setInterval(function () {
    renderCurrentTime()
}, 1000);


const canvas = document.getElementById('weatherGraph');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width = document.body.clientWidth * 5;
const canvasHeight = canvas.height = 400 * 5;

function drawGraphs(position, weather) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    const checkedGraphCheckboxesIds = JSON.parse(localStorage.getItem('checkedGraphDataTypeCheckboxes'));
    for (checkedGraphCheckboxId of checkedGraphCheckboxesIds) {
        drawGraphByDataType(checkedGraphCheckboxId);

    }

    function drawGraphByDataType(checkedGraphDataTypeCheckbox) {
        let dataToDrawInfo = null;

        if (checkedGraphDataTypeCheckbox === 'graphDailyMaxTemperatureCheckbox') {
            dataToDrawInfo = {
                data: weather.daily.temperature_2m_max,
                color: 'red',
                // minMax: [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min]
            };
        } else if (checkedGraphDataTypeCheckbox === 'graphDailyMinTemperatureCheckbox') {
            dataToDrawInfo = {
                data: weather.daily.temperature_2m_min,
                color: 'blue',
                // minMax: [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min]
            }
        } else if (checkedGraphDataTypeCheckbox === 'graphDailyAverageTemperatureCheckbox') {
            const arr1 = weather.daily.temperature_2m_min;
            const arr2 = weather.daily.temperature_2m_max;
            let arrData = arr1.map((e, index) => (e + arr2[index]) / 2);
            dataToDrawInfo = {
                data: arrData,
                color: 'yellow',
                // minMax: [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min]
            }
        } else if (checkedGraphDataTypeCheckbox === 'graphHourlyTemperatureCheckbox') {
            dataToDrawInfo = {
                data: weather.hourly.temperature_2m,
                color: 'green',
                // minMax: [weather.hourly.temperature_2m, weather.hourly.temperature_2m]
            }
        }
        const minMax = [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min];
        const maxValue = Math.max(...minMax[0]);
        const minValue = Math.min(...minMax[1]);

        const amplitude = maxValue - minValue;
        const numberOfPoints = dataToDrawInfo.data.length;

        ctx.beginPath();




        for (let i = 0; i <= numberOfPoints; i++) {
            let previousYRatio = (dataToDrawInfo.data[i - 1] - minValue) / amplitude;
            let yRatio = (dataToDrawInfo.data[i] - minValue) / amplitude;
            if (i === 0) {
                ctx.moveTo(0, canvasHeight - canvasHeight * yRatio);
            } else {
                if (checkedGraphDataTypeCheckbox === 'graphHourlyTemperatureCheckbox') {
                    ctx.lineTo(canvasWidth / (numberOfPoints - 1) * i, canvasHeight - canvasHeight * yRatio);
                } else {
                    ctx.lineTo(canvasWidth / (numberOfPoints) * i, canvasHeight - canvasHeight * previousYRatio);
                    ctx.lineTo(canvasWidth / (numberOfPoints) * i, canvasHeight - canvasHeight * yRatio);
                }

            }
        }

        ctx.moveTo(0, 0)
        ctx.lineWidth = 15;

        ctx.closePath();

        ctx.strokeStyle = dataToDrawInfo.color;

        ctx.stroke();


    }


}

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






