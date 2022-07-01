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


const weatherForecastDayDiv = document.querySelectorAll('weatherForecastDayDiv');


const updateWeatherButton = document.getElementById('updateWeatherButton');
const chooseDegreeUnitsRadios = document.querySelectorAll("input[name='chooseDegreeUnits']");
const weatherForecastDisplay = document.getElementById('weatherForecastDisplay');


function findCheckedRadioForName(name) {
    const inputs = name;
    for (let input of inputs) {
        if (input.checked) {
            return input.id;
        }

    }
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
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${position.latitude}&longitude=${position.longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&windspeed_10&timezone=${position.timeZone}&${tempUnit}`)
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

function getCurrentTimeOfDay(timeZone) {
    const currentHour = dayjs.tz(dayjs(), timeZone).$H;
    if (currentHour < 7 && currentHour >= 0 || currentHour === 23) {
        return 'night'
    } else {
        return 'day'
    }
}
function getDayInfoForDate(date) {
    const dayInfo = {
        month: dayjs(date).format('MMMM'),
        dayOfMonth:  dayjs(date).format('D'),
        dayOfWeek: dayjs(date).format('dddd')

    }
    return dayInfo;
}

function renderCurrentWeather(weather, position) {
    console.log(weather)
    currentWeatherPictureDiv.textContent = '';
    // currentWeatherPictureDivDiv.removeChild()
    const currentWeathercode = Number(weather.current_weather.weathercode);
    const image = document.createElement('img');


    currentTemperatureDisplayDiv.textContent = `${weather.current_weather.temperature}°`;
    currentWeatherDescriptionDiv.textContent = `${handleWeathercode(currentWeathercode, 'night').message}`
    currentWindSpeedDiv.textContent = `${weather.current_weather.windspeed}`
    const currentWeatherPicture = currentWeatherPictureDiv.appendChild(image);
    currentWeatherPicture.src = handleWeathercode(currentWeathercode, getCurrentTimeOfDay(position.timeZone)).image;
}



function renderForecast(weather, position) {
    for (let forecastPic of document.querySelectorAll('.forecastPictureDiv')) {
        forecastPic.textContent = '';
    }
    for (let i = 0; i < 7; i++) {
        const forecastDayInfo = getDayInfoForDate(weather.daily.time[i]);
        let date;
        if (i === 0) {
            date = 'Today'
        } else if (i === 1) {
            date = 'Tomorrow'
        } else {
            date = weather.daily.time[i]
        }
        const currentWeathercode = Number(weather.daily.weathercode[i]);
        const weatherForecastDay = document.getElementById(`forecast${i}`);
        const forecastPictureDiv = weatherForecastDay.querySelector('.forecastPictureDiv');
        const forecastTemperatureDiv = weatherForecastDay.querySelector('.forecastTemperatureDiv');
        const forecastDescriptionDiv = weatherForecastDay.querySelector('.forecastDescriptionDiv');
        const forecastDayDateDiv = weatherForecastDay.querySelector('.forecastDayDateDiv');

        const image = document.createElement('img');
        const forecastPicture = forecastPictureDiv.appendChild(image);
        forecastPicture.src = handleWeathercode(currentWeathercode, 'day').image;

        forecastDayDateDiv.textContent = `${forecastDayInfo.dayOfWeek}, ${forecastDayInfo.month} ${forecastDayInfo.dayOfMonth}`
        forecastDescriptionDiv.textContent = `${handleWeathercode(currentWeathercode, 'day').message}`;
        forecastTemperatureDiv.textContent = `${weather.daily.temperature_2m_min[i]} / ${weather.daily.temperature_2m_max[i]}`;

    }
}


function renderWeather() {
    const position = JSON.parse(localStorage.getItem('position'));
    getWeatherByPosition(position)
        .then((weather) => {
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

    }

});


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
}

init();
