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


function updateGeolocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position)
        })
    });
}


const getLocationDataByPosition = (position) => {
    return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.latitude}&longitude=${position.longitude}`)
        .then(resp => resp.json());
}

function getPositionByCity(city) {
    return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
        .then(resp => resp.json());
}

function getWeatherByPosition(position) {
    let tempUnit;
    if (localStorage.getItem('degreeUnits') === 'farenheits') {
        tempUnit = 'temperature_unit=fahrenheit'
    }
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${position.latitude}&longitude=${position.longitude}&hourly=weathercode,temperature_2m,windspeed_10m&daily=sunrise,sunset,weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&windspeed_10&timezone=${position.timeZone}&${tempUnit}&windspeed_unit=ms`)
        .then(resp => resp.json());
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


function getCurrentTimeOfDay(timeZone) {
    const currentHour = dayjs.tz(dayjs(), timeZone).$H;
    if (currentHour < 7 && currentHour >= 0 || currentHour === 23) {
        return 'night'
    } else {
        return 'day'
    }
}

function getDayInfoForDate(date) {
    let dayInfo;
    dayInfo = {
        month: dayjs(date).format('MMMM'),
        dayOfMonth: dayjs(date).format('D'),
        dayOfWeek: dayjs(date).format('dddd'),

    }
    return dayInfo;
}


function renderCurrentTime() {
    let position = JSON.parse(window.localStorage.getItem('position'));
    let timeZone = position.timeZone

    currentDate.textContent = dayjs.tz(dayjs(), timeZone).format('MMMM D');
    currentTime.textContent = dayjs.tz(dayjs(), timeZone).format('HH:mm:ss');
}


function renderCurrentWeather(weather, position) {
    /*console.log(position.timeZone)
    console.log(dayjs().tz(position.timeZone))*/
    const currentWeather = weather.current_weather;
    currentWeatherPictureDiv.textContent = '';
    // currentWeatherPictureDivDiv.removeChild()
    const currentWeathercode = Number(currentWeather.weathercode);
    const image = document.createElement('img');


    currentTemperatureDisplayDiv.textContent = `${currentWeather.temperature}°`;
    currentWeatherDescriptionDiv.textContent = `Sky: ${handleWeathercode(currentWeathercode, 'night').message}`
    currentSunriseTimeDiv.textContent = `${weather.daily.sunrise[0].slice(11, 16)}`
    currentSunsetTimeDiv.textContent = `${weather.daily.sunset[0].slice(11, 16)}`
    // console.log(handleWindspeed(currentWeather.windspeed).windspeedName)
    currentWindSpeedDiv.textContent = `Wind: ${handleWindspeed(currentWeather.windspeed).windspeedName}`;
    currentWindSpeedDiv.title = `${handleWindspeed(currentWeather.windspeed).windspeedDescription}`;
    const currentWeatherPicture = currentWeatherPictureDiv.appendChild(image);
    currentWeatherPicture.src = handleWeathercode(currentWeathercode, getCurrentTimeOfDay(position.timeZone)).image;

}


function renderForecast(weather, position) {
    // console.log(weather)
    for (let forecastPic of document.querySelectorAll('.forecastHourPictureDiv')) {
        forecastPic.textContent = '';
    }
    for (let I = 0; I < 7; I++) {
        const forecastDayInfo = getDayInfoForDate(weather.daily.time[I]);
        let date;
        if (I === 0) {
            date = 'Today'
        } else if (I === 1) {
            date = 'Tomorrow'
        } else {
            date = weather.daily.time[I]
        }


        const weatherForecastDay = document.getElementById(`forecast${I}`);

        const forecastDayGeneralTemperatureDiv = weatherForecastDay.querySelector('.forecastDayGeneralTemperatureDiv');
        const forecastDayGeneralDateDiv = weatherForecastDay.querySelector('.forecastDayGeneralDateDiv');
        const forecastDayGeneralSunriseTimeDiv = weatherForecastDay.querySelector('.forecastDayGeneralSunriseTimeDiv');
        const forecastDayGeneralSunsetTimeDiv = weatherForecastDay.querySelector('.forecastDayGeneralSunsetTimeDiv');


        forecastDayGeneralTemperatureDiv.textContent = `${weather.daily.temperature_2m_min[I]}° / ${weather.daily.temperature_2m_max[I]}°`;
        let forecastDayInfoString;
        if (I === 0) {
            forecastDayInfoString = 'Today'
        } else if (I === 1) {
            forecastDayInfoString = 'Tomorrow'
        } else {
            forecastDayInfoString = `${forecastDayInfo.dayOfWeek}, ${forecastDayInfo.month} ${forecastDayInfo.dayOfMonth}`
        }
        forecastDayGeneralDateDiv.textContent = forecastDayInfoString;
        forecastDayGeneralSunriseTimeDiv.textContent = `${weather.daily.sunrise[I].slice(11, 16)}`
        forecastDayGeneralSunsetTimeDiv.textContent = `${weather.daily.sunset[I].slice(11, 16)}`


        for (let i = 0; i < 4; i++) {
            const weatherForecastHour = weatherForecastDay.getElementsByClassName(`weatherForecastHourDiv`)[i];

            const forecastHourWindDescriptionDiv = weatherForecastHour.querySelector('.forecastHourWindDescriptionDiv');
            const forecastHourPictureDiv = weatherForecastHour.querySelector('.forecastHourPictureDiv');
            const forecastHourTemperatureDiv = weatherForecastHour.querySelector('.forecastHourTemperatureDiv');
            const forecastHourTimeDiv = weatherForecastHour.querySelector('.forecastHourTimeDiv');
            const forecastHourSkyDescriptionDiv = weatherForecastHour.querySelector('.forecastHourSkyDescriptionDiv');

            // console.log(forecastHourTimeDiv)

            function timeOfDayByI(i) {
                let timeOfDay;
                if (i === 0 || i === 3) {
                    timeOfDay = 'night';
                } else {
                    timeOfDay = 'day';
                }
                return timeOfDay;
            }

            function getTimeByI(i) {
                let time;
                if (i === 0) {
                    time = '4:00'
                } else if (i === 1) {
                    time = '10:00'
                } else if (i === 2) {
                    time = '16:00'
                } else if (i === 3) {
                    time = '23:00'
                }
                return time;
            }

            function getHourDataTypeByI(i, dataType) {
                let temperature;
                let numberInTemperatureArray;
                if (i === 0) {
                    numberInTemperatureArray = 4 + I * 24;
                } else if (i === 1) {
                    numberInTemperatureArray = 10 + I * 24;
                } else if (i === 2) {
                    numberInTemperatureArray = 16 + I * 24;
                } else if (i === 3) {
                    numberInTemperatureArray = 23 + I * 24;
                }
                temperature = weather.hourly[dataType][numberInTemperatureArray];
                return temperature;

            }

            forecastHourTimeDiv.textContent = getTimeByI(i);
            forecastHourTemperatureDiv.textContent = `Temperature: ${getHourDataTypeByI(i, 'temperature_2m')}°`;
            // forecastHourDescriptionDiv.textContent = ``
            const image = document.createElement('img');
            const forecastHourPicture = forecastHourPictureDiv.appendChild(image);
            forecastHourPicture.src = handleWeathercode(getHourDataTypeByI(i, 'weathercode'), timeOfDayByI(i)).image;
            forecastHourSkyDescriptionDiv.textContent = `${handleWeathercode(getHourDataTypeByI(i, 'weathercode')).message}`;

            forecastHourWindDescriptionDiv.textContent = `${handleWindspeed(getHourDataTypeByI(i, 'windspeed_10m')).windspeedName}`;
        }

    }
}


