import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import stars from "../image/stars.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 15, 15)

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const planeGeo = new THREE.PlaneGeometry(30, 30);
const planeMat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xFFFFFF,
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh(planeGeo, planeMat);

scene.add(plane)

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
});

const groundBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  // mass: 0,
  type: CANNON.Body.STATIC
})

groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

world.addBody(groundBody);

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00FF00
});
const box = new THREE.Mesh(boxGeo, boxMat);

scene.add(box);

const boxBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  mass: 1,
  position: new CANNON.Vec3(1, 20, 0)
})

world.addBody(boxBody)

const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);

  plane.position.copy(groundBody.position)
  plane.quaternion.copy(groundBody.quaternion)

  box.position.copy(boxBody.position)
  box.quaternion.copy(boxBody.quaternion)

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
