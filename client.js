import * as THREE from "three";
import * as dat from "https://cdn.skypack.dev/dat.gui";
import { MTLLoader } from "./node_modules/three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "./node_modules/three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js"


var control

//control pads
// gameControl.on("connect", function (gamepad) {
//   console.log(gamepad);
// });

var mtlLoader = new MTLLoader();
var gun = undefined;
// mtlLoader.load("./65-m9/M9.mtl", function (material) {
//   material.preload();
//   var objLoader = new OBJLoader();
//   objLoader.setMaterials(material);
//   objLoader.load("./65-m9/M9.obj", function (object) {
//     object.rotation.x = 90;
//     object.rotation.y = 90;
//     gun = object;
//     scene.add(object);
//   });
// });

var objLoader = new OBJLoader();
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
objLoader.load('./source/LP.obj', object => {
  objLoader.setMaterials(material)
  gun = object;
  scene.add(object)
})

//3 main components to create a visualization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

//Set the ouput size of the renderer
renderer.setSize(innerWidth, innerHeight);

document.body.appendChild(renderer.domElement);

//create the sliding bars
const gui = new dat.GUI();
const cube_para = {
  height: 0,
  width: 0,
  length: 0,
};

//Creating geometry
const geometry = new THREE.BoxGeometry(
  cube_para.height,
  cube_para.width,
  cube_para.length
);
// const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

//Adding sliding bars
gui.add(cube_para, "height", 0, 5).onChange(genCube);
gui.add(cube_para, "width", 0, 5).onChange(genCube);
gui.add(cube_para, "length", 0, 5).onChange(genCube);

//creating light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 5);
scene.add(light);

//Adding the box into scene
scene.add(cube);

//Reposition camera
camera.position.z = 10;

control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;
control.dampingFactor = 0.03;

function animate() {
  control.update()
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  renderer.render(scene, camera);
}
animate();

function genCube() {
  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(
    cube_para.height,
    cube_para.width,
    cube_para.length
  );
}

// const scene = new THREE.Scene()

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
// camera.position.z = 2

// const renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// const controls = new OrbitControls(camera, renderer.domElement)

// const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
//     wireframe: true,
// })
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

// window.addEventListener(
//     'resize',
//     () => {
//         camera.aspect = window.innerWidth / window.innerHeight
//         camera.updateProjectionMatrix()
//         renderer.setSize(window.innerWidth, window.innerHeight)
//         render()
//     },
//     false
// )

// const stats = Stats()
// document.body.appendChild(stats.dom)

// const gui = new GUI()
// const cubeFolder = gui.addFolder('Cube')
// cubeFolder.add(cube.scale, 'x', -5, 5)
// cubeFolder.add(cube.scale, 'y', -5, 5)
// cubeFolder.add(cube.scale, 'z', -5, 5)
// cubeFolder.open()
// const cameraFolder = gui.addFolder('Camera')
// cameraFolder.add(camera.position, 'z', 0, 10)
// cameraFolder.open()

// function animate() {
//     requestAnimationFrame(animate)
//     cube.rotation.x += 0.01
//     cube.rotation.y += 0.01
//     controls.update()
//     render()
//     stats.update()
// }

// function render() {
//     renderer.render(scene, camera)
// }

// animate()
