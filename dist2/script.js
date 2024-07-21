"use strict";
const canvas = new Canvas();
canvas.linkCanvas("canvas");
let ANGLE = 30; //angle to the horizontal [degrees]
let G = -9.81; //graviational field strength [ms-2]
let LAUNCH_SPEED = 10; //[ms-1]
let LAUNCH_HEIGHT = 3; //[m]
let TIME_STEP = 0.001; //time interval between samples [s] for challenge 1
let X_STEP = 0.001; //[m] for challenge 2
//View window
let MIN_X = -1;
let MAX_X = 15;
let MIN_Y = -1;
let MAX_Y = 15;
//implement bounds using a conversion
let [midX, xScale, midY, yScale] = [0, 0, 0, 0];
const CALCULATE_CONVERSION_FACTORS = () => {
    midX = 0.5 * (MAX_X + MIN_X);
    xScale = canvas.canvasWidth / (MAX_X - MIN_X);
    midY = 0.5 * (MAX_Y + MIN_Y);
    yScale = canvas.canvasHeight / (MAX_Y - MIN_Y);
};
CALCULATE_CONVERSION_FACTORS();
const TransformPoint = (point) => {
    const [x, y] = point;
    return [xScale * (x - midX), yScale * (y - midY)];
};
const PlotPoint = (point, colour, label, offset) => {
    const transformedPoint = TransformPoint(point);
    if (offset != undefined) {
        transformedPoint[0] += offset.x;
        transformedPoint[1] += offset.y;
    }
    canvas.plotPoint(transformedPoint, colour, label);
};
const DrawLine = (points, colour, thickness) => {
    for (let i = 0; i < points.length - 1; i += 1) {
        const point1 = TransformPoint(points[i]);
        const point2 = TransformPoint(points[i + 1]);
        canvas.drawLine(point1, point2, colour, thickness);
    }
};
const DrawAxis = () => {
    //draw the positive x and y axis from 0 to MAX_X/MAX_Y - 1
    DrawLine([[0, 0], [MAX_X - 1, 0]], "black", 3);
    for (let x = 0; x != MAX_X; x += 1) {
        PlotPoint([x, 0], "grey", String(x));
    }
    DrawLine([[0, 0], [0, MAX_Y - 1]], "black", 3);
    for (let y = 1; y != MAX_Y; y += 1) {
        PlotPoint([0, y], "grey", String(y));
    }
};
//UI elements
const E = (id) => {
    return document.getElementById(id);
};
const titleElement = E("title");
const SetTitle = (title) => {
    titleElement.innerText = title;
};
const InitListeners = () => {
    const angleLabel = E("angleLabel");
    const angleSlider = E("angle");
    angleSlider.addEventListener('input', () => {
        ANGLE = Number(angleSlider.value);
        angleLabel.innerText = `Launch Angle (${ANGLE} degrees)`;
        CURRENT_CHALLENGE();
    });
    const gLabel = E("gLabel");
    const gSlider = E("g");
    gSlider.addEventListener('input', () => {
        G = -1 * Number(gSlider.value);
        gLabel.innerText = `Gravitational Field Strength (${G} ms-2)`;
        CURRENT_CHALLENGE();
    });
    const speedLabel = E("speedLabel");
    const speedSlider = E("speed");
    speedSlider.addEventListener('input', () => {
        LAUNCH_SPEED = Number(speedSlider.value);
        speedLabel.innerText = `Launch Speed (${LAUNCH_SPEED} ms-1)`;
        CURRENT_CHALLENGE();
    });
    const heightLabel = E("heightLabel");
    const heightSlider = E("height");
    heightSlider.addEventListener('input', () => {
        LAUNCH_HEIGHT = Number(heightSlider.value);
        heightLabel.innerText = `Launch Height (${LAUNCH_HEIGHT} m)`;
        CURRENT_CHALLENGE();
    });
};
InitListeners();
CURRENT_CHALLENGE(); //change challenge displayed within challenges.ts
