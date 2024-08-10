"use strict";
const Challenge124Parameters = {
    angle: 30,
    g: 9.8,
    speed: 5,
    height: 3,
    timeStep: 0.001,
    xStep: 0.001
};
InitSliderForKey(Challenge124Parameters, "angle", "Launch Angle (X degrees)", { min: 0, max: 90, step: 1 });
InitSliderForKey(Challenge124Parameters, "g", "Gravitational Field Strength (-X ms-2)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge124Parameters, "speed", "Launch Speed (X ms-1)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge124Parameters, "height", "Launch Height (X m)", { min: 0, max: 10, step: 0.1 });
InitInfo("Description of challenge 1, 2 and 4");
//@ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();
//Challenge 1 code
const Challenge1 = () => {
    const points = [];
    let t = 0;
    const angleRadians = Challenge124Parameters.angle * Math.PI / 180;
    const horizontalVelocity = Challenge124Parameters.speed * Math.cos(angleRadians);
    const verticalVelocity = Challenge124Parameters.speed * Math.sin(angleRadians);
    while (true) {
        //compute horizontal and vertical displacements at time t
        //s_x = vt
        const x = horizontalVelocity * t;
        //s_y = ut + 0.5at^2 + c, where c = LAUNCH_HEIGHT
        const y = verticalVelocity * t + 0.5 * -Challenge124Parameters.g * t ** 2 + Challenge124Parameters.height;
        if (y < 0) { //below ground level
            break;
        }
        points.push([x, y]);
        t += Challenge124Parameters.timeStep;
    }
    canvas.MAX_X = 15;
    canvas.MAX_Y = 15;
    canvas.MaximiseViewWindow(points);
    canvas.AdjustIntervals();
    canvas.clearCanvas();
    canvas.DrawAxis();
    canvas.DrawLine(points, "blue", 5);
};
const Challenge2 = () => {
    //instead of using t as a parameter, we will elimate from this system and form an equation linking x and y
    // (1): x = vt
    // (2): y = ut + 0.5at^2 + h
    // (1): t = x/v
    // (1) -> (2) (*): y = ux/v + 0.5a(x/v)^2 + h = (u/v)x + (a/2v^2)x^2 + h
    //(*) provides the equation linking y and x; we can calculate the maximum horizontal range by determining the x at which y = 0 (only interested in first root)
    //Solve for y = 0 using quadratic formula where a = acc/2v^2, b = u/v, c = h
    const angleRadians = Challenge124Parameters.angle * Math.PI / 180;
    const acc = -Challenge124Parameters.g;
    const v = Challenge124Parameters.speed * Math.cos(angleRadians); //horizontal velocity
    const u = Challenge124Parameters.speed * Math.sin(angleRadians); //vertical velocity
    const h = Challenge124Parameters.height;
    const a = acc / (2 * v ** 2);
    const b = u / v;
    const c = h;
    //interested specifically in positive root since our model always starts at or after first root
    const root = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
    //plot all x coordinates from 0 to root
    const points = [];
    const Y = (x) => {
        return b * x + a * x ** 2 + c;
    };
    for (let x = 0; x <= root; x += Challenge124Parameters.xStep) {
        const y = Y(x);
        points.push([x, y]);
    }
    canvas.MAX_X = 15;
    canvas.MAX_Y = 15;
    canvas.MaximiseViewWindow(points);
    canvas.AdjustIntervals();
    //challenge 2 also requires us to plot the apogee (point with greatest y coordinate)
    //the apogee is just the turning point, and thus will occur when x = -b/2a and y = y(-b/2a)
    const apogeeX = -b / (2 * a);
    const apogee = [apogeeX, Y(apogeeX)];
    const pointOffset = 10; //line gets slightly raised due to thickness, so offset point to preven the point from looking out of place
    canvas.clearCanvas();
    canvas.DrawAxis();
    canvas.DrawLine(points, "blue", 5);
    canvas.PlotPoint(apogee, "orange", "Apogee", { x: 0, y: pointOffset / 2 });
};
// Function to solve quadratic and linear equations
//@ts-expect-error duplicate from Legacy/Challenge4.ts
function solve_4(a, b, c) {
    if (a === 0) {
        if (b !== 0) {
            return [-c / b];
        }
        else {
            throw new Error("a and b can't be 0");
        }
    }
    const discriminant = (b * b) - (4 * a * c);
    if (discriminant < 0) {
        return [];
    }
    else if (discriminant === 0) {
        const root = -b / (2 * a);
        return [root];
    }
    else {
        const root1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        return root1 < root2 ? [root1, root2] : [root2, root1];
    }
}
const Challenge4 = () => {
    const g = -Challenge124Parameters.g;
    const h = Challenge124Parameters.height;
    const u = Challenge124Parameters.speed;
    const angle_radians = Challenge124Parameters.angle * Math.PI / 180;
    const angle_radians_max = Math.asin(1 / (Math.sqrt(2 + ((-2 * g * h) / (u ** 2)))));
    const v_hor = u * Math.cos(angle_radians);
    const v_ver = u * Math.sin(angle_radians);
    const a = g / (2 * v_hor ** 2);
    const b = v_ver / v_hor;
    const c = h;
    const root = solve_4(a, b, c)[1];
    const v_hor_max = u * Math.cos(angle_radians_max);
    const v_ver_max = u * Math.sin(angle_radians_max);
    const a_max = g / (2 * v_hor_max ** 2);
    const b_max = v_ver_max / v_hor_max;
    const c_max = h;
    const root_max = solve_4(a_max, b_max, c_max)[1];
    //plot all x coordinates from 0 to root
    const points = [];
    const points_max = [];
    const y = (x) => {
        return a * x ** 2 + b * x + c;
    };
    const y_max = (x) => {
        return a_max * x ** 2 + b_max * x + c_max;
    };
    for (let x = 0; x <= root; x += Challenge124Parameters.xStep) {
        const y_crd = y(x);
        points.push([x, y_crd]);
    }
    for (let x = 0; x <= root_max; x += Challenge124Parameters.xStep) {
        const y_crd = y_max(x);
        points_max.push([x, y_crd]);
    }
    canvas.MAX_X = 15;
    canvas.MAX_Y = 15;
    canvas.MaximiseViewWindow(points);
    canvas.MaximiseViewWindow(points_max);
    canvas.AdjustIntervals();
    canvas.clearCanvas();
    canvas.DrawAxis();
    canvas.DrawLine(points, "blue", 5);
    canvas.DrawLine(points_max, "orange", 5);
    AddKey([
        { colour: "blue", label: "Projectile" },
        { colour: "orange", label: "Max range" },
    ]);
};
//since each challenge builds upon the other one, we can switch between using some form of toggle switch
InitChallengeToggle([
    { buttonID: "challenge1", challengeCallback: Challenge1 },
    { buttonID: "challenge2", challengeCallback: Challenge2 },
    { buttonID: "challenge4", challengeCallback: Challenge4 },
]);
InitAxisTitle("x/m", "y/m");
CURRENT_CHALLENGE = Challenge1;
setTimeout(CURRENT_CHALLENGE);
