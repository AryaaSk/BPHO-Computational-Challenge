const Challenge2Parameters = {
    angle: 30,
    g: 9.81,
    speed: 5,
    height: 3,
    xStep: 0.001
};

LinkSliderToKey(Challenge2Parameters, "angle", "angleSlider", "angleLabel", "Launch Angle (X degrees)");
LinkSliderToKey(Challenge2Parameters, "g", "gSlider", "gLabel", "Gravitational Field Strength (-X ms-2)");
LinkSliderToKey(Challenge2Parameters, "speed", "speedSlider", "speedLabel", "Launch Speed (X ms-1)");
LinkSliderToKey(Challenge2Parameters, "height", "heightSlider", "heightLabel", "Launch Height (X m)");

//@ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();

CURRENT_CHALLENGE = () => {
    //instead of using t as a parameter, we will elimate from this system and form an equation linking x and y
    // (1): x = vt
    // (2): y = ut + 0.5at^2 + h

    // (1): t = x/v
    // (1) -> (2) (*): y = ux/v + 0.5a(x/v)^2 + h = (u/v)x + (a/2v^2)x^2 + h

    //(*) provides the equation linking y and x; we can calculate the maximum horizontal range by determining the x at which y = 0 (only interested in first root)
    //Solve for y = 0 using quadratic formula where a = acc/2v^2, b = u/v, c = h

    const angleRadians = Challenge2Parameters.angle * Math.PI / 180;
    const acc = -Challenge2Parameters.g;
    const v = Challenge2Parameters.speed * Math.cos(angleRadians); //horizontal velocity
    const u = Challenge2Parameters.speed * Math.sin(angleRadians); //vertical velocity
    const h = Challenge2Parameters.height;

    const a = acc / (2 * v**2);
    const b = u / v;
    const c = h;

    //interested specifically in positive root since our model always starts at or after first root
    const root = (-b - Math.sqrt(b**2 - 4*a*c)) / (2*a);

     //plot all x coordinates from 0 to root
     const points: number[][] = [];
     const y = (x: number) => {
         return b*x + a*x**2 + c;
     }
     for (let x = 0; x <= root; x += Challenge2Parameters.xStep) {
         points.push([x, y(x)]);
     }
 
     canvas.MAX_X = Math.round(Math.max(15, ...points.map((point) => { return point[0] + 2; })));
     canvas.MAX_Y = Math.round(Math.max(15, ...points.map((point) => { return point[1] + 2; })));
     canvas.CalculateConversionFactors();
 
     //challenge 2 also requires us to plot the apogee (point with greatest y coordinate)
     //the apogee is just the turning point, and thus will occur when x = -b/2a and y = y(-b/2a)
     const apogeeX = -b/(2*a);
     const apogee = [apogeeX, y(apogeeX)];
 
     const pointOffset = 10; //line gets slightly raised due to thickness, so offset point to preven the point from looking out of place
     canvas.clearCanvas();
     canvas.DrawAxis();
     canvas.DrawLine(points, "blue", 10);
     canvas.PlotPoint(apogee, "orange", "Apogee", { x: 0, y: pointOffset / 2 });
}
CURRENT_CHALLENGE();