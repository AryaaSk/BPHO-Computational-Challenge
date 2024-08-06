declare const FFmpeg: any;

const Challenge8Parameters = {
    //Parameters required for challenge
    u: 5,
    theta: 45,
    h: 10,
    g: -9.81,
    C: 0.7,
    N: 6,

    timeStep: 0.04
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

let interval: number | undefined = undefined; //to prevent multiple animations from occuring at once
CURRENT_CHALLENGE = async () => {
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

        canvas.MAX_X = Math.max(15, horizontalDisplacement + 1);
        canvas.MAX_Y = Math.max(15, verticalDisplacement + 1);
    }
    canvas.CalculateConversionFactors();

    canvas.clearCanvas();
    canvas.DrawAxis();

    //to provide a downloadadble video for the user, we need to record the animation as it occurs on the canvas and present it within a video element
    const downloadLink = document.getElementById("download")! as HTMLAnchorElement; 
    downloadLink.style.display = "none";

    const stream = canvas.canvas.captureStream(25);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });

    const recordedChunks: Blob[] = [];
    mediaRecorder.ondataavailable = ($e) => {
        recordedChunks.push($e.data);
    };

    // Chrome requires we draw on the canvas while recording
    mediaRecorder.start();
    mediaRecorder.onstart = () => {
        //provide an animation delay to create animated effect of ball tracing out path
        if (interval != undefined) { //stop any previous animation
            console.log(`cleared interval ${interval}`)
            clearInterval(interval);
        }
        interval = canvas.DrawLine(points, "blue", 3, 9, () => {
            mediaRecorder.stop();
        });
    }

    // wait for the stop event to export the final video
    // the dataavailable can fire before
    mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, {
            type: "video/webm"
        });

        var url = URL.createObjectURL(blob);
        downloadLink.style.display = "";
        downloadLink.href = url;
        downloadLink.download = "challenge8.webm"
    }
}
CURRENT_CHALLENGE();