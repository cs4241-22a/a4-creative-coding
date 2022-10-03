import {ArcRotateCamera, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";

// create the canvas html element and attach it to the webpage
var canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.id = "gameCanvas";
document.body.appendChild(canvas);

// initialize babylon scene and engine
const engine = new Engine(canvas, true);
const scene = new Scene(engine);
// let up: BABYLON.Vector4 = BABYLON.Quaternion.FromEulerVector(BABYLON.Vector3.Up());

const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
camera.attachControl(canvas, true);
const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
const plane: Mesh = MeshBuilder.CreatePlane("Plane", {size: 2, sideOrientation: Mesh.DOUBLESIDE}, scene);

// hide/show the Inspector
window.addEventListener("keydown", (ev) => {
	// Shift+Ctrl+Alt+I
	if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
		if (scene.debugLayer.isVisible()) {
			scene.debugLayer.hide();
		} else {
			scene.debugLayer.show();
		}
	}
});

canvas.addEventListener("scroll", ev => ev.preventDefault());

// run the main render loop
engine.runRenderLoop(() => {
	scene.render();
});