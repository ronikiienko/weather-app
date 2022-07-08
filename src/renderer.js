import {getCurrentTimeOfDay, getDayInfoForDate, getWeatherByPosition} from "./utils";
import dayjs from "dayjs";

export function renderCurrentTime() {
    let position = JSON.parse(window.localStorage.getItem('position'));
    let timeZone = position.timeZone

    currentDate.textContent = dayjs.tz(dayjs(), timeZone).format('MMMM D');
    currentTime.textContent = dayjs.tz(dayjs(), timeZone).format('HH:mm:ss');
}


export function renderCurrentWeather(weather, position) {
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
export function renderForecast(weather, position) {
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


export function renderWeather() {
    const position = JSON.parse(localStorage.getItem('position'));
    getWeatherByPosition(position)
        .then((weather) => {
            drawGraphs(position, weather)
            renderCurrentWeather(weather, position);
            renderForecast(weather, position);
        })

}