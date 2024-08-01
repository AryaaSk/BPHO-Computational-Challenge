const Challenge1Parameters = {
    angle: 30,
    g: 9.8,
    speed: 5,
    height: 3,
    timeStep: 0.001
};

InitSliderForKey(Challenge1Parameters, "angle", "Launch Angle (X degrees)", { min: 0, max: 90, step: 1 });
InitSliderForKey(Challenge1Parameters, "g", "Gravitational Field Strength (-X ms-2)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge1Parameters, "speed", "Launch Speed (X ms-1)", { min: 1, max: 15, step: 0.1 });
InitSliderForKey(Challenge1Parameters, "height", "Launch Height (X m)", { min: 0, max: 10, step: 0.1 });

//@ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();

CURRENT_CHALLENGE = () => {
    const points: number[][] = [];
    let t = 0;
    
    const angleRadians = Challenge1Parameters.angle * Math.PI / 180;
    const horizontalVelocity = Challenge1Parameters.speed * Math.cos(angleRadians);
    const verticalVelocity = Challenge1Parameters.speed * Math.sin(angleRadians);

    while (true) {
        //compute horizontal and vertical displacements at time t
        //s_x = vt
        const x = horizontalVelocity * t;

        //s_y = ut + 0.5at^2 + c, where c = LAUNCH_HEIGHT
        const y = verticalVelocity * t + 0.5 * -Challenge1Parameters.g * t**2 + Challenge1Parameters.height;

        if (y < 0) { //below ground level
            break;
        }

        points.push([x, y]);
        t += Challenge1Parameters.timeStep;

        //calculate new view window based on max X and max Y of these points
        canvas.MAX_X = Math.max(15, x + 1)
        canvas.MAX_Y = Math.max(15, y + 1)
    }
    canvas.CalculateConversionFactors();

    canvas.clearCanvas();
    canvas.DrawAxis();
    canvas.DrawLine(points, "blue", 10);
}
CURRENT_CHALLENGE();