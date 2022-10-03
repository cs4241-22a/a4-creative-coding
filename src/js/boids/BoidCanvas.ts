import Flock from "./Flock";
import Boid from "./Boid";
import * as P5 from "p5";
import ReactiveP5Canvas from "../ReactiveP5Canvas";

let self: BoidCanvas;

let boidCanvasRef: P5;

class BoidCanvas implements ReactiveP5Canvas {

    public boidCount = 200;
    private flock: Flock;

    constructor() {
        self = this;
        this.flock = undefined as unknown as Flock;
    }

    setup(p5: P5, canvasParentRef: Element): void {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of the component)
        p5.createCanvas(p5.windowWidth-20, p5.windowHeight).parent(canvasParentRef);

        BoidCanvas.createFlock(p5);

        boidCanvasRef = p5;
    }

    draw(p5: P5): void {
        p5.background(48);
        //self.flock.renderChunks();
        self.flock.run();

        //BoidCanvas.performaceDetails(p5);
        // NOTE: Do not use setState in the draw function or in functions that are executed
        // in the draw function...
        // please use normal variables or class properties for these purposes
        self.frame++;
    }

    private static createFlock(p5: P5) {
        let boidSize = 7;
        self.flock = new Flock(p5, p5.createVector(-boidSize,-boidSize), p5.width + (2*boidSize), p5.height + (2*boidSize));

        let spawnWidth = 0.3 * p5.width;
        let spawnHeight = 0.3 * p5.height;
        for (let i=0; i<self.boidCount; i++) {
            let newBoid = new Boid(p5, i, p5.createVector(
                (Math.random() * spawnWidth) + (p5.width / 2) - (spawnWidth/2),
                (Math.random() * spawnHeight) + (p5.height / 2) - (spawnHeight/2)));
            newBoid.r = boidSize;

            // Set the velocity in a random direction
            let angle = Math.random() * (2 * Math.PI);
            let newVel = p5.createVector(Math.cos(angle), Math.sin(angle));
            newVel.setMag(newBoid.maxSpeed);
            newBoid.velocity = newVel;

            self.flock.addBoid(newBoid);
        }
    }

    private frame: number = 0;
    private frameRate: number = 60;
    private deltaTime: number = 0;

    performaceDetails(p5: P5) {
        // Display dev information (framerate and delta time)
        p5.fill(0);
        p5.rect(0,0,200,50);
        p5.fill(255);
        if (this.frame % 20 === 0) {
            this.frameRate = Math.round(p5.frameRate());
            this.deltaTime = p5.deltaTime;
        }
        p5.text(`${this.frameRate} fps`, 10, 40);
        p5.text(`Delta t: ${this.frameRate} millis`, 10, 25);
    }

    windowResized(p5: P5)  {
        p5.resizeCanvas(p5.windowWidth-20, p5.windowHeight);

        BoidCanvas.createFlock(p5);
    }
}



export {BoidCanvas, boidCanvasRef};