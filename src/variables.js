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


export const weatherForecastDayDiv = document.querySelectorAll('weatherForecastDayDiv');


export const updateWeatherButton = document.getElementById('updateWeatherButton');
export const chooseDegreeUnitsRadios = document.querySelectorAll('input[name=\'chooseDegreeUnits\']');
export const weatherForecastDisplay = document.getElementById('weatherForecastDisplay');


export const canvas = document.getElementById('weatherGraph');
export const ctx = canvas.getContext('2d');

export const canvasWidth = canvas.width = document.body.clientWidth;
export const canvasHeight = canvas.height = 400;
export const canvasHeightWithBorders = canvasHeight - 40;
export const canvasWrapper = document.getElementById('canvasWrapper');
export const graphDetailsBar = document.getElementById('graphDetailsBar');