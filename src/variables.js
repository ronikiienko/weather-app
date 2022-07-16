export const citySuggestions = document.getElementById('citySuggestions');
export const chooseCityInput = document.getElementById('searchCity');
export const detectPositionButton = document.getElementById('detectPositionButton');
export const myPositionDisplay = document.getElementById('myPositionDisplay');


export const currentWeatherPictureDiv = document.getElementById('currentWeatherPictureDiv');
export const currentSkyDescriptionDiv = document.getElementById('currentSkyDescriptionDiv');
export const currentWeatherDisplay = document.getElementById('currentWeatherDisplay');
export const currentTemperatureDisplayDiv = document.getElementById('currentTemperatureDisplayDiv');
export const currentWindSpeedDiv = document.getElementById('currentWindSpeedDiv');
export const currentTime = document.getElementById('currentTime');
export const currentDate = document.getElementById('currentDate');
export const currentFeelsLikeDiv = document.getElementById('currentFeelsLikeDiv');
export const currentHumidityDiv = document.getElementById('currentHumidityDiv');
export const currentDewPointDiv = document.getElementById('currentDewPointDiv');
export const currentPressureDiv = document.getElementById('currentPressureDiv');
export const weatherDisplay = document.getElementById('weatherDisplay');

export let graphCheckboxes = document.querySelectorAll('input[name=graphDataTypeCheckbox]');
export const graphCheckboxesIds = [];
for (let graphCheckbox of graphCheckboxes) {
    graphCheckboxesIds.push(graphCheckbox.id);
}
export let drawGraphsButton = document.getElementById('drawGraphsButton');


export const weatherForecastDayDiv = document.querySelectorAll('weatherForecastDayDiv');


export const updateWeatherButton = document.getElementById('updateWeatherButton');
export const chooseDegreeUnitRadios = document.querySelectorAll('input[name=\'chooseDegreeUnit\']');
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


export const dayDetailsDisplay = document.getElementById('dayDetailsDisplay');

