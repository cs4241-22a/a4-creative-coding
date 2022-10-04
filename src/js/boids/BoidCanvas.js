import Flock from "./Flock";
import Boid from "./Boid";
import { Vector3 } from "babylonjs";
let self;
class BoidCanvas {
    constructor(cursor) {
        this.boidCount = 200;
        self = this;
        this.flock = undefined;
        this.cursor = cursor;
    }
    setup(scene, canvasParentRef) {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of the component)
        scene.createCanvas(scene.windowWidth - 20, scene.windowHeight).parent(canvasParentRef);
        BoidCanvas.createFlock(scene);
        boidCanvasRef = scene;
    }
    run(scene) {
        //self.flock.renderChunks();
        self.flock.run();
        //BoidCanvas.performaceDetails(p5);
    }
    static createFlock(scene) {
        let boidSize = 7;
        self.flock = new Flock(scene, scene.createVector(-boidSize, -boidSize), scene.width + (2 * boidSize), scene.height + (2 * boidSize));
        let spawnArea = Vector3.One().scale(10);
        for (let i = 0; i < self.boidCount; i++) {
            let newBoid = new Boid(scene, i, scene.createVector((Math.random() * spawnWidth) + (scene.width / 2) - (spawnWidth / 2), (Math.random() * spawnHeight) + (scene.height / 2) - (spawnHeight / 2)));
            newBoid.r = boidSize;
            // Set the velocity in a random direction
            let angle = Math.random() * (2 * Math.PI);
            let newVel = scene.createVector(Math.cos(angle), Math.sin(angle));
            newVel.setMag(newBoid.maxSpeed);
            newBoid.velocity = newVel;
            self.flock.addBoid(newBoid);
        }
    }
}
export { BoidCanvas };
