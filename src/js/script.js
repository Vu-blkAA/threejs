import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

import nebula from "../image/nebula.jpg";
import stars from "../image/stars.jpg";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const monkeyUrl = new URL("../assets/monkey.glb", import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

// const ambientLight = new THREE.AmbientLight(0x333333);

// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 15);
// scene.add(directionalLight);

// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.top = 20,
// directionalLight.shadow.camera.bottom = -20

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dLightHelper)

// const dLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightCameraHelper);

// const pointLIght = new THREE.PointLight(0xFFFFFF, 2, 15);
// scene.add(pointLIght);

// pointLIght.position.set(-10, 15, 0);

// const pointLightHelper = new THREE.PointLightHelper(pointLIght);
// scene.add(pointLightHelper)

const spotLight = new THREE.SpotLight(0xffffff, 100000);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;

scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);

scene.add(spotLightHelper);

scene.fog = new THREE.FogExp2(0xffffff, 0.01);

renderer.setClearColor(0xffff30);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(0, 5, 15);
orbit.update();

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.castShadow = true;

scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;

scene.add(plane);

const plane2Geometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);

plane2.position.set(5, 10, 10);

const lastIndexZ = plane2.geometry.attributes.position.array.length - 1;

scene.add(plane2);

const gridHelper = new THREE.GridHelper(30);

scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(3, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const sphere2Geometry = new THREE.SphereGeometry(2, 40, 40);
const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertextShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);

sphere2.position.set(-10, 10, 10);

scene.add(sphere2);

const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  nebula,
  nebula,
  stars,
  stars,
  nebula,
  nebula,
]);

const box2Geometry = new THREE.BoxGeometry(3, 3, 3);

const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
];

const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);

box2.name = "theBox";
box2.position.set(0, 10, 10);
scene.add(box2);
const gui = new dat.GUI();

const options = {
  shpereColor: "#b6986f",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  intensity: 100000,
  penumbra: 0.1,
};

gui.addColor(options, "shpereColor").onChange(function (e) {
  sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1).onChange((e) => {
  options.speed = e;
});

gui.add(options, "angle", 0, 0.15).onChange((e) => {
  options.angle = e;
});

gui.add(options, "intensity", 100, 100000).onChange((e) => {
  options.intensity = e;
});

gui.add(options, "penumbra", 0, 1).onChange((e) => {
  options.penumbra = e;
});

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = 1 - (e.clientY / window.innerHeight) * 2;
});

const rayCaster = new THREE.Raycaster();

let step = 0;

const sphereId = sphere.id;

const assetLoader = new GLTFLoader();

assetLoader.load(
  monkeyUrl.href,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);
  },
  undefined,
  (error) => {
    console.log("error", error);
  }
);

console.log("sphere", sphere.geometry.attributes.position);

function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += options.speed;

  sphere.position.y = 10 * Math.abs(Math.cos(step));

  spotLight.angle = options.angle;
  spotLight.intensity = options.intensity;
  spotLight.penumbra = options.penumbra;
  spotLightHelper.update();

  rayCaster.setFromCamera(mousePosition, camera);

  const intersections = rayCaster.intersectObjects(scene.children);

  intersections.map((item) => {
    if (item.object.id === sphereId) {
      item.object.material.color.set(0x00ff00);
    }

    if (item.object.name === "theBox") {
      item.object.rotation.x = time / 1000;
      item.object.rotation.y = time / 1000;
    }
  });

  plane2.geometry.attributes.position.array[0] = 10 * Math.random();
  plane2.geometry.attributes.position.array[1] = 10 * Math.random();
  plane2.geometry.attributes.position.array[2] = 10 * Math.random();

  plane2.geometry.attributes.position.array[lastIndexZ] = 10 * Math.random();

  plane2.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
