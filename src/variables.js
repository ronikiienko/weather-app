export const citySuggestions = document.getElementById('citySuggestions');
export const chooseCityInput = document.getElementById('searchCity');
export const detectPositionButton = document.getElementById('detectPositionButton');
export const myPositionDisplay = document.getElementById('myPositionDisplay');


export const currentWeatherPictureDiv = document.getElementById('currentWeatherPictureDiv');
export const currentWeatherDescriptionDiv = document.getElementById('currentWeatherDescriptionDiv');
export const currentWeatherDisplay = document.getElementById('currentWeatherDisplay');
export const currentTemperatureDisplayDiv = document.getElementById('currentTemperatureDisplayDiv');
export const currentWindSpeedDiv = document.getElementById('currentWindSpeedDiv');
export const currentSunriseTimeDiv = document.getElementById('currentSunriseTimeDiv');
export const currentSunsetTimeDiv = document.getElementById('currentSunsetTimeDiv');
export const currentTime = document.getElementById('currentTime');
export const currentDate = document.getElementById('currentDate');

export let graphCheckboxes = document.querySelectorAll('input[name=graphDataTypeCheckbox]');
export let drawGraphsButton = document.getElementById('drawGraphsButton');


export const weatherForecastDayDiv = document.querySelectorAll('weatherForecastDayDiv');


export const updateWeatherButton = document.getElementById('updateWeatherButton');
export const chooseDegreeUnitsRadios = document.querySelectorAll('input[name=\'chooseDegreeUnits\']');
export const weatherForecastDisplay = document.getElementById('weatherForecastDisplay');


export const canvas = document.getElementById('weatherGraph');
export const ctx = canvas.getContext('2d');

export const graphTemperatureMarksBar = document.getElementById('graphTemperatureMarksBar');
export let canvasWidth = canvas.width = document.body.offsetWidth - graphTemperatureMarksBar.offsetWidth;
export let canvasHeight = canvas.height = 350;
export let canvasHeightWithBorders = canvasHeight - 40;

export function updateCanvasDimensions() {
    canvasWidth = canvas.width = document.body.offsetWidth - graphTemperatureMarksBar.offsetWidth;
    canvasHeight = canvas.height = 200 + window.innerHeight / 5;
    canvasHeightWithBorders = canvasHeight - 40;

}

export const canvasWrapper = document.getElementById('canvasWrapper');
export const graphDetailsBar = document.getElementById('graphDetailsBar');
export const graphDatesBar = document.getElementById('graphDatesBar');

// export let interval;

export const overlayMask = document.getElementById('overlayMask');
export const closeButton = document.getElementById('closeButton');

export const dayDetailsDisplay = document.getElementById('dayDetailsDisplay');

