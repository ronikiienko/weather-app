import dayjs from 'dayjs';
import weatherIcons from './images/pack1svg/*.svg';
import {canvasWidth, currentWeatherDisplay, detectPositionButton, drawGraphsButton, graphCheckboxes} from './variables';


export let weather;

export function updateGeolocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(position);
            },
            (error) => {
                reject(error);
            },
        );
    });
}


export const getLocationDataByPosition = (position) => {
    return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.latitude}&longitude=${position.longitude}`)
        .then(resp => resp.json());
};

export function getPositionByCity(city) {
    return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
        .then(resp => resp.json());
}

export function getUnits(degreeUnit) {
    let units = {};
    if (degreeUnit === 'farenheit') {
        units.windspeedUnit = 'windspeed_unit=mph';
        units.temperatureUnit = 'temperature_unit=fahrenheit';
        units.unitChooseButtonId = 'farenheit';
    } else if (degreeUnit === 'celsius') {
        units.windspeedUnit = '';
        units.temperatureUnit = '';
        units.unitChooseButtonId = 'celsius';
    }
    return units;
}

export function getWeatherByPosition(position) {
    let units;
    units = JSON.parse(localStorage.getItem('units'));
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${position.latitude}&longitude=${position.longitude}&hourly=weathercode,temperature_2m,windspeed_10m,relativehumidity_2m,apparent_temperature,dewpoint_2m,pressure_msl&daily=windspeed_10m_max,sunrise,sunset,weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=${position.timeZone}&${units.windspeedUnit}&${units.temperatureUnit}`)
        .then(resp => resp.json())
        .then(json => {
            weather = json;
            return weather;
        });
}


export function getCurrentTimeOfDay(timeZone) {
    const currentHour = dayjs.tz(dayjs(), timeZone).$H;
    if (currentHour < 7 && currentHour >= 0 || currentHour === 23) {
        return 'night';
    } else {
        return 'day';
    }
}

export function getTimeOfDayForHour(time) {
    const hour = Number(time.slice(0, 2));
    if (hour < 7 && hour >= 0 || hour === 23) {
        return 'night';
    } else {
        return 'day';
    }
}


export function getDayInfoForDate(date) {
    let dayInfo;
    dayInfo = {
        month: dayjs(date).format('MMMM'),
        monthShort: dayjs(date).format('MMM'),
        dayOfMonth: dayjs(date).format('D'),
        dayOfWeek: dayjs(date).format('dddd'),
        dayOfWeekShort: dayjs(date).format('dd'),
    };
    return dayInfo;
}

export function getCurrentHourNumberInHourArray(timeZone) {
    const currentHourNumberInHourArray = dayjs.tz(dayjs(), timeZone).$H;
    return currentHourNumberInHourArray;
}

export function detectPosition() {
    return updateGeolocation()
        .then((response) => {
            getLocationDataByPosition(response)
                .then((response) => {
                    const position = {
                        country: response.countryName,
                        city: response.city,
                        latitude: response.latitude,
                        longitude: response.longitude,
                        administrative: response.principalSubdivision,
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

                    };
                    localStorage.setItem('position', JSON.stringify(position));
                    return position;
                });
        })
        .catch((error) => {
            console.log('error detecting location', error);
            return null;
        });
}

export function drawPictureBySrc(whereToAppend, src) {
    const image = document.createElement('img');
    image.src = src;
    whereToAppend.appendChild(image);

}


export function handleWeathercode(weathercode, timeOfTheDay) {
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
                weathercodeImage = weatherIcons['Fog'];
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
                weathercodeImage = weatherIcons['Rain-Night'];
            } else {
                weathercodeImage = weatherIcons['Rain'];
            }
            break;
        case 63:
            weathercodeTextMessage = 'Moderate rain';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Rain-Night'];
            } else {
                weathercodeImage = weatherIcons['Rain'];
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
                weathercodeImage = weatherIcons['Scattered-Showers-Night'];
            } else {
                weathercodeImage = weatherIcons['Scattered-Showers'];
            }
            break;
        case 81:
            weathercodeTextMessage = 'Moderate rain showers';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Scattered-Showers-Night'];
            } else {
                weathercodeImage = weatherIcons['Scattered-Showers'];
            }
            break;
        case 82:
            weathercodeTextMessage = 'Violent rain showers';
            if (timeOfTheDay === 'night') {
                weathercodeImage = weatherIcons['Scattered-Showers-Night'];
            } else {
                weathercodeImage = weatherIcons['Scattered-Showers'];
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
        image: weathercodeImage,
    };
    return weathercodeResult;
}

