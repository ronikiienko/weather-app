import {averageFromTwoArrays, getWeatherByPosition} from './utils';
import {canvasHeight, canvasWidth, ctx} from './variables';


export async function drawGraphs() {
    const weather = await getWeatherByPosition(JSON.parse(localStorage.getItem('position')));
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const checkedGraphCheckboxesIds = JSON.parse(localStorage.getItem('checkedGraphDataTypeCheckboxes'));
    for (let checkedGraphCheckboxId of checkedGraphCheckboxesIds) {
        drawGraphByDataType(checkedGraphCheckboxId);

    }

    function drawGraphByDataType(checkedGraphDataTypeCheckbox) {
        let dataToDrawInfo = null;
        let canvasHeightWithBorders = canvasHeight - 40;
        // let canvasHeightFromTop = 20;

        if (checkedGraphDataTypeCheckbox === 'graphDailyMaxTemperatureCheckbox') {
            dataToDrawInfo = {
                data: weather.daily.temperature_2m_max,
                color: 'red',
                // minMax: [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min]
            };
        } else if (checkedGraphDataTypeCheckbox === 'graphDailyMinTemperatureCheckbox') {
            dataToDrawInfo = {
                data: weather.daily.temperature_2m_min,
                color: 'blue',
                // minMax: [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min]
            };
        } else if (checkedGraphDataTypeCheckbox === 'graphDailyAverageTemperatureCheckbox') {
            const arr1 = weather.daily.temperature_2m_min;
            const arr2 = weather.daily.temperature_2m_max;
            let arrData = averageFromTwoArrays(arr1, arr2);
            dataToDrawInfo = {
                data: arrData,
                color: 'yellow',
                // minMax: [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min]
            };
        } else if (checkedGraphDataTypeCheckbox === 'graphHourlyTemperatureCheckbox') {
            dataToDrawInfo = {
                data: weather.hourly.temperature_2m,
                color: 'green',
                // minMax: [weather.hourly.temperature_2m, weather.hourly.temperature_2m]
            };
        }
        const minMax = [weather.daily.temperature_2m_max, weather.daily.temperature_2m_min];
        const maxValue = Math.max(...minMax[0]);
        const minValue = Math.min(...minMax[1]);

        const amplitude = maxValue - minValue;
        const numberOfPoints = dataToDrawInfo.data.length;

        ctx.beginPath();


        for (let i = 0; i <= numberOfPoints; i++) {
            let previousYRatio = (dataToDrawInfo.data[i - 1] - minValue) / amplitude;
            let yRatio = (dataToDrawInfo.data[i] - minValue) / amplitude;
            if (i === 0) {
                ctx.moveTo(0, canvasHeightWithBorders - canvasHeightWithBorders * yRatio);
            } else {
                if (checkedGraphDataTypeCheckbox === 'graphHourlyTemperatureCheckbox') {
                    ctx.lineTo(canvasWidth / (numberOfPoints - 1) * i, canvasHeightWithBorders - canvasHeightWithBorders * yRatio + 20);
                } else {
                    ctx.lineTo(canvasWidth / (numberOfPoints) * i, canvasHeightWithBorders - canvasHeightWithBorders * previousYRatio + 20);
                    ctx.lineTo(canvasWidth / (numberOfPoints) * i, canvasHeightWithBorders - canvasHeightWithBorders * yRatio + 20);
                }

            }
        }

        ctx.moveTo(0, 0);
        ctx.lineWidth = 22;

        ctx.closePath();

        ctx.strokeStyle = dataToDrawInfo.color;

        ctx.stroke();


    }


}