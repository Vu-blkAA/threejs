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

camera.position.set(0, 50, 50);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const planeGeo = new THREE.PlaneGeometry(30, 30);
const planeMat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xffffff,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeo, planeMat);

scene.add(plane);

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00,
});
const box = new THREE.Mesh(boxGeo, boxMat);

scene.add(box);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0xff0000,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);

scene.add(sphere);

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

const groundBodyMat = new CANNON.Material();

const groundBody = new CANNON.Body({
  // shape: new CANNON.Plane(30, 30),
  shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
  type: CANNON.Body.STATIC,
  material: groundBodyMat,
});

groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

world.addBody(groundBody);

const boxBodyMat = new CANNON.Material();

const boxBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  mass: 1,
  position: new CANNON.Vec3(-5, 20, 0),
  material: boxBodyMat,
});

world.addBody(boxBody);

boxBody.angularVelocity = new CANNON.Vec3(0, 10, 0);
boxBody.angularDamping = 0.5;

const sphereBodyMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
  shape: new CANNON.Sphere(2),
  position: new CANNON.Vec3(2, 2, 0),
  mass: 1,
  material: sphereBodyMat,
});

world.addBody(sphereBody);

sphereBody.linearDamping = 0;

const timeStep = 1 / 120;

const groundBoxContactMat = new CANNON.ContactMaterial(
  groundBodyMat,
  boxBodyMat,
  {
    friction: 0.04,
  }
);

const groundSphereContactMat = new CANNON.ContactMaterial(
  groundBodyMat,
  sphereBodyMat,
  {
    restitution: 2,
  }
);

world.addContactMaterial(groundBoxContactMat);
world.addContactMaterial(groundSphereContactMat);

function animate() {
  world.step(timeStep);

  plane.position.copy(groundBody.position);
  plane.quaternion.copy(groundBody.quaternion);

  box.position.copy(boxBody.position);
  box.quaternion.copy(boxBody.quaternion);

  sphere.position.copy(sphereBody.position);
  sphere.quaternion.copy(sphereBody.quaternion);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
