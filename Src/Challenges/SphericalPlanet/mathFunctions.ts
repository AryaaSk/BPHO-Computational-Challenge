const AddVectors = (a: number[], b: number[]) => {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

const VectorBetween = (a: number[], b: number[]) => {
  return [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
}

const NormaliseVector = (v: number[]) => {
  const magnitude = Magnitude(v);
  return [v[0]/magnitude, v[1]/magnitude, v[2]/magnitude];
}

const MultiplyScalar = (s: number, v: number[]) => {
  return [s*v[0], s*v[1], s*v[2]];
}

const Magnitude = (v: number[]) => {
  const [x, y, z] = v;
  return Math.sqrt(x**2 + y**2 + z**2);
}

function CrossProduct(u: number[], v: number[]): number[] {
  if (v[0] == u[0] && v[1] == u[1] && v[2] == u[2]) {
    return v; //special case, can simply return the normal
  }

  if (u.length !== 3 || v.length !== 3) {
      throw new Error("Both vectors must be 3-dimensional");
  }

  const w_x = u[1] * v[2] - u[2] * v[1];
  const w_y = u[2] * v[0] - u[0] * v[2];
  const w_z = u[0] * v[1] - u[1] * v[0];

  return [w_x, w_y, w_z];
}

function DegreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
function RotateAroundXAxis(vector: number[], angle: number): [number, number, number] {
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);

  const yNew = vector[1] * cosTheta - vector[2] * sinTheta;
  const zNew = vector[1] * sinTheta + vector[2] * cosTheta;

  return [vector[0], yNew, zNew];
}
function RotateAroundYAxis(vector: number[], angle: number): [number, number, number] {
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);

  const xNew = vector[0] * cosTheta + vector[2] * sinTheta;
  const zNew = -vector[0] * sinTheta + vector[2] * cosTheta;

  return [xNew, vector[1], zNew];
}
function RotateAroundZAxis(vector: number[], angle: number): [number, number, number] {
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);

  const xNew = vector[0] * cosTheta - vector[1] * sinTheta;
  const yNew = vector[0] * sinTheta + vector[1] * cosTheta;

  return [xNew, yNew, vector[2]];
}



function ToCartesian(lat: number, lon: number, r: number): number[] {
  //start at [r, 0, 0] and just rotate around axis
  let pos = [r, 0, 0];
  pos = RotateAroundZAxis(pos, DegreesToRadians(lat));
  pos = RotateAroundYAxis(pos, DegreesToRadians(lon));
  return pos;
}

function CartesianToSpherical(cartesian: number[], r: number) {
  const [x, y, z] = cartesian;

  // Ensure that the radius is not zero to avoid division by zero
  if (r === 0) {
      throw new Error("Radius must be greater than zero");
  }

  // Calculate latitude in radians (using y as height)
  const phi = Math.asin(y / r);

  // Calculate longitude in radians
  const lambda = -Math.atan2(z, x); //our model's longitude seems to be inverted so multiply by -1 to correct it

  // Convert latitude and longitude from radians to degrees
  const lat = phi * (180 / Math.PI);
  const lon = lambda * (180 / Math.PI);

  return [lat, lon]
}