import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

let renderer, scene, camera;
let stats, meshKnot;
// let rectLight1;
let rectLight2;
// let rectLight3;

const lightColor = new THREE.Color("#ffffff");
const meshColor = new THREE.Color("hsl(156, 0%, 100%)");

init();

function init() {

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  camera.position.set(0, 5, - 15);

  scene = new THREE.Scene();

  RectAreaLightUniformsLib.init();

  // rectLight1 = new THREE.RectAreaLight(color1, 5, 4, 10);
  // rectLight1.position.set(- 5, 5, 5);
  // scene.add(rectLight1);

  rectLight2 = new THREE.RectAreaLight(lightColor, 5, 5, 10);
  rectLight2.position.set(0, 5, 5);
  scene.add(rectLight2);

  // rectLight3 = new THREE.RectAreaLight(color3, 5, 4, 10);
  // rectLight3.position.set(5, 5, 5);
  // scene.add(rectLight3);

  // scene.add(new RectAreaLightHelper(rectLight1));
  scene.add(new RectAreaLightHelper(rectLight2));
  // scene.add(new RectAreaLightHelper(rectLight3));

  const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
  const matStdFloor = new THREE.MeshStandardMaterial({ color: 0xbcbcbc, roughness: 0.1, metalness: 0 });
  const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
  scene.add(mshStdFloor);

  const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 20, 2, 1);
  const matKnot = new THREE.MeshStandardMaterial({ color: meshColor, roughness: 0.1, metalness: 0.4 });
  meshKnot = new THREE.Mesh(geoKnot, matKnot);
  meshKnot.position.set(0, 5, 0);
  scene.add(meshKnot);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(meshKnot.position);
  controls.update();
  controls.enabled = false;

  window.addEventListener('resize', onWindowResize);

  document.addEventListener('mousemove', onMouseMove);

  // stats = new Stats();
  // document.body.appendChild(stats.dom);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = (window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
}

function animation(time) {
  meshKnot.rotation.y = time / 2000;
  meshKnot.scale.setScalar(1 + Math.sin(time / 500) * 0.1);
  renderer.render(scene, camera);
  // stats.update();
}

function onMouseMove(event) {
  const x = (event.clientX / window.innerWidth);
  const y = (event.clientY / window.innerHeight);

  // map x (0-1) to hsl saturation (0-100)
  // map y (0-1) to hsl hue color (0 -> 360)
  rectLight2.color.setHSL(y, x, 0.5);
}