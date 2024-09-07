import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-90, 140, 140);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
])

const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.update();

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 10000, 300);
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();

const createPlane = (size, position, texture, ring) => {
  const geometry = new THREE.SphereGeometry(size, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  });
  const mesh = new THREE.Mesh(geometry, material);
  const obj = new THREE.Object3D();

  mesh.position.x = position;
  obj.add(mesh);

  if (ring) {
    const ringGeo = new THREE.RingGeometry(ring.inner, ring.outer);
    const ringMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);

    ringMesh.position.x = position;
    ringMesh.rotateX(Math.PI / 2)

    obj.add(ringMesh);
  }

  scene.add(obj);

  return { mesh, obj }
}

const sunGeo = new THREE.SphereGeometry(16, 50, 50);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);

scene.add(sun);

const mercury = createPlane(3.2, 28, mercuryTexture);
const venus = createPlane(5.8, 44, venusTexture);
const earth = createPlane(6, 62, earthTexture);
const mars = createPlane(4, 78, marsTexture);
const jupiter = createPlane(12, 100, jupiterTexture);
const saturn = createPlane(10, 138, saturnTexture, { inner: 10, outer: 20, texture: saturnRingTexture });
const uranus = createPlane(7, 176, uranusTexture, { inner: 7, outer: 12, texture: uranusRingTexture });
const neptune = createPlane(7, 200, neptuneTexture);
const pluto = createPlane(2.8, 216, plutoTexture);

const animate = () => {

  //Self rotation
  sun.rotateY(0.004)
  mercury.mesh.rotateY(0.004)
  venus.mesh.rotateY(0.002)
  earth.mesh.rotateY(0.02)
  mars.mesh.rotateY(0.018)
  jupiter.mesh.rotateY(0.04)
  saturn.mesh.rotateY(0.038)
  uranus.mesh.rotateY(0.03)
  neptune.mesh.rotateY(0.032)
  pluto.mesh.rotateY(0.008)

  // Around sun rotation
  mercury.obj.rotateY(0.04)
  venus.obj.rotateY(0.015)
  earth.obj.rotateY(0.01)
  mars.obj.rotateY(0.008)
  jupiter.obj.rotateY(0.002)
  saturn.obj.rotateY(0.009)
  uranus.obj.rotateY(0.004)
  neptune.obj.rotateY(0.001)
  pluto.obj.rotateY(0.0007)

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})
