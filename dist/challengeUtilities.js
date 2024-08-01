"use strict";
const SplitVelocityComponents = (u, thetaDegrees) => {
    //returns horizontal and vertical velocity components given u and theta
    const thetaRadians = thetaDegrees * Math.PI / 180;
    const vh = u * Math.cos(thetaRadians); //horizontal
    const vv = u * Math.sin(thetaRadians);
    return [vh, vv];
};
