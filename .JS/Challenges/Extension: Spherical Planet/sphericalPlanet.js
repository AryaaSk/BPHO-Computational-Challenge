"use strict";
const Parameters = {
    x: 3
};
InitSliderForKey(Parameters, "x", "Launch Angle (X degrees)", { min: 0, max: 90, step: 5 });
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
renderer.setAnimationLoop(() => {
    orbitControls.update();
    renderer.render(scene, camera);
});
