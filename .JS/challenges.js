"use strict";
//contains code for setting up general challenge, e.g. setting up
//create a set of (x, y) points starting at (0, LAUNCH_HEIGHT) and ending when y < 0
const Challenge1 = () => {
    const points = [];
    let t = 0;
    const angleRadians = ANGLE * Math.PI / 180;
    const horizontalVelocity = LAUNCH_SPEED * Math.cos(angleRadians);
    const verticalVelocity = LAUNCH_SPEED * Math.sin(angleRadians);
    while (true) {
        //compute horizontal and vertical displacements at time t
        //s_x = vt
        const x = horizontalVelocity * t;
        //s_y = ut + 0.5at^2 + c, where c = LAUNCH_HEIGHT
        const y = verticalVelocity * t + 0.5 * G * t ** 2 + LAUNCH_HEIGHT;
        if (y < 0) { //below ground level
            break;
        }
        points.push([x, y]);
        t += TIME_STEP;
    }
    //calculate new view window based on max X and max Y of these points
    MAX_X = Math.round(Math.max(15, ...points.map((point) => { return point[0] + 2; })));
    MAX_Y = Math.round(Math.max(15, ...points.map((point) => { return point[1] + 2; })));
    CALCULATE_CONVERSION_FACTORS();
    SetTitle("Challenge 1 (Parabola calculated via Time Parameter)");
    canvas.clearCanvas();
    DrawAxis();
    DrawLine(points, "blue", 10);
};
const Challenge2 = () => {
    //instead of using t as a parameter, we will elimate from this system and form an equation linking x and y
    // (1): x = vt
    // (2): y = ut + 0.5at^2 + h
    // (1): t = x/v
    // (1) -> (2) (*): y = ux/v + 0.5a(x/v)^2 + h = (u/v)x + (a/2v^2)x^2 + h
    //(*) provides the equation linking y and x; we can calculate the maximum horizontal range by determining the x at which y = 0 (only interested in first root)
    //Solve for y = 0 using quadratic formula where a = acc/2v^2, b = u/v, c = h
    const angleRadians = ANGLE * Math.PI / 180;
    const acc = G;
    const v = LAUNCH_SPEED * Math.cos(angleRadians); //horizontal velocity
    const u = LAUNCH_SPEED * Math.sin(angleRadians); //vertical velocity
    const h = LAUNCH_HEIGHT;
    const a = acc / (2 * v ** 2);
    const b = u / v;
    const c = h;
    //interested specifically in positive root since our model always starts at or after first root
    const root = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
    //plot all x coordinates from 0 to root
    const points = [];
    const y = (x) => {
        return b * x + a * x ** 2 + c;
    };
    for (let x = 0; x <= root; x += X_STEP) {
        points.push([x, y(x)]);
    }
    MAX_X = Math.round(Math.max(15, ...points.map((point) => { return point[0] + 2; })));
    MAX_Y = Math.round(Math.max(15, ...points.map((point) => { return point[1] + 2; })));
    CALCULATE_CONVERSION_FACTORS();
    //challenge 2 also requires us to plot the apogee (point with greatest y coordinate)
    //the apogee is just the turning point, and thus will occur when x = -b/2a and y = y(-b/2a)
    const apogeeX = -b / (2 * a);
    const apogee = [apogeeX, y(apogeeX)];
    const pointOffset = 10; //line gets slightly raised due to thickness, so offset point to preven the point from looking out of place
    SetTitle("Challenge 2 (Parabola calculated via Analytic Method)");
    canvas.clearCanvas();
    DrawAxis();
    DrawLine(points, "blue", 10);
    PlotPoint(apogee, "orange", "Apogee", { x: 0, y: pointOffset / 2 });
};
const CURRENT_CHALLENGE = Challenge2;
