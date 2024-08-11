"use strict";
const Parameters = {
    angularVelocity: Math.round(Math.PI / 5000 * 10000) / 10000,
    launchVelocity: 7000,
    initialLatitude: 52,
    initialLongitude: 0,
    launchAngleX: 42,
    launchAngleY: -47,
    launchAngleZ: -20,
};
InitSliderForKey(Parameters, "angularVelocity", "Angular Velocity: X rads-1", { min: 0.0001, max: 0.002, step: 0.00005 });
InitSliderForKey(Parameters, "launchVelocity", "Launch Velocity: X ms-1", { min: 1000, max: 10000, step: 500 });
InitSliderForKey(Parameters, "initialLatitude", "Initial Lattitude: X degrees", { min: -90, max: 90, step: 1 });
InitSliderForKey(Parameters, "initialLongitude", "Initial Longitude: X degrees", { min: -180, max: 180, step: 1 });
InitSliderForKey(Parameters, "launchAngleX", "Launch Angle (x): X degrees", { min: -60, max: 60, step: 1 });
InitSliderForKey(Parameters, "launchAngleY", "Launch Angle (y): X degrees", { min: -60, max: 60, step: 1 });
InitSliderForKey(Parameters, "launchAngleZ", "Launch Angle (z): X degrees", { min: -60, max: 60, step: 1 });
InitInfo(`Extension: Projectile model which considers launching projectiles from spherical planet, rotating about its axis and animates where projectile lands`);
const launchButton = document.getElementById("launch");
const UpdateLabel = (text) => {
    const label = document.getElementById("label");
    label.innerText = text;
};
//our model has a radius of 6.371e6 m
//we need to set our projectile's initial position on the earth
//we are using x, y, z coordinates as they work well for calculations
const O = [0, 0, 0]; //origin
let position = [0, 0, 0];
let velocity = [0, 0, 0];
let acceleration = [0, 0, 0];
const mass = 2.9 * 10 ** 6; //modelling Saturn V
const G = 6.67 * 10 ** -11;
const M = 5.972 * 10 ** 24;
//R defined in threeJSSetup as 6.371e6
let idleInterval;
let flightInterval;
;
let postFlightInterval;
;
//Keeping track of all previously visited positions
let dots = [];
const material = new THREE.MeshStandardMaterial({ color: 0xf2c750 });
const LogPosition = () => {
    const p = JSON.parse(JSON.stringify(position));
    //p is the projectile's absolute position; but when we log it, we are more interested in its position relative to the Earth.
    const geometry = new THREE.IcosahedronGeometry(10 ** 5, 9);
    const dot = new THREE.Mesh(geometry, material); //as the Earth rotates, these points also need to move
    dot.position.set(p[0], p[1], p[2]);
    scene.add(dot);
    dots.push(dot);
};
const WaitForLaunchButton = () => {
    return new Promise((resolve) => {
        launchButton.onclick = () => {
            resolve(undefined);
        };
    });
};
CURRENT_CHALLENGE = async () => {
    //for now, assume the projectile is always launched normal to the surface of the earth.
    //working with 3D vectors, however the basic maths is the same.
    //F = ma -> a = F/m
    //on each tick, we calculate the resultant force vector and convert it into an acceleration vector.
    //we can then apply this acceleration vector to the velocity vector, and apply the velocity vector to the position vector, using deltaT as the time interval
    //repeat this until the projectile eventually lands back on earth, detecting when this happens with the ProjectileTouchingEarth() function
    //---
    //we can work out an escape velocity for our particle
    //to escape, mgh = 0.5mv^2
    //v_e = sqrt(2gR) where g = 9.81
    //so for our projectile, the escape velocity v_e = 11491 ms-1
    //clear any previous intervals
    if (idleInterval != undefined) {
        clearInterval(idleInterval);
    }
    if (flightInterval != undefined) {
        clearInterval(flightInterval);
    }
    if (postFlightInterval != undefined) {
        clearInterval(postFlightInterval);
    }
    //remove any dots previously used to track
    for (const dot of dots) {
        scene.remove(dot);
    }
    dots = [];
    UpdateLabel("");
    //INITIAL CONDITIONS
    //Start at given position, and rotate to match Earth's position
    position = ToCartesian(Parameters.initialLatitude, Parameters.initialLongitude, R);
    position = RotateAroundYAxis(position, earth.rotation.y + Math.PI);
    velocity = [0, 0, 0];
    acceleration = [0, 0, 0];
    SyncPosition();
    //Upate arrow direction based on launchAngleX and launchAngleZ
    //the launch angles act as offsets to the normal, so our direction vector first should first use the given latitude and longitude to calculate a normal
    let launchDirection = ToCartesian(Parameters.initialLatitude, Parameters.initialLongitude, 1); //radius 1 means its already normalised
    launchDirection = RotateAroundXAxis(launchDirection, DegreesToRadians(Parameters.launchAngleX));
    launchDirection = RotateAroundYAxis(launchDirection, DegreesToRadians(Parameters.launchAngleY));
    launchDirection = RotateAroundZAxis(launchDirection, DegreesToRadians(Parameters.launchAngleZ));
    arrow.setDirection(new THREE.Vector3(launchDirection[0], launchDirection[1], launchDirection[2]));
    //start idle interval
    idleInterval = setInterval(() => {
        IdleIntervalCallback();
    }, 1);
    //Wait for user to click launch button
    await WaitForLaunchButton();
    clearInterval(idleInterval);
    //we need to sync the launch direction with the rotation of the Earth
    launchDirection = RotateAroundYAxis(launchDirection, earth.rotation.y + Math.PI);
    Launch(launchDirection);
    let tickCounter = 0;
    flightInterval = setInterval(() => {
        FlightIntervalCallback();
        if (tickCounter % 30 == 0) { //only log position once every 100 ticks to improve performance
            LogPosition();
        }
        tickCounter += 1;
        if (ProjectileTouchingEarth()) {
            clearInterval(flightInterval);
            //calculate latitude and longitude of landing positon, and update label
            const [latitude, longitude] = CartesianToSpherical(RotateAroundYAxis(position, -earth.rotation.y - Math.PI), R); //counter-act the rotation of the Earth to get 'unaffected' latitude and longitude
            UpdateLabel(`Landed at latitude ${Math.round(latitude)}° and longitude ${Math.round(longitude)}°`);
            //once the flight has landed, just continue to rotate the Earth and spin velocity
            postFlightInterval = setInterval(() => {
                PostFlightIntervalCallback();
            }, 1);
        }
    }, 1);
};
//before the user clicks launch, the projectile will just rotate with the Earth (i.e. will always have a spinVelocity)
const IdleIntervalCallback = () => {
    UpdateSpinVelocity(); //update spin velocity
    RotateEarth([], 1);
    position = RotateAroundYAxis(position, Parameters.angularVelocity * 1);
    SyncPosition();
    //ProjectileTick(1); //not very reliable for greater altitudes, so will just use rotate on world axis for now
};
const FlightIntervalCallback = () => {
    UpdateAcceleration();
    RotateEarth(dots, 1);
    ProjectileTick(1);
};
const PostFlightIntervalCallback = () => {
    UpdateSpinVelocity(); //update spin velocity
    RotateEarth(dots, 1);
    position = RotateAroundYAxis(position, Parameters.angularVelocity * 1); //compounding spin velocity is not accurate enough to maintain sync
    SyncPosition();
};
//Launch Preview Toggle
const toggleLaunchPreviewButton = document.getElementById("toggleAnglePreview");
const launchControls = document.getElementById("launchControls");
const angleCanvasWrapper = document.getElementById("angleCanvasWrapper");
const launchButtonWrapper = document.getElementById("launchButtonWrapper");
let anglePreviewShown = true;
toggleLaunchPreviewButton.onclick = () => {
    anglePreviewShown = !anglePreviewShown;
    if (anglePreviewShown == true) {
        angleCanvasWrapper.style.display = ""; //reset all inline CSS styles formatted earlier
        launchButtonWrapper.style.gridColumn = "";
        launchButtonWrapper.style.marginTop = "";
        launchControls.style.height = "";
        toggleLaunchPreviewButton.innerText = "Hide Angle Preview";
    }
    else {
        angleCanvasWrapper.style.display = "none";
        launchButtonWrapper.style.gridColumn = "1 / 3";
        launchButtonWrapper.style.marginTop = "30px";
        launchControls.style.height = "max-content";
        toggleLaunchPreviewButton.innerText = "Show Angle Preview";
    }
};
setTimeout(CURRENT_CHALLENGE, 30);