export function handleWindspeed(windspeed) {
    const windspeedUnit = JSON.parse(localStorage.getItem('units')).windspeedUnit;
    let windspeedMs;

    if (windspeedUnit === 'windspeed_unit=mph') {
        windspeedMs = windspeed / 2.237;
    } else {
        windspeedMs = windspeed / 3.6;
    }
    let windName;
    let windDescription;

    if (windspeedMs < 0.5) {
        windName = 'Calm';
        windDescription = 'Smoke drifts with air, weather vanes inactive';
    } else if (windspeedMs >= 0.5 && windspeedMs < 1.5) {
        windName = 'Light  air';
        windDescription = 'Weather vanes active, wind felt on face, leaves rustle';
    } else if (windspeedMs >= 1.5 && windspeedMs < 3) {
        windName = 'Light breeze';
        windDescription = 'Weather vanes active, wind felt on face, leaves rustle';
    } else if (windspeedMs >= 3 && windspeedMs < 5) {
        windName = 'Gentle breeze';
        windDescription = 'Leaves & small twigs move, light flags extend';
    } else if (windspeedMs >= 5 && windspeedMs < 8) {
        windName = 'Moderate breeze';
        windDescription = 'Small branches sway, dust & loose paper blows about';
    } else if (windspeedMs >= 8 && windspeedMs < 10.5) {
        windName = 'Fresh breeze';
        windDescription = 'Small trees sway, waves break on inland waters';
    } else if (windspeedMs >= 10.5 && windspeedMs < 13.5) {
        windName = 'Strong breeze';
        windDescription = 'Large branches sway, umbrellas difficult to use';
    } else if (windspeedMs >= 13.5 && windspeedMs < 16.5) {
        windName = 'Moderate gale';
        windDescription = 'Whole trees sway, difficult to walk against wind';
    } else if (windspeedMs >= 16.5 && windspeedMs < 20) {
        windName = 'Fresh gale';
        windDescription = 'Twigs broken off trees, walking against wind very difficult';
    } else if (windspeedMs >= 20 && windspeedMs < 23.5) {
        windName = 'Strong gale';
        windDescription = 'Slight damage to buildings, shingles blown off roof';
    } else if (windspeedMs >= 23.5 && windspeedMs < 27.5) {
        windName = 'Whole gale';
        windDescription = 'Trees uprooted, considerable damage to buildings';
    } else if (windspeedMs >= 27.5 && windspeedMs < 31.5) {
        windName = 'Storm';
        windDescription = 'Widespread damage, very rare occurrence';
    } else if (windspeedMs >= 31.5) {
        windName = 'Hurricane';
        windDescription = 'Violent destruction';
    }
    let windspeedInfo = {
        windspeedName: windName,
        windspeedDescription: windDescription,
    };
    return windspeedInfo;
}

export function getDayInfoStringForArrNum(weather, i, shortOrFull) {
    const dayInfo = getDayInfoForDate(weather.daily.time[i]);
    let forecastDayInfoString;
    if (i === 0) {
        forecastDayInfoString = 'Today';
    } else if (i === 1) {
        forecastDayInfoString = 'Tomorrow';
    } else {
        if (shortOrFull) {
            forecastDayInfoString = `${dayInfo.dayOfWeekShort}, ${dayInfo.monthShort} ${dayInfo.dayOfMonth}`;
        } else {
            forecastDayInfoString = `${dayInfo.dayOfWeek}, ${dayInfo.month} ${dayInfo.dayOfMonth}`;
        }
    }
    return forecastDayInfoString;
}

export function getMaxMinWeeklyTemperature(weather) {
    const min = Math.min(...weather.daily.temperature_2m_min);
    const max = Math.max(...weather.daily.temperature_2m_max);
    const avg = Number(((min + max) / 2).toFixed(1));
    let data = {
        min: min,
        max: max,
        avg: avg,
        avgHigher: Number(((max + avg) / 2).toFixed(1)),
        avgLower: Number(((min + avg) / 2).toFixed(1)),
    };
    return data;
}

