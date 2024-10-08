const Challenge35Parameters = {
    //Parameters required for challenge
    x: 1000,
    y: 300,
    h: 0,
    g: 9.81,
    launch_speed: 150
};

InitSliderForKey(Challenge35Parameters, "x", "Target x (X m)", { min: 0, max: 1200, step: 1 });
InitSliderForKey(Challenge35Parameters, "y", "Target y (X m)", { min: 0, max: 1200, step: 1 });
InitSliderForKey(Challenge35Parameters, "h", "Height (X m)", { min: 0, max: 1000, step: 1 });
InitSliderForKey(Challenge35Parameters, "g", "Gravitaional Field Strength (X ms-2)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge35Parameters, "launch_speed", "Launch Speed (X ms-1)", { min: 0, max: 500, step: 0.1 });

InitInfo(`Challenge 3: Projectile model based upon calculating trajectories that passed through fixed position (x, y)\n
Challenge 5: Updated version of 3 with added bounding parabola curve, marking regions where possible (x, y) coords could be reached given u, h, and g.`)
    
// @ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();

// Function to solve quadratic and linear equations
function solve_3(a: number, b: number, c: number): number[] {
    if (a === 0) {
        if (b !== 0) {
            return [-c / b];
        } else {
            throw new Error("a and b can't be 0");
        }
    }
    const discriminant = (b * b) - (4 * a * c);
    if (discriminant < 0) {
        return [];
    } else if (discriminant === 0) {
        const root = -b / (2 * a);
        return [root];
    } else {
        const root1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        return root1 < root2 ? [root1, root2] : [root2, root1];
    }
}

// TODO: still some bugs if you increase y too high or set u too low

const Challenge3 = () => {
    const points_low: [number, number][] = []; // low ball points
    const points_high: [number, number][] = []; // high ball points
    const points_min: [number, number][] = []; // min. speed points
    const g = Challenge35Parameters.g;
    const X = Challenge35Parameters.x;
    const Y = Challenge35Parameters.y;
    const launch_speed = Challenge35Parameters.launch_speed;
    const h = Challenge35Parameters.h;
    const Y_min = Y - h; // set coord system such that h = 0

    // minimum speed to launch projectile
    const min_speed = Math.sqrt(g) * Math.sqrt(Y_min + Math.sqrt(Y_min ** 2 + X ** 2));

    // calculate the values for theta
    const a = g * (X ** 2) / (2 * (launch_speed ** 2));
    const b = -X;
    const c = Y - h + a;
    const solutions = solve_3(a, b, c);

    const slider = document.getElementById("launch_speed")! as HTMLInputElement;
    slider.min = String(Math.round(min_speed * 10) / 10);
    if (Number(slider.value) < min_speed) {
        slider.value = String(Math.round(min_speed));
    }
    let tan_theta_low = 0;
    let tan_theta_high = 0;
    // angle if projectile launched at minimum speed
    const tan_theta_min = (Y_min + Math.sqrt(X ** 2 + Y_min ** 2)) / X;

    // returns y values for projectile
    const y = (x: number, tan_theta: number, u: number) => {
        return tan_theta * x - (g / (2 * u ** 2)) * (1 + tan_theta ** 2) * x ** 2 + h;
    };

    for (let x_min = 0; x_min <= X; x_min += 1) {
        points_min.push([x_min, y(x_min, tan_theta_min, min_speed)]);
    }

    if (solutions.length === 2) {
        tan_theta_low = solutions[0];
        tan_theta_high = solutions[1];

        // generate set of array of points for low and high ball trajectory
        for (let x_low = 0; x_low <= X; x_low += 1) {
            points_low.push([x_low, y(x_low, tan_theta_low, launch_speed)]);
        }
        for (let x_high = 0; x_high <= X; x_high += 1) {
            points_high.push([x_high, y(x_high, tan_theta_high, launch_speed)]);
        }
    }
    
    // only need to keep target x and y in view
    canvas.MAX_X = 15;
    canvas.MAX_Y = 15;
    canvas.MaximiseViewWindow(points_high);
    canvas.AdjustIntervals();

    const pointOffset = 5;
    canvas.clearCanvas();
    canvas.DrawAxis();

    // plot target x and y
    canvas.PlotPoint([X, Y], "red", "(X, Y)", { x: 0, y: pointOffset / 2 });

    // if only one solution, it is same as minimum projectile speed
    if (solutions.length === 2) {
        canvas.DrawLine(points_low, "orange", 5);
        canvas.DrawLine(points_high, "blue", 5);
    }

    // plot minimum projectile speed
    canvas.DrawLine(points_min, "grey", 5);

    AddKey([
        { colour: "blue", label: "High ball" },
        { colour: "grey", label: "Min u" },
        { colour: "orange", label: "Low ball" }
    ]);
}

const Challenge5 = () => {
    const points_low: [number, number][] = []; // low ball points
    const points_high: [number, number][] = []; // high ball points
    const points_min: [number, number][] = []; // min. speed points
    const points_bounding: [number, number][] = []; // bounding parab points
    
    const g = Challenge35Parameters.g;
    const X = Challenge35Parameters.x;
    const Y = Challenge35Parameters.y;
    const launch_speed = Challenge35Parameters.launch_speed;
    const h = Challenge35Parameters.h;
    const Y_min = Y - h; // set coord system such that h = 0

    // minimum speed to launch projectile
    const min_speed = Math.sqrt(g) * Math.sqrt(Y_min + Math.sqrt(Y_min ** 2 + X ** 2));

    // calculate the values for theta
    const a = g * (X ** 2) / (2 * (launch_speed ** 2));
    const b = -X;
    const c = Y - h + a;
    const solutions = solve_3(a, b, c);

    const slider = document.getElementById("launch_speed")! as HTMLInputElement;
    slider.min = String(Math.round(min_speed * 10) / 10);
    if (Number(slider.value) < min_speed) {
        slider.value = String(Math.round(min_speed));
    }
    let tan_theta_low = 0;
    let tan_theta_high = 0;
    // angle if projectile launched at minimum speed
    const tan_theta_min = (Y_min + Math.sqrt(X ** 2 + Y_min ** 2)) / X;

    // returns y values for projectile
    const y = (x: number, tan_theta: number, u: number) => {
        return tan_theta * x - (g / (2 * u ** 2)) * (1 + tan_theta ** 2) * x ** 2 + h;
    };

    const y_bounding = (x: number, u: number) => {
        return ((u ** 2) / (2 * g)) - (g / (2 * u ** 2)) * x ** 2 + h;
    };

    for (let x_min = 0; x_min <= X; x_min += 1) {
        points_min.push([x_min, y(x_min, tan_theta_min, min_speed)]);
    }

    for (let x_bound = 0; x_bound >= 0; x_bound += 1) {
        const y_coord = y_bounding(x_bound, launch_speed);
        points_bounding.push([x_bound, y_coord]);
        if (y_coord <= 0) {
            break;
        }
    }

    if (solutions.length === 2) {
        tan_theta_low = solutions[0];
        tan_theta_high = solutions[1];

        // generate set of array of points for low and high ball trajectory
        for (let x_low = 0; x_low <= X; x_low += 1) {
            points_low.push([x_low, y(x_low, tan_theta_low, launch_speed)]);
        }
        for (let x_high = 0; x_high <= X; x_high += 1) {
            points_high.push([x_high, y(x_high, tan_theta_high, launch_speed)]);
        }
    }
    
    // only need to keep target x and y in view
    canvas.MAX_X = 15;
    canvas.MAX_Y = 15;
    canvas.MaximiseViewWindow(points_bounding);
    canvas.AdjustIntervals();

    const pointOffset = 5;
    canvas.clearCanvas();
    canvas.DrawAxis();

    // plot target x and y
    canvas.PlotPoint([X, Y], "red", "(X, Y)", { x: 0, y: pointOffset / 2 });

    // if only one solution, it is same as minimum projectile speed
    if (solutions.length === 2) {
        canvas.DrawLine(points_low, "orange", 5);
        canvas.DrawLine(points_high, "blue", 5);
    }

    // plot minimum projectile speed
    canvas.DrawLine(points_min, "grey", 5);
    canvas.DrawLine(points_bounding, "green", 5);

    AddKey([
        { colour: "blue", label: "High ball" },
        { colour: "grey", label: "Min u" },
        { colour: "orange", label: "Low ball" },
        { colour: "green", label: "Bounding parabola" }
    ]);
}


InitChallengeToggle([
    { buttonID: "challenge3", challengeCallback: Challenge3 },
    { buttonID: "challenge5", challengeCallback: Challenge5 }
]);

InitAxisTitle("x/m", "y/m")
CURRENT_CHALLENGE = Challenge3;
CURRENT_CHALLENGE();
setTimeout(CURRENT_CHALLENGE, 30)