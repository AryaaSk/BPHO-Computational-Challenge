const ProjectileTouchingEarth = () => {
    //measures distance between projectile and center of the Earth. If this distance <= R return true, otherwise false
    const distance = Magnitude(position);
    return (distance <= R);
  }
  
  const UpdateSpinVelocity = () => {
    //clearly, at the north pole the spin vector has no effect, whereas at the equator the spin vector is exactly equal to the (angular velocity * R), in the direction perpendicular to the position vector specifically with no component in the y direction
    //therefore, we need to interpolate between these two extremes, given a specific y coordinate
    //we need to calculate the radius at given y coordinate
    //using Pythagorus, we have r = sqrt(R^2 - y^2)
    const horizontalCircleRadius = Math.sqrt(R**2 - position[1]**2);
    const spinMagnitude = Parameters.angularVelocity * horizontalCircleRadius;
    
    //now we can calculate the magnitude of the spin velocity at this point (simply angular velocity * r)
    //we can calculate the direction vector by taking the cross product of the normaliseds position vector and j hat
    const spinDirection = CrossProduct([0, 1, 0], NormaliseVector(position));
    const spinVelocity = MultiplyScalar(spinMagnitude, spinDirection);
  
    velocity = spinVelocity;
  }
  
  
  const Launch = (direction: number[]) => {
    //apply an initial velocity/impulse at a given trajectory
    const launchVelocityMagnitude = Parameters.launchVelocity;
    const LaunchVelocity = MultiplyScalar(launchVelocityMagnitude, NormaliseVector(direction));
    velocity = AddVectors(velocity, LaunchVelocity);
  }
  
  const UpdateAcceleration = () => {
    //Update acceleration vector by calculating resultant force on projectile at given position
    const distanceFromCenterEarth = Magnitude(position);
    const gravitationalFieldStrength = G * M / (distanceFromCenterEarth**2);
    const weight = MultiplyScalar(mass, MultiplyScalar(gravitationalFieldStrength, NormaliseVector(VectorBetween(position, O))));
  
    //for now, we will only consider gravity
  
    //calculate resultant force and hence resultant acceleration
    const resultantForce = weight;
    acceleration = MultiplyScalar(1/mass, resultantForce);
  }
  
  const RotateEarth = (dots: any[], deltaT: number) => {
    earth.rotation.y += Parameters.angularVelocity * deltaT;
  
    for (const dot of dots) { //rotate dots around y axis by same amount
      //the only method which seems to work on these dot references is position.set()
      //I'll have to calculate the rotation manually then
      const position = [dot.position.x, dot.position.y, dot.position.z];
      const newPosition = RotateAroundYAxis(position, Parameters.angularVelocity * deltaT);
  
      //dot.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Parameters.angularVelocity * deltaT);
      dot.position.set(newPosition[0], newPosition[1], newPosition[2]);
    }
  }
  
  
  //Updates position and velocity based on acceleration
  const ProjectileTick = (deltaT: number) => { //called on every frame - imitades 1 second passing
    //update position vector
    position = AddVectors(position, MultiplyScalar(deltaT, velocity));
    SyncPosition();
  
    //Update velocity vector
    velocity = AddVectors(velocity, MultiplyScalar(deltaT, acceleration));
  }