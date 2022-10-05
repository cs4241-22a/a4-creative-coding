import { ArcRotateCamera, Engine, MeshBuilder, Scene, Vector3, GizmoManager, HemisphericLight } from "babylonjs";
import Flock from "./boids/Flock.js";
import Boid from "./boids/Boid.js";
// **************************
// * Setup Babylon JS Scene *
// **************************
// create the canvas html element and attach it to the webpage
var canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.id = "gameCanvas";
document.body.appendChild(canvas);
// initialize babylon scene and engine
const engine = new Engine(canvas, true);
const scene = new Scene(engine);
const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
camera.attachControl(canvas, true);
// Add lighting
const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
// *****************************
// * Create new Flock of Boids *
// *****************************
// Make Cursor with gizmo
const gizmoManager = new GizmoManager(scene);
const cursor = MeshBuilder.CreateSphere("Cursor", { diameter: 1 }, scene);
gizmoManager.positionGizmoEnabled = true;
gizmoManager.enableAutoPicking = false;
gizmoManager.attachToMesh(cursor);
// Make flock and bounding box for flock
const areaSize = Vector3.One().scale(200);
const flock = new Flock(scene, cursor, areaSize.scale(-0.5), areaSize);
// Spawn agents in the center
let spawnArea = Vector3.One().scale(20);
let boidCount = 100;
for (let i = 0; i < boidCount; i++) {
    let newBoid = new Boid(scene, i, new Vector3(Math.random() * spawnArea.x, Math.random() * spawnArea.y, Math.random() * spawnArea.z), MeshBuilder.CreateBox('Boid', { size: 1 }, scene));
    // Set the velocity in a random direction
    let newVel = new Vector3(Math.random(), Math.random(), Math.random());
    newVel.normalize().scaleInPlace(newBoid.maxSpeed);
    newBoid.velocity = newVel;
    flock.addBoid(newBoid);
}
var lastFrameTime = Date.now();
export var deltaTime = 1000 / 30;
function runFlock() {
    flock.run();
    // Get frame delta time
    const now = Date.now();
    deltaTime = now - lastFrameTime;
    lastFrameTime = now;
    requestAnimationFrame(runFlock);
}
requestAnimationFrame(runFlock);
// hide/show the Inspector
window.addEventListener("keydown", (ev) => {
    // Shift+Ctrl+Alt+I
    if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (scene.debugLayer.isVisible()) {
            scene.debugLayer.hide();
        }
        else {
            scene.debugLayer.show();
        }
    }
});
canvas.addEventListener("scroll", ev => ev.preventDefault());
// run the main render loop
engine.runRenderLoop(() => {
    scene.render();
});