function renderWeather() {
    const position = JSON.parse(localStorage.getItem('position'));
    getWeatherByPosition(position)
        .then((weather) => {
            drawGraphs(position, weather)
            renderCurrentWeather(weather, position);
            renderForecast(weather, position);
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

function detectPosition() {
    updateGeolocation()
        .then((response) => {

            getLocationDataByPosition(response)
                .then((response) => {
                    const position = {
                        country: response.countryName,
                        city: response.city,
                        latitude: response.latitude,
                        longitude: response.longitude,
                        administrative: response.principalSubdivision,
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone

                    }
                    JSON.stringify(position);
                    localStorage.setItem('position', position)

                })
        })
}

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

const canvasWidth = canvas.width = document.body.clientWidth;
const canvasHeight = canvas.height = 400;

function drawGraphs(position, weather) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    const checkedGraphCheckboxesIds = JSON.parse(localStorage.getItem('checkedGraphDataTypeCheckboxes'));
    for (checkedGraphCheckboxId of checkedGraphCheckboxesIds) {
        drawGraphByDataType(checkedGraphCheckboxId);

    }

    function drawGraphByDataType(checkedGraphDataTypeCheckbox) {
        let dataToDrawInfo = null;
        const minMax = [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min];
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

        const maxValue = Math.max(...minMax[0]);
        const minValue = Math.min(...minMax[1]);

        const amplitude = maxValue - minValue;
        const numberOfPoints = dataToDrawInfo.data.length;

        ctx.beginPath();
        /*let i = 0;
        let interval = setInterval(() => {
            console.log(i)
            let yRatio;
            yRatio = (dataToDrawInfo.data[i] - minValue) / amplitude;


            if (i === 0) {
                ctx.moveTo(canvasWidth / numberOfPoints * i, canvasHeight - canvasHeight * yRatio);
            } else {

                ctx.lineTo(canvasWidth / (numberOfPoints - 1) * i, canvasHeight - canvasHeight * yRatio);
            }

            i++;
            if(i === numberOfPoints) {
                clearInterval(interval);
            }
        }, 10);*/

        for (let i = 0; i < numberOfPoints; i++) {
            let yRatio;
            yRatio = (dataToDrawInfo.data[i] - minValue) / amplitude;


            if (i === 0) {
                ctx.moveTo(canvasWidth / (numberOfPoints - 1) * i, canvasHeight - canvasHeight * yRatio);
            } else {
                ctx.lineTo(canvasWidth / (numberOfPoints - 1) * i, canvasHeight - canvasHeight * yRatio);
            }
        }
        ctx.moveTo(0, 0)
        ctx.lineWidth = 3;

        ctx.closePath();

        ctx.strokeStyle = dataToDrawInfo.color;

        ctx.stroke();
    }


}
const position = JSON.parse(localStorage.getItem('position'));
getWeatherByPosition(position)
    .then((weather) => {
        canvas.addEventListener('mousemove', (event) => {
            let graphData = weather.hourly.temperature_2m;
            let graphDataArrayLength = graphData.length - 1;
            let mouseMoveOffsetRatio = event.offsetX / canvasWidth;
            let arrayNumberFromRatio = Math.floor(graphDataArrayLength * mouseMoveOffsetRatio) ;
            console.log(graphData[arrayNumberFromRatio])
            console.log(weather.hourly.time[arrayNumberFromRatio])
        })
    })






