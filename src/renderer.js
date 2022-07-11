import dayjs from 'dayjs';
import {
    getCurrentTimeOfDay,
    getDayInfoStringForArrNum,
    getTimeOfDayForHour,
    getWeatherByPosition,
    handleWeathercode,
    handleWindspeed,
} from './utils';
import {
    currentDate,
    currentSunriseTimeDiv,
    currentSunsetTimeDiv,
    currentTemperatureDisplayDiv,
    currentTime,
    currentWeatherDescriptionDiv,
    currentWeatherPictureDiv,
    currentWindSpeedDiv,
    myPositionDisplay,
} from './variables';


function drawPictureBySrc(whereToAppend, src) {
    const image = document.createElement('img');
    image.src = src;
    whereToAppend.appendChild(image);
}

function renderCurrentWeather(weather, position) {
    const currentWeather = weather.current_weather;
    currentWeatherPictureDiv.textContent = '';
    const currentWeathercode = Number(currentWeather.weathercode);
    const image = document.createElement('img');


    currentTemperatureDisplayDiv.textContent = `${currentWeather.temperature}°`;
    currentWeatherDescriptionDiv.textContent = `Sky: ${handleWeathercode(currentWeathercode, 'night').message}`;
    currentSunriseTimeDiv.textContent = `${weather.daily.sunrise[0].slice(11, 16)}`;
    currentSunsetTimeDiv.textContent = `${weather.daily.sunset[0].slice(11, 16)}`;
    currentWindSpeedDiv.textContent = `Wind: ${handleWindspeed(currentWeather.windspeed).windspeedName}`;
    currentWindSpeedDiv.title = `${handleWindspeed(currentWeather.windspeed).windspeedDescription}`;
    drawPictureBySrc(currentWeatherPictureDiv, handleWeathercode(currentWeathercode, getCurrentTimeOfDay(position.timeZone)).image);

}


function getTimeByIForecast(i) {
    let time;
    if (i === 0) {
        time = '04:00';
    } else if (i === 1) {
        time = '10:00';
    } else if (i === 2) {
        time = '16:00';
    } else if (i === 3) {
        time = '23:00';
    }
    return time;
}

function renderMyPosition() {
    const position = JSON.parse(localStorage.getItem('position'));
    myPositionDisplay.textContent = `My position is: ${position.city}, ${position.country}, ${position.administrative}`;
}

