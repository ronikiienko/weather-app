import dayjs from "dayjs";

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