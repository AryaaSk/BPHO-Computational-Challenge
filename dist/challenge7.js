"use strict";
const Challenge7Parameters = {
    theta: 85,
    u: 10,
    g: 9.81,
    timeStep: 0.001
};
InitSliderForKey(Challenge7Parameters, "theta", "Launch Angle (X degrees)", { min: 0, max: 90, step: 1 });
InitSliderForKey(Challenge7Parameters, "u", "Launch Speed (X ms-1)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge7Parameters, "g", "Gravitational Field Strength (-X ms-2)", { min: 1, max: 15, step: 0.1 });
//@ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();
const SolveStationaryPoints = () => {
    //there will be maximum and minimum in range against time only if sin(theta) > 2root2 / 3
    const { theta, u, g } = Challenge7Parameters;
    const thetaRadians = theta * Math.PI / 180;
    const sinTheta = Math.sin(thetaRadians);
    if (sinTheta <= (Math.sqrt(8) / 3)) {
        return [];
    }
    //otherwise, find the times of the minimum and maximum respectively and return as an array
    const maxTime = 3 * u / (2 * g) * (sinTheta - Math.sqrt(sinTheta ** 2 - 8 / 9));
    const minTime = 3 * u / (2 * g) * (sinTheta + Math.sqrt(sinTheta ** 2 - 8 / 9));
    return [maxTime, minTime];
};
// Function to solve quadratic and linear equations taken from #3
function SolveQuadratic(a, b, c) {
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
const CalculateTimeRange = (endVerticalDisplacement) => {
    //since the vertical displacement is what determines when our graph ends, we need to know the time range to plot through
    //SUVAT: S = endVerticalDisplacement, u = u * sin(theta), a = -g, t: ?
    //s = ut + 1/2at^2
    //1/2at^2 + ut - s = 0
    const { theta, u, g } = Challenge7Parameters;
    const thetaRadians = theta * Math.PI / 180;
    const roots = SolveQuadratic(1 / 2 * -1 * g, u * Math.sin(thetaRadians), -1 * endVerticalDisplacement);
    return roots[1]; //always return second root
};
const RangeTime = () => {
    //for the given inputs, we need to calculate the times at which there is a maximum and and minimum
    //https://www.bpho.org.uk/bpho/computational-challenge/BPhO_CompPhys2024_Projectilesa.pdf
    const { theta, u, g } = Challenge7Parameters;
    const thetaRadians = theta * Math.PI / 180;
    const R = (t) => {
        return Math.sqrt(u ** 2 * t ** 2 - g * t ** 3 * u * Math.sin(thetaRadians) + 1 / 4 * g ** 2 * t ** 4);
    };
    const [maxTime, minTime] = SolveStationaryPoints();
    //now just plot R against t and put points at these stationary points
    const endTime = CalculateTimeRange(-8);
    const points = [];
    for (let t = 0; t < endTime; t += Challenge7Parameters.timeStep) {
        points.push([t, R(t)]);
    }
    PlotPoints(points, "orange");
    const pointOffset = 10;
    canvas.PlotPoint([maxTime, R(maxTime)], "purple", undefined, { x: 0, y: pointOffset / 2 });
    canvas.PlotPoint([minTime, R(minTime)], "green", undefined, { x: 0, y: pointOffset / 2 });
    InitAxisTitle("t/s", "range r/m");
    AddKey([
        { colour: "orange", label: "Range against Time" },
        { colour: "purple", label: "Maximum" },
        { colour: "green", label: "Minimum" },
    ]);
};
const Trajectory = () => {
    //plot the trajectory of the particle, and place points at the maximum and minimum range
    //we will simply plot the projectile with parametric equations
    const { theta, u, g } = Challenge7Parameters;
    const [uh, uv] = SplitVelocityComponents(u, theta);
    const Y = (t) => {
        return uv * t + 1 / 2 * -1 * g * t ** 2;
    };
    const X = (t) => {
        return uh * t;
    };
    const [maxTime, minTime] = SolveStationaryPoints();
    const endTime = CalculateTimeRange(-8);
    const points = [];
    for (let t = 0; t < endTime; t += Challenge7Parameters.timeStep) {
        points.push([X(t), Y(t)]);
    }
    PlotPoints(points, "lightblue");
    const pointOffset = 10;
    canvas.PlotPoint([X(maxTime), Y(maxTime)], "purple", undefined, { x: 0, y: pointOffset / 2 });
    canvas.PlotPoint([X(minTime), Y(minTime)], "green", undefined, { x: 0, y: pointOffset / 2 });
    InitAxisTitle("x/m", "y/m");
    AddKey([
        { colour: "lightBlue", label: "Projectile Path" },
        { colour: "purple", label: "Maximum Range" },
        { colour: "green", label: "Minimum Range" },
    ]);
};
const PlotPoints = (points, colour) => {
    canvas.MIN_X = -0.2;
    canvas.MIN_Y = -1;
    ;
    canvas.MAX_X = 1;
    canvas.MAX_Y = 1;
    canvas.MaximiseViewWindow(points);
    canvas.AdjustIntervals();
    canvas.clearCanvas();
    canvas.DrawAxis();
    canvas.DrawLine(points, colour, 5);
};
InitChallengeToggle([
    { buttonID: "rangeTime", challengeCallback: RangeTime },
    { buttonID: "trajectory", challengeCallback: Trajectory },
]);
CURRENT_CHALLENGE = RangeTime;
setTimeout(CURRENT_CHALLENGE);
