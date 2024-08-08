"use strict";
const Challenge4Parameters = {
    angle_degrees: 60,
    g: 9.81,
    speed: 10,
    height: 2,
    xStep: 0.01
};
InitSliderForKey(Challenge4Parameters, "angle_degrees", "Launch Angle (X degrees)", { min: 0, max: 90, step: 1 });
InitSliderForKey(Challenge4Parameters, "g", "Gravitational Field Strength (-X ms-2)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge4Parameters, "speed", "Launch Speed (X ms-1)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge4Parameters, "height", "Launch Height (X m)", { min: 0, max: 10, step: 0.1 });
// Function to solve quadratic and linear equations
function solve(a, b, c) {
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
//@ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();
CURRENT_CHALLENGE = () => {
    const g = -Challenge4Parameters.g;
    const h = Challenge4Parameters.height;
    const u = Challenge4Parameters.speed;
    const angle_radians = Challenge4Parameters.angle_degrees * Math.PI / 180;
    const angle_radians_max = Math.asin(1 / (Math.sqrt(2 + ((-2 * g * h) / (u ** 2)))));
    const v_hor = u * Math.cos(angle_radians);
    const v_ver = u * Math.sin(angle_radians);
    const a = g / (2 * v_hor ** 2);
    const b = v_ver / v_hor;
    const c = h;
    const root = solve(a, b, c)[1];
    const v_hor_max = u * Math.cos(angle_radians_max);
    const v_ver_max = u * Math.sin(angle_radians_max);
    const a_max = g / (2 * v_hor_max ** 2);
    const b_max = v_ver_max / v_hor_max;
    const c_max = h;
    const root_max = solve(a_max, b_max, c_max)[1];
    //plot all x coordinates from 0 to root
    const points = [];
    const points_max = [];
    const y = (x) => {
        return a * x ** 2 + b * x + c;
    };
    const y_max = (x) => {
        return a_max * x ** 2 + b_max * x + c_max;
    };
    for (let x = 0; x <= root; x += Challenge4Parameters.xStep) {
        const y_crd = y(x);
        points.push([x, y_crd]);
        //update maxY
        canvas.MAX_Y = Math.max(15, y_crd + 1);
    }
    for (let x = 0; x <= root_max; x += Challenge4Parameters.xStep) {
        const y_crd = y_max(x);
        points_max.push([x, y_crd]);
        //update maxY
        canvas.MAX_Y = Math.max(15, y_crd + 1);
    }
    canvas.MAX_X = Math.max(15, root_max + 1);
    canvas.CalculateConversionFactors();
    canvas.clearCanvas();
    canvas.DrawAxis();
    canvas.DrawLine(points, "blue", 10);
    canvas.DrawLine(points_max, "orange", 10);
};
CURRENT_CHALLENGE();
