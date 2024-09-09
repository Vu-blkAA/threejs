import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const doggoHref = new URL('../assets/doggo2.glb', import.meta.url).href;

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

camera.position.set(2, 10, 10);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 100000, 1);
ambientLight.position.set(-30, 30, 0)
scene.add(ambientLight);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const loader = new GLTFLoader();
let mixer;

loader.load(doggoHref, (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;
  // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');

  clips.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
  })

  // const action = mixer.clipAction(clip);
  // action.play();
})

const clock = new THREE.Clock();
let delta = 0;

function animate() {
  if (mixer) {
    delta = clock.getDelta();
    mixer.update(delta)
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