export function handleOffsetFromCanvas(offsetX, arrayLength) {
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

export function checkedRadioForName(parentDiv, checkedNotChecked, name) {
    let checkedRadio;
    let notCheckedRadio;
    checkedRadio = parentDiv.querySelector(`input[name="${name}"]:checked`);
    notCheckedRadio = parentDiv.querySelectorAll(`input[name="${name}"]:not(:checked)`);
    if (checkedNotChecked === 'checked') {
        return checkedRadio;
    } else if (checkedNotChecked === 'notChecked') {
        return notCheckedRadio;
    }
}

export function setOrDeleteBackgroundWhite(element, setOrDelete, transparency) {
    if (setOrDelete === 'set') {
        element.style.backgroundColor = `rgba(255, 255, 255, 0.2)`;
    } else if (setOrDelete === 'delete') {
        element.style.backgroundColor = `transparent`;
    }
}

export function setSelectionByDayNumber(arrayOfElements, numberOfSelectedElement) {
    for (let arrayElement of arrayOfElements) {
        if (arrayElement.id.includes(numberOfSelectedElement)) {
            setOrDeleteBackgroundWhite(arrayElement, 'set');
            continue;
        }
        setOrDeleteBackgroundWhite(arrayElement, 'delete');
    }
}

export function setUnitSwitchesData(init) {
    if (init === 'init' && localStorage.getItem('units')) {
        const checkedUnitInputId = JSON.parse(localStorage.getItem('units')).unitChooseButtonId;
        currentWeatherDisplay.querySelector(`input[id="${checkedUnitInputId}"]`).checked = true;
        setOrDeleteBackgroundWhite(currentWeatherDisplay.querySelector(`label[for="${checkedUnitInputId}"]`), 'set');
    } else {
        const checkedRadioId = checkedRadioForName(currentWeatherDisplay, 'checked', 'chooseDegreeUnit').id;
        const notCheckedRadioId = checkedRadioForName(currentWeatherDisplay, 'notChecked', 'chooseDegreeUnit')[0].id;
        const chosenDegreeUnitLabel = currentWeatherDisplay.querySelector(`label[for="${checkedRadioId}"]`);
        const notChosenDegreeUnitLabel = currentWeatherDisplay.querySelector(`label[for="${notCheckedRadioId}"]`);
        setOrDeleteBackgroundWhite(chosenDegreeUnitLabel, 'set');
        setOrDeleteBackgroundWhite(notChosenDegreeUnitLabel, 'delete');

        const units = getUnits(checkedRadioId);
        localStorage.setItem('units', units);
    }


}

export function setGraphSwitchesData() {
    const checkedGraphCheckboxes = document.querySelectorAll('input[name=graphDataTypeCheckbox]:checked');
    let checkedGraphChekboxesIds = [];
    for (let checkedGraphCheckbox of checkedGraphCheckboxes) {
        checkedGraphChekboxesIds.push(checkedGraphCheckbox.id);
    }
    const checkedGraphCheckboxesIdsStringified = JSON.stringify(checkedGraphChekboxesIds);
    window.localStorage.setItem('checkedGraphDataTypeCheckboxes', checkedGraphCheckboxesIdsStringified);

}

export async function wait(delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
                resolve();
            }, delay,
        );
    });
}

export function averageFromTwoArrays(arr1, arr2) {
    let average = arr1.map((element, index) => (element + arr2[index]) / 2);
    return average;
}

export function averageNumberFromArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return (sum / arr.length).toFixed(1);
}

export function handleCheckedGraphCheckboxesForDetails(checkboxId) {
    let data = null;
    let detailDiv;
    let detailName;
    switch (checkboxId) {
        case 'graphDailyMaxTemperatureCheckbox':
            data = weather.daily.temperature_2m_max;
            detailDiv = document.getElementById('graphDailyMaxDetails');
            detailName = 'Max: ';
            break;
        case 'graphDailyMinTemperatureCheckbox':
            data = weather.daily.temperature_2m_min;
            detailDiv = document.getElementById('graphDailyMinDetails');
            detailName = 'Min: ';
            break;
        case 'graphHourlyTemperatureCheckbox':
            data = weather.hourly.temperature_2m;
            detailDiv = document.getElementById('graphHourlyDetails');
            detailName = '';
            break;
        case 'graphDailyAverageTemperatureCheckbox':
            const arr1 = weather.daily.temperature_2m_max;
            const arr2 = weather.daily.temperature_2m_min;
            const averageFromMinMaxArrays = averageFromTwoArrays(arr1, arr2);
            data = averageFromMinMaxArrays.map((element) => {
                return Number(element.toFixed(1));
            });
            detailDiv = document.getElementById('graphDailyAverageDetails');
            detailName = 'Avg: ';
    }
    let graphDetailBarToFillInfo = {
        dataToFill: data,
        dataName: detailName,
        detailDivToFill: detailDiv,

    };
    return graphDetailBarToFillInfo;
}

function checkIfDisabled(input) {
    return input.disabled;
}

export function disableEnableGraphCheckboxes() {
    for (let graphCheckbox of graphCheckboxes) {
        graphCheckbox.disabled = !checkIfDisabled(graphCheckbox);
    }
    drawGraphsButton.disabled = !checkIfDisabled(drawGraphsButton);
    detectPositionButton.disabled = !checkIfDisabled(detectPositionButton);
}

export function setDefaultPosition() {
    const defaultPosition = {
        'country': 'Ukraine',
        'city': 'Kyiv',
        'latitude': 50.45466,
        'longitude': 30.5238,
        'administrative': 'Kyiv City',
        'timeZone': 'Europe/Kiev',
    };
    localStorage.setItem('position', JSON.stringify(defaultPosition));
}
