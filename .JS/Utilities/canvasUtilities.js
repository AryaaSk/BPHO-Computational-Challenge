"use strict";
//Canvas Utilites - from Aryaa3D (https://github.com/AryaaSk/3D-Engine/blob/master/Source/aryaa3D.ts)
let dpi = window.devicePixelRatio;
class Canvas {
    canvas = undefined;
    c = undefined;
    canvasWidth = 0;
    canvasHeight = 0;
    linkCanvas = (canvasID) => {
        this.canvas = document.getElementById(canvasID);
        this.c = this.canvas.getContext('2d');
        this.canvasHeight = document.getElementById(canvasID).getBoundingClientRect().height; //Fix blury lines
        this.canvasWidth = document.getElementById(canvasID).getBoundingClientRect().width;
        this.canvas.setAttribute('height', String(this.canvasHeight * dpi));
        this.canvas.setAttribute('width', String(this.canvasWidth * dpi));
        document.body.onresize = () => {
            this.linkCanvas(canvasID);
        };
    };
    //ACTUAL DRAWING FUNCTIONS - MatterJS doesn't use ScreenX and ScreenY, so I disabled those functions
    ScreenX = (x) => {
        if (this.c == undefined) {
            console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
            return;
        }
        return ((this.canvasWidth / 2) + x) * dpi;
    };
    ScreenY = (y) => {
        if (this.c == undefined) {
            console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
            return;
        }
        return ((this.canvasHeight / 2) - y) * dpi;
    };
    GridX = (screenX) => {
        return (screenX) - (this.canvasWidth / 2);
    };
    GridY = (screenY) => {
        return -((screenY) - (this.canvasHeight / 2));
    };
    plotPoint = (p, colour, label) => {
        if (this.c == undefined) {
            console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
            return;
        }
        //point will be in format: [x, y]
        this.c.fillStyle = colour;
        this.c.fillRect(this.ScreenX(p[0]), this.ScreenY(p[1]), 10, 10);
        if (label != undefined) {
            this.c.font = `${20 * dpi}px Arial`;
            this.c.fillText(label, this.ScreenX(p[0]) + 10, this.ScreenY(p[1]) + 10);
        }
    };
    drawLine = (p1, p2, colour, thickness) => {
        if (this.c == undefined) {
            console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
            return;
        }
        const linKThickness = (thickness == undefined) ? 1 : thickness;
        //points will be in format: [x, y]
        //I need to convert the javascript x and y into actual grid x and y
        this.c.strokeStyle = colour;
        this.c.lineWidth = linKThickness;
        this.c.beginPath();
        this.c.moveTo(this.ScreenX(p1[0]), this.ScreenY(p1[1]));
        this.c.lineTo(this.ScreenX(p2[0]), this.ScreenY(p2[1]));
        this.c.stroke();
    };
    drawShape = (points, colour, outline, outlineColour) => {
        if (this.c == undefined) {
            console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
            return;
        }
        if (points.length == 2) {
            this.drawLine(points[0], points[1], colour);
            return;
        }
        else if (points.length < 3) {
            console.error("Cannot draw shape, need at least 3 points to draw a shape");
            return;
        }
        this.c.fillStyle = colour;
        this.c.beginPath();
        this.c.moveTo(this.ScreenX(points[0][0]), this.ScreenY(points[0][1]));
        for (let pointsIndex = 1; pointsIndex != points.length; pointsIndex += 1) {
            this.c.lineTo(this.ScreenX(points[pointsIndex][0]), this.ScreenY(points[pointsIndex][1]));
        }
        this.c.closePath();
        this.c.fill();
        if (outline == true) {
            const lineColour = (outlineColour == undefined) ? "#000000" : outlineColour;
            if (outlineColour != undefined) { }
            for (let i = 1; i != points.length; i += 1) {
                this.drawLine(points[i - 1], points[i], lineColour);
            }
            this.drawLine(points[points.length - 1], points[0], lineColour); //to cover the line from last point to first point
        }
    };
    clearCanvas = () => {
        if (this.c == undefined) {
            console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
            return;
        }
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.c.fillStyle = 'white';
        this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    //adding in some intermediary functions
    MIN_X = -1;
    MAX_X = 15;
    MIN_Y = -1;
    MAX_Y = 15;
    midX = 0;
    xScale = 0;
    midY = 0;
    yScale = 0;
    // adding in step x and step y
    xStep = 1;
    yStep = 1;
    CalculateConversionFactors = () => {
        this.midX = 0.5 * (this.MAX_X + this.MIN_X);
        this.xScale = this.canvasWidth / (this.MAX_X - this.MIN_X);
        this.midY = 0.5 * (this.MAX_Y + this.MIN_Y);
        this.yScale = this.canvasHeight / (this.MAX_Y - this.MIN_Y);
    };
    TransformPoint = (point) => {
        const [x, y] = point;
        return [this.xScale * (x - this.midX), this.yScale * (y - this.midY)];
    };
    PlotPoint = (point, colour, label, offset) => {
        const transformedPoint = this.TransformPoint(point);
        if (offset != undefined) {
            transformedPoint[0] += offset.x;
            transformedPoint[1] += offset.y;
        }
        this.plotPoint(transformedPoint, colour, label);
    };
    ////to create animation, we can plot the points one by one with a small delay between each point
    DrawLine = (points, colour, thickness, animationDelay, callback) => {
        if (animationDelay == undefined) {
            for (let i = 0; i < points.length - 1; i += 1) {
                const point1 = this.TransformPoint(points[i]);
                const point2 = this.TransformPoint(points[i + 1]);
                this.drawLine(point1, point2, colour, thickness);
            }
            return;
        }
        //otherwise we create an interval and draw lines with delays in between. we can also return the interval so it can be paused
        let i = 0;
        const interval = setInterval(() => {
            if (i == points.length - 2) {
                clearInterval(interval);
                //once animation is complete, execute callback
                if (callback) {
                    callback();
                }
            }
            const point1 = this.TransformPoint(points[i]);
            const point2 = this.TransformPoint(points[i + 1]);
            this.drawLine(point1, point2, colour, thickness);
            i += 1;
        }, animationDelay);
        return interval;
    };
    DrawAxis = () => {
        //draw the positive x and y axis from 0 to MAX_X/MAX_Y - 1
        this.DrawLine([[0, 0], [this.MAX_X - 1, 0]], "black", 3);
        for (let x = 0; x < this.MAX_X; x += this.xStep) {
            this.PlotPoint([x, 0], "grey", String(x));
        }
        this.DrawLine([[0, 0], [0, this.MAX_Y - 1]], "black", 3);
        // changed from let y = 1 to y = 0 because otherwise the intervals are weird
        for (let y = 0; y < this.MAX_Y; y += this.yStep) {
            this.PlotPoint([0, y], "grey", String(y));
        }
    };
}
const Wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(undefined);
        }, ms);
    });
};
