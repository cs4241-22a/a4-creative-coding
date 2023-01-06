import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import "./style.css";

let canvas, scene, model, size;
let camera, renderer, cam_controller;

main();

function main() {
  console.clear();

  // size of window
  size = { width: window.innerWidth, height: window.innerHeight };

  // create new scene
  scene = new THREE.Scene();

  // CANVAS
  canvas = document.createElement("canvas");
  canvas.setAttribute("class", "webgl");
  document.body.appendChild(canvas);

  // MODELS
  model = new THREE.Group();

  // creating shape and wireframe
  const geometry = new THREE.SphereGeometry(1, 10, 5);
  const material = new THREE.MeshBasicMaterial({
    color: localStorage.getItem("MODEL_COLOR") || "#FFFFFF",
    wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);

  // CAMERA CONTROLLERS
  camera = new THREE.PerspectiveCamera(75, size.width / size.height);
  cam_controller = new OrbitControls(camera, canvas);
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  // CAMERA CONTROLS
  cam_controller.enabled = true;
  cam_controller.enableDamping = true;
  cam_controller.dampingFactor = 0.05;
  camera.position.set(0, 0, 2);

  // Setup
  model.add(mesh);
  scene.add(model);
  scene.add(camera);

  // TWEAKPANE SETTINGS

  // create new pane (overall menu)
  let pane = new Pane({
    title: "EDIT VISUALIZER",
    expanded: true
  });

  // CAMERA SETTINGS drop down
  const camPane = pane.addFolder({
    title: "Camera Settings",
    expanded: true // opened automatically so user sees all options
  });

  // CAMERA SETTINGS options
  // checkbox to enable user to drag shape
  camPane.addInput(cam_controller, "enabled", { label: "Enable Drag" });

  camPane.addSeparator();

  // input boxes to change camera position
  camPane.addInput(model, "position", {
    label: "Camera Position",
    x: { min: -1, max: 1 },
    y: { min: -1, max: 1 },
    z: { min: -12, max: 1 }
  });

  // OBJECT SETTINGS drop down
  const objPane = pane.addFolder({
    title: "Object Settings",
    expanded: true // opened automatically so user sees all options
  });

  // change color of shape
  objPane
    .addInput({ color: material.color.getStyle() }, "color", {
      label: "Color",
      view: "color"
    })
    .on("change", (e) => {
      localStorage.setItem("MODEL_COLOR", e.value);
      material.color.set(e.value);
    });

  objPane.addSeparator();

  // change rotation of shape
  objPane.addInput(model, "rotation", { label: "Rotation" });

  // change scale of shape
  objPane.addInput(model, "scale", { label: "Scale" });

  objPane.addSeparator();

  // checkbox to enable wireframe mode
  objPane.addInput(material, "wireframe", { label: "Wireframe Mode" });

  draw();
}

// render function 
function render() {
  cam_controller.update();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size.width, size.height);

  // render scene
  renderer.render(scene, camera);
}

function draw() {
  render();
  window.requestAnimationFrame(draw);
}
