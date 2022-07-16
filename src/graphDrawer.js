import {
    averageFromTwoArrays,
    disableEnableGraphCheckboxes,
    getDayInfoForDate,
    getMaxMinWeeklyTemperature,
    getWeatherByPosition,
    wait,
} from './utils';
import {
    canvasHeight,
    canvasHeightWithBorders,
    canvasWidth,
    ctx,
    graphDatesBar,
    graphTemperatureMarksBar,
} from './variables';


function handleGraphCheckboxesToDraw(checkedGraphDataTypeCheckbox, weather) {
    let dataToDrawInfo = null;
    let canvasHeightWithBorders = canvasHeight - 40;

    if (checkedGraphDataTypeCheckbox === 'graphDailyMaxTemperatureCheckbox') {
        dataToDrawInfo = {
            data: weather.daily.temperature_2m_max,
            color: 'rgba(255,0,0)',
        };
    } else if (checkedGraphDataTypeCheckbox === 'graphDailyMinTemperatureCheckbox') {
        dataToDrawInfo = {
            data: weather.daily.temperature_2m_min,
            color: 'rgba(0,0,255)',
        };
    } else if (checkedGraphDataTypeCheckbox === 'graphDailyAverageTemperatureCheckbox') {
        const arr1 = weather.daily.temperature_2m_min;
        const arr2 = weather.daily.temperature_2m_max;
        let arrData = averageFromTwoArrays(arr1, arr2);
        dataToDrawInfo = {
            data: arrData,
            color: 'rgba(255,255,0)',
        };
    } else if (checkedGraphDataTypeCheckbox === 'graphHourlyTemperatureCheckbox') {
        dataToDrawInfo = {
            data: weather.hourly.temperature_2m,
            color: 'rgb(0,255,0)',
        };
    }
    return dataToDrawInfo;
}



function drawGraphDates(weather) {
    const graphDateDivs = graphDatesBar.children;
    for (let graphDateDiv of graphDateDivs) {
        let numberInDateArray = Number(graphDateDiv.id.slice(12));
        let graphDateInfo = getDayInfoForDate(weather.daily.time[numberInDateArray]);
        let graphDateInfoString;
        if (numberInDateArray === 0) {
            graphDateInfoString = 'Today';
        } else if (numberInDateArray === 1) {
            graphDateInfoString = 'Tomorrow';
        } else {
            graphDateInfoString = `${graphDateInfo.dayOfWeekShort}, ${graphDateInfo.monthShort} ${graphDateInfo.dayOfMonth}`;
        }
        graphDateDiv.textContent = graphDateInfoString;
    }
}

function drawGraphTemperatureMarks(weather) {
    const temp = getMaxMinWeeklyTemperature(weather);
    const graphTempMarksDivs = graphTemperatureMarksBar.children;
    graphTempMarksDivs[0].textContent = `${temp.max}°`;
    graphTempMarksDivs[1].textContent = `${temp.avgHigher}°`;
    graphTempMarksDivs[2].textContent = `${temp.avg}`;
    graphTempMarksDivs[3].textContent = `${temp.avgLower}°`;
    graphTempMarksDivs[4].textContent = `${temp.min}`;
}

async function drawGraphByDataType(checkedGraphDataTypeCheckbox, weather) {
    let dataToDrawInfo = handleGraphCheckboxesToDraw(checkedGraphDataTypeCheckbox, weather);
    const minMax = getMaxMinWeeklyTemperature(weather);
    const maxValue = minMax.max;
    const minValue = minMax.min;

    const amplitude = maxValue - minValue;
    const numberOfPoints = dataToDrawInfo.data.length;

    ctx.beginPath();

    ctx.strokeStyle = dataToDrawInfo.color;
    ctx.lineWidth = 3;

    for (let i = 0; i <= numberOfPoints; i++) {

        let previousYRatio = (dataToDrawInfo.data[i - 1] - minValue) / amplitude;
        let yRatio = (dataToDrawInfo.data[i] - minValue) / amplitude;
        if (i === 0) {
            ctx.moveTo(0, canvasHeightWithBorders - canvasHeightWithBorders * yRatio + 20);
        } else {
            if (checkedGraphDataTypeCheckbox === 'graphHourlyTemperatureCheckbox') {
                ctx.lineTo(canvasWidth / (numberOfPoints - 1) * i, canvasHeightWithBorders - canvasHeightWithBorders * yRatio + 20);
            } else {
                ctx.lineTo(canvasWidth / (numberOfPoints) * i, canvasHeightWithBorders - canvasHeightWithBorders * previousYRatio + 20);
                ctx.moveTo(canvasWidth / (numberOfPoints) * i, canvasHeightWithBorders - canvasHeightWithBorders * yRatio + 20);
            }

        }
        await wait(1);

        ctx.stroke();
    }
    ctx.moveTo(0, 0);
    ctx.closePath();
}

export let isDrawing;
export async function drawGraphs() {
    if (isDrawing === true) {
        return;
    }
    isDrawing = true;
    const checkedGraphCheckboxesIds = JSON.parse(localStorage.getItem('checkedGraphDataTypeCheckboxes'));
    if (checkedGraphCheckboxesIds === null || localStorage.getItem('position') === null) {
        isDrawing = false;
        return;
    }
    disableEnableGraphCheckboxes();
    const weather = await getWeatherByPosition(JSON.parse(localStorage.getItem('position')));
    drawGraphDates(weather);
    drawGraphTemperatureMarks(weather);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let checkedGraphCheckboxId of checkedGraphCheckboxesIds) {
        await drawGraphByDataType(checkedGraphCheckboxId, weather);

    }
    disableEnableGraphCheckboxes();
    isDrawing = false;
}

// TODO why graph first dayily's are not transparent
// TODO resize event not draw graph when one already is in process