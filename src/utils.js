import dayjs from 'dayjs';
import weatherIcons from './images/pack1svg/*.svg';


export function updateGeolocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position)
        })
    });
}


export const getLocationDataByPosition = (position) => {
    return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.latitude}&longitude=${position.longitude}`)
        .then(resp => resp.json());
}

export function getPositionByCity(city) {
    return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
        .then(resp => resp.json());
}

export function getWeatherByPosition(position) {
    let tempUnit;
    if (localStorage.getItem('degreeUnits') === 'farenheits') {
        tempUnit = 'temperature_unit=fahrenheit'
    }
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${position.latitude}&longitude=${position.longitude}&hourly=weathercode,temperature_2m,windspeed_10m&daily=sunrise,sunset,weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&windspeed_10&timezone=${position.timeZone}&${tempUnit}&windspeed_unit=ms`)
        .then(resp => resp.json());
}


export function getCurrentTimeOfDay(timeZone) {
    const currentHour = dayjs.tz(dayjs(), timeZone).$H;
    if (currentHour < 7 && currentHour >= 0 || currentHour === 23) {
        return 'night'
    } else {
        return 'day'
    }
}


export function getDayInfoForDate(date) {
    let dayInfo;
    dayInfo = {
        month: dayjs(date).format('MMMM'),
        dayOfMonth: dayjs(date).format('D'),
        dayOfWeek: dayjs(date).format('dddd'),

    }
    return dayInfo;
}


export function detectPosition() {
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

export function handleWindspeed(windspeed) {
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

export function findCheckedRadioForName(name) {
    const inputs = name;
    for (let input of inputs) {
        if (input.checked) {
            return input.id;
        }

    }
}

export function setGraphSwitchesData() {
    const checkedGraphCheckboxes = document.querySelectorAll('input[name=graphDataTypeCheckbox]:checked');
    let checkedGraphChekboxesIds = [];
    for (checkedGraphCheckbox of checkedGraphCheckboxes) {
        checkedGraphChekboxesIds.push(checkedGraphCheckbox.id);
    }
    const checkedGraphCheckboxesIdsStringified = JSON.stringify(checkedGraphChekboxesIds);
    window.localStorage.setItem('checkedGraphDataTypeCheckboxes', checkedGraphCheckboxesIdsStringified);

}
