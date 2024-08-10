"use strict";
//@ts-ignore
const canvasElement = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, canvasElement.offsetWidth / canvasElement.offsetHeight);
camera.position.set(3, 3, 3);
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasElement,
});
renderer.setClearColor(0xffffff, 1.0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasElement.offsetWidth, canvasElement.offsetHeight);
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.maxPolarAngle = Math.PI * 0.5;
orbitControls.minDistance = 0.1;
orbitControls.maxDistance = 100;
orbitControls.autoRotate = false;
orbitControls.autoRotateSpeed = 1.0;
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);
