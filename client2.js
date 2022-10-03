import * as THREE from "three";
import * as dat from "https://cdn.skypack.dev/dat.gui";
import { MTLLoader } from "./node_modules/three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "./node_modules/three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { BoxGeometry } from "three";

// Basic components
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  5000
);
const renderer = new THREE.WebGLRenderer();
//BG picture setting
scene.background = new THREE.CubeTextureLoader()
  .setPath("./textures/")
  .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

//Positioning the camera
camera.position.z = 300;

//Setting renderer size and append the renderer to html
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

//Playground Bars
const gui = new dat.GUI();
const param = {
  X: 0,
  Y: 0,
  Z: 0,
  Rotate: 0
};
gui.add(param, "X", -30, 30).onChange( GUI_move);
gui.add(param, "Y", -30, 30).onChange( GUI_move);
gui.add(param, "Z", -30, 30).onChange( GUI_move);
gui.add(param, "Rotate", 0, Math.PI).onChange( GUI_move);

//initializing ground geometry & material
const ground_obj = new THREE.PlaneGeometry(
  param.ground_width,
  param.ground_height,
  Math.round(param.ground_width),
  Math.round(param.ground_height)
);
const ground_mtl = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
var ground = new THREE.Mesh(ground_obj, ground_mtl);

//rotate ground before adding
ground.rotation.x = -Math.PI / 2;
//scene.add(ground);

//Randomly generate RGB
const randomBetween = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));
var red = `rgb(255,0,0)`;
var green = `rgb(0,255,0)`;
var blue = `rgb(0,0,255)`;
const colors = [red, green, blue];

//Generating boxes
const group = new THREE.Group();
const x = [0, -100, 100]
const y = [0, 0,0]
const z = [0,0, 0]
for (let i = 0; i < 3; i++) {
  var k = Math.random() * 50;
  if (k < 0.5 * 50) {
    k = 0.5 * 50;
  }
  //var box_obj = new BoxGeometry(k, k, k);
  var box_obj = new THREE.SphereGeometry(k, k, k);

  //   var box_mtl = new THREE.MeshPhongMaterial({ color: colors[i % 3] });
  var r = randomBetween(0, 255);
  var b = randomBetween(0, 255);
  var g = randomBetween(0, 255);
  var color = `rgb(${r},${g},${b})`;

  // var box_mtl = new THREE.MeshPhongMaterial({ color: color });

  var texture_cube = new THREE.CubeTextureLoader()
  .setPath("./textures/")
  .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
  texture_cube.mapping = THREE.CubeRefractionMapping;

  var box_mtl = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: texture_cube, refractionRatio: 0.95 } );

  var box = new THREE.Mesh(box_obj, box_mtl);
  //Create field for generation
  // box.position.x = Math.random() * 200;
  // box.position.y = Math.random() * 200;
  // box.position.z = Math.random() * 200;
  box.position.x = x[i]
  box.position.y = y[i]
  box.position.z = z[i]
  //Create angle with each box
  // box.rotation.x = Math.random() * Math.PI;
  // box.rotation.y = Math.random() * Math.PI;
  // box.rotation.z = Math.random() * Math.PI;
  //Adding random attribute for oscilation
  box.oscilate = Math.random() * 3.1415 * 2;
  box.original_postition = box.position;
  group.add(box);
}
scene.add(group);

//Adding ambient lights
const light = new THREE.AmbientLight(0xffffff, 0.5);
light.position.set(0,100,0);
const light2 = new THREE.AmbientLight(0xffffff, 0.5);
light2.position.set(0,-100,0);
scene.add(light);
scene.add(light2);

//Adding directional Light
var dir_light = undefined;
const add_dir_light = function (x, y, z) {
  dir_light = new THREE.DirectionalLight(0xffffff, 1);
  dir_light.position.set(x, y, z);
  scene.add(dir_light);
};
// add_dir_light(5, 13, 5);
// add_dir_light(-2, -1.5, -2);

//Adding SpotLight
var spotlight = undefined;
const add_spot_light = function (x, y, z) {
  spotlight = new THREE.SpotLight(0xffffff, 1);
  spotlight.position.set(x, y, z);
  spotlight.penumbra = 1;
  spotlight.decay = 2;
  spotlight.distance = 10000;
  scene.add(spotlight);
};
// add_spot_light(-150,0,0);
// add_spot_light(150,0,0);

//Orbit control
const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;

//Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
//Pointer moves triggers
function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function render() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(group.children);
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material.transparent = true;
      intersects[i].object.material.opacity = 0.3;
    }
  }
}

function reset_hover() {
  for (let i = 0; i < group.children.length; i++) {
    if (group.children[i].material) {
      group.children[i].material.opacity = 1.0;
    }
  }
}

//Create waves along z axis
var frame = 0;
function oscilation(frame) {
  for (let i = 0; i < group.children.length; i++) {
    var random_value = group.children[i].oscilate;
    var original_postition = group.children[i].original_postition;
    var position = group.children[i].position;
    position.y = original_postition.y + Math.cos(frame + random_value) * 0.3;
    group.children[i].geometry.attributes.position.needsUpdate = true;
  }
}

//Moving the droplets
function GUI_move() {
  group.position.set(param.X,param.Y,param.Z)
  const y = new THREE.Vector3( 0, 1, 0 );
  group.rotateOnAxis(y,param.Rotate)
  param.Rotate = 0
}

//animation function
function anime() {
  control.update();
  reset_hover();
  render();

  frame += 0.02;
  oscilation(frame);

  renderer.render(scene, camera);
  requestAnimationFrame(anime);
}

//Ground generation function for GUI
function gen_ground() {
  ground.geometry.dispose();
  ground.geometry = new THREE.PlaneGeometry(
    param.ground_width,
    param.ground_height,
    Math.round(param.ground_width),
    Math.round(param.ground_height)
  );
}

//Onclick Function
function onClick() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(group.children);
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material.visible = false;
    }
  }
}

//event listener for raycaster & other events
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", onClick);

//Start
anime();
