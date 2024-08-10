//SETTING UP THREEJS
//this extension is slightly different to the other challenges, in that I will need to render a 3D model of the earth.
//I will use ThreeJS to do so.
//https://stackblitz.com/edit/threejs-cdn-2?file=index.html
declare const THREE: any;
const R = 6.371 * 10**6;

//@ts-ignore
const canvasElement = document.getElementById("canvas")! as HTMLCanvasElement;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  canvasElement.offsetWidth / canvasElement.offsetHeight,
  1,
  10**8
);
camera.position.set(1.5e7, 1.5e7, 1.5e7);
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvasElement,
  logarithmicDepthBuffer: true
});
renderer.setClearColor(0x000000, 1.0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasElement.offsetWidth, canvasElement.offsetHeight);

const orbitControls = new THREE.OrbitControls(
  camera,
  renderer.domElement
);
orbitControls.maxPolarAngle = Math.PI * 0.5;
orbitControls.minDistance = 0.1;
//orbitControls.maxDistance = 100;
orbitControls.autoRotate = false;
orbitControls.autoRotateSpeed = 1.0;

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

/*
const pointLight = new THREE.PointLight(0xffffff, 3);
pointLight.position.set(0, 10, 0);
pointLight.castShadow = true;
scene.add(pointLight);
*/

//https://www.youtube.com/watch?v=FntV9iEJ0tU
//initialising globe
const loader = new THREE.TextureLoader();

const earthGeometry = new THREE.IcosahedronGeometry(R, 9);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("/Assets/earthmap1k.jpg")
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.rotation.y += Math.PI;
scene.add(earth);

const projectileGeometry = new THREE.IcosahedronGeometry(0.3 * 10**6, 9);
const projectileMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
scene.add(projectile);

renderer.setAnimationLoop(() => {
  orbitControls.update();
  renderer.render(scene, camera);
});

const SyncPosition = () => {
  [projectile.position.x, projectile.position.y, projectile.position.z] = position;
}



//Setup launch angle canvas
const launchAngleCanvas = document.getElementById("launchAngleCanvas")!;
const launchScene = new THREE.Scene();
const launchCamera= new THREE.PerspectiveCamera(
  50,
  launchAngleCanvas.offsetWidth / launchAngleCanvas.offsetHeight,
  1,
);
launchCamera.position.set(0, 0, 3);
launchCamera.lookAt(launchScene.position);

const launchRenderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: launchAngleCanvas,
  alpha: true
});
launchRenderer.setPixelRatio(window.devicePixelRatio);
launchRenderer.setSize(launchAngleCanvas.offsetWidth, launchAngleCanvas.offsetHeight);

//Ambient light
const launchLight = new THREE.AmbientLight(0xFFFFFF, 1);
launchScene.add(launchLight);

//Add in arrow component
const arrow = new THREE.ArrowHelper( new THREE.Vector3(0, 1, 0), new THREE.Vector3( 0, 0, 0 ), 1, 0x9b42f5 );
launchScene.add(arrow);

const boundingSphereGeometry = new THREE.SphereGeometry( 1, 10, 10 );
const wireframe = new THREE.WireframeGeometry( boundingSphereGeometry );
const line = new THREE.LineSegments( wireframe );
line.material.depthTest = false;
line.material.opacity = 0.25;
line.material.transparent = true;
line.material.color.setHex(0x000000);
launchScene.add(line);

launchRenderer.setAnimationLoop(() => {
  launchRenderer.render(launchScene, launchCamera);
});