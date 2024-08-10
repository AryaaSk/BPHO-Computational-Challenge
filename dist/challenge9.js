"use strict";
const Challenge9Parameters = {
    angle: 30,
    g: 9.8,
    speed: 20,
    height: 2,
    dragCoefficient: 1,
    crossSectionalArea: 0.0079,
    airDensity: 1,
    mass: 0.1,
    timeStep: 0.001
};
InitSliderForKey(Challenge9Parameters, "angle", "Launch Angle (X degrees)", { min: 0, max: 90, step: 1 });
InitSliderForKey(Challenge9Parameters, "g", "Gravitational Field Strength (-X ms-2)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge9Parameters, "speed", "Launch Speed (X ms-1)", { min: 1, max: 30, step: 1 });
InitSliderForKey(Challenge9Parameters, "height", "Launch Height (X m)", { min: 0, max: 10, step: 0.1 });
InitSliderForKey(Challenge9Parameters, "dragCoefficient", "Drag Coefficient (X)", { min: 0, max: 1, step: 0.1 });
InitSliderForKey(Challenge9Parameters, "crossSectionalArea", "Cross Sectional Area (X m2)", { min: 0.001, max: 0.01, step: 0.001 });
InitSliderForKey(Challenge9Parameters, "airDensity", "Air Density (X kgm-3)", { min: 0.5, max: 5, step: 0.5 });
InitSliderForKey(Challenge9Parameters, "mass", "Object Mass (X kg)", { min: 0.1, max: 10, step: 0.1 });
//@ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();
CURRENT_CHALLENGE = () => {
    //we will simply implement the air resistance case, as the drag-free model is a special case of the air resistance free case
    const GeneratePoints = (theta, u, h, g, cD, A, p, m, deltaT) => {
        const k = 0.5 * cD * p * A / m;
        //initial conditions, using method showcased within brief
        let [x, y] = [0, h];
        let [vx, vy] = SplitVelocityComponents(u, theta);
        const CalculateAccelerationComponents = (vx, vy) => {
            const v = Math.sqrt(vx ** 2 + vy ** 2);
            const ax = -vx / v * k * v ** 2;
            const ay = -g - vy / v * k * v ** 2;
            return [ax, ay];
        };
        let [ax, ay] = CalculateAccelerationComponents(vx, vy);
        const points = [];
        while (y > 0) {
            x += vx * deltaT + 0.5 * ax * deltaT ** 2;
            y += vy * deltaT + 0.5 * ay * deltaT ** 2;
            vx += ax * deltaT;
            vy += ay * deltaT;
            [ax, ay] = CalculateAccelerationComponents(vx, vy);
            points.push([x, y]);
        }
        return points;
    };
    const p = Challenge9Parameters;
    const airResistancePoints = GeneratePoints(p.angle, p.speed, p.height, p.g, p.dragCoefficient, p.crossSectionalArea, p.airDensity, p.mass, p.timeStep);
    const dragFreePoints = GeneratePoints(p.angle, p.speed, p.height, p.g, 0, p.crossSectionalArea, p.airDensity, p.mass, p.timeStep);
    //find the 'apogee' for both air resistance and drag free points
    let apogeeAirResistance = [0, 0];
    let apogeeDragFree = [0, 0];
    for (const point of airResistancePoints) {
        const y = point[1];
        if (y >= apogeeAirResistance[1]) {
            apogeeAirResistance = point;
        }
    }
    for (const point of dragFreePoints) {
        const y = point[1];
        if (y >= apogeeDragFree[1]) {
            apogeeDragFree = point;
        }
    }
    canvas.MAX_X = 15;
    canvas.MAX_Y = 15;
    canvas.MaximiseViewWindow(airResistancePoints);
    canvas.MaximiseViewWindow(dragFreePoints);
    canvas.AdjustIntervals();
    canvas.clearCanvas();
    canvas.DrawAxis();
    canvas.DrawLine(airResistancePoints, "red", 10);
    canvas.DrawLine(dragFreePoints, "blue", 10);
    const pointOffset = 10;
    canvas.PlotPoint(apogeeAirResistance, "black", "Apogee", { x: 0, y: pointOffset / 2 });
    canvas.PlotPoint(apogeeDragFree, "black", "Apogee", { x: 0, y: pointOffset / 2 });
    AddKey([
        { colour: "red", label: "Air Resistance" },
        { colour: "blue", label: "No Air Resistance" },
    ]);
};
InitAxisTitle("x/m", "y/m");
setTimeout(CURRENT_CHALLENGE, 30);