function getHourDataTypeByI(i, I, weather, dataType) {
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


function renderForecast(weather) {
    for (let forecastPic of document.querySelectorAll('.forecastHourPictureDiv')) {
        forecastPic.textContent = '';
    }
    for (let I = 0; I < 7; I++) {


        const weatherForecastDay = document.getElementById(`forecast${I}`);

        const forecastDayGeneralTemperatureDiv = weatherForecastDay.querySelector('.forecastDayGeneralTemperatureDiv');
        const forecastDayGeneralDateDiv = weatherForecastDay.querySelector('.forecastDayGeneralDateDiv');
        const forecastDayGeneralSunriseTimeDiv = weatherForecastDay.querySelector('.forecastDayGeneralSunriseTimeDiv');
        const forecastDayGeneralSunsetTimeDiv = weatherForecastDay.querySelector('.forecastDayGeneralSunsetTimeDiv');


        forecastDayGeneralTemperatureDiv.textContent = `${weather.daily.temperature_2m_min[I]}° / ${weather.daily.temperature_2m_max[I]}°`;
        forecastDayGeneralDateDiv.textContent = getDayInfoStringForArrNum(weather, I);
        forecastDayGeneralSunriseTimeDiv.textContent = `${weather.daily.sunrise[I].slice(11, 16)}`;
        forecastDayGeneralSunsetTimeDiv.textContent = `${weather.daily.sunset[I].slice(11, 16)}`;


        for (let i = 0; i < 4; i++) {
            const weatherForecastHour = weatherForecastDay.getElementsByClassName(`weatherForecastHourDiv`)[i];

            const forecastHourWindDescriptionDiv = weatherForecastHour.querySelector('.forecastHourWindDescriptionDiv');
            const forecastHourPictureDiv = weatherForecastHour.querySelector('.forecastHourPictureDiv');
            const forecastHourTemperatureDiv = weatherForecastHour.querySelector('.forecastHourTemperatureDiv');
            const forecastHourTimeDiv = weatherForecastHour.querySelector('.forecastHourTimeDiv');
            const forecastHourSkyDescriptionDiv = weatherForecastHour.querySelector('.forecastHourSkyDescriptionDiv');


            forecastHourTimeDiv.textContent = getTimeByIForecast(i);
            forecastHourTemperatureDiv.textContent = `Temperature: ${getHourDataTypeByI(i, I, weather, 'temperature_2m')}°`;
            forecastHourSkyDescriptionDiv.textContent = `${handleWeathercode(getHourDataTypeByI(i, I, weather, 'weathercode')).message}`;
            forecastHourWindDescriptionDiv.textContent = `${handleWindspeed(getHourDataTypeByI(i, I, weather, 'windspeed_10m')).windspeedName}`;

            drawPictureBySrc(forecastHourPictureDiv, handleWeathercode(getHourDataTypeByI(i, I, weather, 'weathercode'), getTimeOfDayForHour(getTimeByIForecast(i))).image);
        }

    }
}

export function renderAllWeather() {
    const position = JSON.parse(localStorage.getItem('position'));
    getWeatherByPosition(position)
        .then((weather) => {
            toggleDayDetailsView(weather, 0);
            renderCurrentWeather(weather, position);
            renderForecast(weather);
            renderMyPosition();
        });

}

function renderDayDetails(weather, dayNumberInArray) {
    const dayDetailsGeneralDateDiv = document.querySelector('.dayDetailsGeneralDateDiv');
    const dayDetailsGeneralTemperatureDiv = document.querySelector('.dayDetailsGeneralTemperatureDiv');
    const dayDetailsGeneralSunriseTimeDiv = document.querySelector('.dayDetailsGeneralSunriseTimeDiv');
    const dayDetailsGeneralSunsetTimeDiv = document.querySelector('.dayDetailsGeneralSunsetTimeDiv');
    console.log(dayDetailsGeneralDateDiv);
    dayDetailsGeneralDateDiv.textContent = getDayInfoStringForArrNum(weather, dayNumberInArray);

    for (let i = 0; i < 24; i++) {
        const dayDetailsHourDiv = document.getElementById(`dayDetailsHourDiv${i}`);

        const dayDetailsHourTimeDiv = dayDetailsHourDiv.querySelector('.dayDetailsHourTimeDiv');
        const dayDetailsHourPictureDiv = dayDetailsHourDiv.querySelector('.dayDetailsHourPictureDiv');
        const dayDetailsHourSkyDescriptionDiv = dayDetailsHourDiv.querySelector('.dayDetailsHourSkyDescriptionDiv');
        const dayDetailsHourWindDescriptionDiv = dayDetailsHourDiv.querySelector('.dayDetailsHourWindDescriptionDiv');
        const dayDetailsHourTemperatureDiv = dayDetailsHourDiv.querySelector('.dayDetailsHourTemperatureDiv');

        const time = weather.hourly.time[i].slice(11, 16);
        const timeOfDay = getTimeOfDayForHour(time);

        const weathercodeData = handleWeathercode(weather.hourly.weathercode[i], timeOfDay);
        console.log(weather);

        dayDetailsHourTemperatureDiv.textContent = weather.hourly.temperature_2m[24 * dayNumberInArray - 1 + i];
        dayDetailsHourSkyDescriptionDiv.textContent = weathercodeData.message;
        dayDetailsHourTimeDiv.textContent = time;


        dayDetailsHourWindDescriptionDiv.textContent = handleWindspeed(weather.hourly.windspeed_10m[i]).windspeedName;
        drawPictureBySrc(dayDetailsHourPictureDiv, weathercodeData.image);
    }
}


export function toggleDayDetailsView(weather, dayNumberInArray) {
    const dayDetailsHours = document.getElementById('dayDetailsHours');
    dayDetailsHours.classList.toggle('hidden');
    if (dayDetailsHours.classList.contains('hidden')) {
        return;
    }
    renderDayDetails(weather, dayNumberInArray);
}

export function renderCurrentTime() {
    let position = JSON.parse(window.localStorage.getItem('position'));
    let timeZone = position.timeZone;

    currentDate.textContent = dayjs.tz(dayjs(), timeZone).format('MMMM D');
    currentTime.textContent = dayjs.tz(dayjs(), timeZone).format('HH:mm:ss');
}


