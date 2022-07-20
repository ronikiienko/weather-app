const DEFAULT_POSITION = {
    'country': 'Ukraine',
    'city': 'Kyiv',
    'latitude': 50.45466,
    'longitude': 30.5238,
    'administrative': 'Kyiv City',
    'timeZone': 'Europe/Kiev',
};

const DEFAULT_UNITS = {'windspeedUnit': '', 'temperatureUnit': '', 'unitChooseButtonId': 'celsius'};

export function setDefaultPosition() {
    localStorage.setItem('position', JSON.stringify(DEFAULT_POSITION));
}

export function setDefaultUnits() {
    localStorage.setItem('units', JSON.stringify(DEFAULT_UNITS));
}
