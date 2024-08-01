const Challenge8Parameters = {
    //Parameters required for challenge
    u: 5,
    theta: 45,
    h: 10,
    g: -9.81,
    C: 0.7,
    N: 6,

    timeStep: 0.01
}

InitSliderForKey(Challenge8Parameters, "theta", "Launch Angle (X degrees)", { min: 0, max: 90, step: 1 });
InitSliderForKey(Challenge8Parameters, "u", "Launch Speed (X ms-1)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge8Parameters, "h", "Launch Height (X m)", { min: 0, max: 10, step: 0.1 });
InitSliderForKey(Challenge8Parameters, "C", "Coefficient of Restitution (X)", { min: 0, max: 1, step: 0.1 });
InitSliderForKey(Challenge8Parameters, "N", "Number of Bounces (X)", { min: 1, max: 10, step: 1 });

//@ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();

CURRENT_CHALLENGE = () => {
    //we want to determine the path this projectile will take, continuing until reaching N bounces.
    const { u, theta, h, g, C, N, timeStep } = Challenge8Parameters;
    
    const [horizontalV, verticalV] = SplitVelocityComponents(u, theta);

    //model vertical displacement as a function of time and vertical velocity u
    //s_y = ut + 1/2*g*t^2 + h
    //when s_y <= 0, we count this as a single bounce and we calculate a new vertical velocity upwards v out
    //C = v out / v in, therefore v out = C * v in, where v in = u + g*t
    //start the process again using this new v out

    let t = 0;
    
    let vOut = verticalV;
    let initialHeight = h;
    let verticalTOffset = 0; //after each bounce, we need to alter the initial conditions, and 'pretend' that t = 0 again, at least for the vertical component

    let points: number[][] = [];
    let bounces = 0;

    while (bounces < N) {
        const verticalDisplacement = vOut * (t - verticalTOffset) + 0.5 * g * (t - verticalTOffset)**2 + initialHeight;

        if (verticalDisplacement < 0) { //projectile has reached ground, so now we calculate new v in and
            const vIn = vOut + g * (t - verticalTOffset);
            vOut = C * vIn * -1; //multiply by -1 to flip direction as coefficient of restitution is based on speed
            initialHeight = 0; //all bounces start from s_y = 0
            verticalTOffset = t;
            
            bounces += 1;
        }

        const horizontalDisplacement = horizontalV * t;
        points.push([horizontalDisplacement, verticalDisplacement]);

        t += timeStep;

        canvas.MAX_X = Math.max(15, horizontalDisplacement + 1)
        canvas.MAX_Y = Math.max(15, verticalDisplacement + 1)
    }
    canvas.CalculateConversionFactors();

    canvas.clearCanvas();
    canvas.DrawAxis();
    canvas.DrawLine(points, "blue", 3);
}
CURRENT_CHALLENGE();