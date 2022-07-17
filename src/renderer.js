import dayjs from 'dayjs';
import weatherDataTypeIcons from './images/icons/*.svg';

import {
    averageNumberFromArray,
    drawPictureBySrc,
    getCurrentHourNumberInHourArray,
    getCurrentTimeOfDay,
    getDayInfoStringForArrNum,
    getTimeOfDayForHour,
    getWeatherByPosition,
    handleWeathercode,
    handleWindspeed,
} from './utils';
import {
    currentDate,
    currentDewPointDiv,
    currentFeelsLikeDiv,
    currentHumidityDiv,
    currentPressureDiv,
    currentTemperatureDisplayDiv,
    currentTime,
    currentWeatherPictureDiv,
    currentWindSpeedDiv,
    myPositionDisplay,
    weatherDisplay,
} from './variables';


function renderCurrentWeather(weather, position) {
    ;
    const currentHourNumberInHourArray = getCurrentHourNumberInHourArray(position.timeZone);
    const currentWeather = weather.current_weather;
    currentWeatherPictureDiv.textContent = '';
    const currentWeathercode = Number(currentWeather.weathercode);
    const image = document.createElement('img');


    currentTemperatureDisplayDiv.textContent = `${Math.round(currentWeather.temperature)}°`;
    currentSkyDescriptionDiv.textContent = `${handleWeathercode(currentWeathercode, 'night').message}`;
    currentWindSpeedDiv.textContent = `Wind\u00A0\u00A0\u00A0${currentWeather.windspeed} ${weather.hourly_units.windspeed_10m} (${handleWindspeed(currentWeather.windspeed).windspeedName})`;
    currentWindSpeedDiv.title = `${handleWindspeed(currentWeather.windspeed).windspeedDescription}`;
    currentHumidityDiv.textContent = `Humidity\u00A0\u00A0\u00A0${weather.hourly.relativehumidity_2m[currentHourNumberInHourArray]}%`;
    currentFeelsLikeDiv.textContent = `Feels like\u00A0\u00A0\u00A0${Math.round(weather.hourly.apparent_temperature[currentHourNumberInHourArray])}°`;
    currentDewPointDiv.textContent = `Dew Point\u00A0\u00A0\u00A0${weather.hourly.dewpoint_2m[currentHourNumberInHourArray]}°`;
    currentPressureDiv.textContent = `Pressure\u00A0\u00A0\u00A0${weather.hourly.pressure_msl[currentHourNumberInHourArray]} ${weather.hourly_units.pressure_msl}`;
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
    myPositionDisplay.textContent = ` ${position.city}, ${position.country}, ${position.administrative}`;
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
    for (let forecastPic of document.querySelectorAll('.forecastDayPictureDiv')) {
        forecastPic.textContent = '';
    }
    for (let I = 0; I < 7; I++) {


        const weathercodeData = handleWeathercode(weather.daily.weathercode[I], 'day');

        const weatherForecastDay = document.getElementById(`forecast${I}`);
        const forecastDayMaxTemperatureDiv = weatherForecastDay.querySelector('.forecastDayMaxTemperatureDiv');
        const forecastDayMinTemperatureDiv = weatherForecastDay.querySelector('.forecastDayMinTemperatureDiv');
        const forecastDayDateDiv = weatherForecastDay.querySelector('.forecastDayDateDiv');
        const forecastDayPictureDiv = weatherForecastDay.querySelector('.forecastDayPictureDiv');
        const forecastDayWeatherDescriptionDiv = weatherForecastDay.querySelector('.forecastDayWeatherDescriptionDiv');

        forecastDayMaxTemperatureDiv.textContent = `${Math.round(weather.daily.temperature_2m_max[I])}°`;
        forecastDayMinTemperatureDiv.textContent = `${Math.round(weather.daily.temperature_2m_min[I])}°`;
        forecastDayWeatherDescriptionDiv.textContent = weathercodeData.message;

        forecastDayDateDiv.textContent = getDayInfoStringForArrNum(weather, I, true);

        drawPictureBySrc(forecastDayPictureDiv, weathercodeData.image);
    }
}

export function renderAllWeather() {
    const position = JSON.parse(localStorage.getItem('position'));
    if (position === null) {
        weatherDisplay.style.display = 'none';
        console.log('position is null');
        return;
    } else {
        weatherDisplay.style.display = 'block';
    }
    getWeatherByPosition(position)
        .then((weather) => {
            renderCurrentWeather(weather, position);
            renderForecast(weather);
            renderMyPosition();
            renderDayDetails(weather, 0);
        });

}

export function renderHourlyDetails(weather, dayNumberInArray) {
    for (let i = 0; i < 24; i++) {

        const numberInHourlyArray = 24 * dayNumberInArray + i;

        const dayDetailsHourDiv = document.getElementById(`dayHourDiv${i}`);

        const dayHourTimeDiv = dayDetailsHourDiv.querySelector('.dayHourTimeDiv');
        const dayHourPictureDiv = dayDetailsHourDiv.querySelector('.dayHourPictureDiv');
        const dayHourSkyDescriptionDiv = dayDetailsHourDiv.querySelector('.dayHourSkyDescriptionDiv');
        const dayHourWindDescriptionDiv = dayDetailsHourDiv.querySelector('.dayHourWindDescriptionDiv');
        const dayHourTemperatureDiv = dayDetailsHourDiv.querySelector('.dayHourTemperatureDiv');
        const dayHourHumidityDiv = dayDetailsHourDiv.querySelector('.dayHourHumidityDiv');
        const dayHourHumidityPictureDiv = dayDetailsHourDiv.querySelector('.dayHourHumidityPictureDiv');
        const dayHourWindPictureDiv = dayDetailsHourDiv.querySelector('.dayHourWindPictureDiv');

        dayHourPictureDiv.textContent = '';
        dayHourWindPictureDiv.textContent = '';
        dayHourHumidityPictureDiv.textContent = '';

        const time = weather.hourly.time[i].slice(11, 16);
        const timeOfDay = getTimeOfDayForHour(time);

        const weathercodeData = handleWeathercode(weather.hourly.weathercode[numberInHourlyArray], timeOfDay);

        dayHourTemperatureDiv.textContent = `${Math.round(weather.hourly.temperature_2m[numberInHourlyArray])}°`;
        dayHourHumidityDiv.textContent = `${weather.hourly.relativehumidity_2m[numberInHourlyArray]}%`;
        dayHourSkyDescriptionDiv.textContent = weathercodeData.message;
        dayHourTimeDiv.textContent = time;


        dayHourWindDescriptionDiv.textContent = `${weather.hourly.windspeed_10m[numberInHourlyArray]} ${weather.hourly_units.windspeed_10m}`;
        drawPictureBySrc(dayHourPictureDiv, weathercodeData.image);
        drawPictureBySrc(dayHourHumidityPictureDiv, weatherDataTypeIcons['droplet']);
        drawPictureBySrc(dayHourWindPictureDiv, weatherDataTypeIcons['wind']);

    }
}

export function renderDayDescription(weather, dayNumberInArray) {
    console.log(weather);
    {
        const dayDescriptionSunrise = document.getElementById('dayDescriptionSunrise');
        const dayDescriptionSunset = document.getElementById('dayDescriptionSunset');
        const dayDescriptionMaxWindspeed = document.getElementById('dayDescriptionMaxWindspeed');
        const dayDescriptionAverageHumidity = document.getElementById('dayDescriptionAverageHumidity');
        dayDescriptionSunrise.textContent = weather.daily.sunrise[dayNumberInArray].slice(11, 16);
        dayDescriptionSunset.textContent = weather.daily.sunset[dayNumberInArray].slice(11, 16);
        dayDescriptionMaxWindspeed.textContent = `${weather.daily.windspeed_10m_max[dayNumberInArray]} ${weather.daily_units.windspeed_10m_max}`;


        const allDayHoursArrayNumbers = [dayNumberInArray * 24, dayNumberInArray * 24 + 24];
        const allHoursHumidityByDay = weather.hourly.relativehumidity_2m.slice(allDayHoursArrayNumbers[0], allDayHoursArrayNumbers[1]);

        dayDescriptionAverageHumidity.textContent = `${averageNumberFromArray(allHoursHumidityByDay)} ${weather.hourly_units.relativehumidity_2m}`;
    }
}

export function renderDayDetails(weather, dayNumberInArray) {
    renderDayDescription(weather, dayNumberInArray);
    renderHourlyDetails(weather, dayNumberInArray);
}

function showOrHide(element, hideOrShow) {
    const hiddenOrNot = element.classList.contains('hidden');
    if (hideOrShow === 'hide' && !hiddenOrNot) {
        element.classList.add('hidden');
    } else if (hideOrShow === 'show' && hiddenOrNot) {
        element.classList.remove('hidden');
    }
}





export function renderCurrentTime() {
    let position = JSON.parse(window.localStorage.getItem('position'));
    if (position === null) {
        return;
    }
    let timeZone = position.timeZone;

    currentDate.textContent = dayjs.tz(dayjs(), timeZone).format('MMMM D');
    currentTime.textContent = dayjs.tz(dayjs(), timeZone).format('HH:mm:ss');
}


