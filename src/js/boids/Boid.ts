import BoidChunk from "./BoidChunk";
import {Mesh, Scene, Vector3} from "babylonjs";

class Boid {

    id: number;

    position: Vector3;
    velocity: Vector3;
    acceleration: Vector3;

    neighbors: Array<Boid>;
    chunk: BoidChunk;

    r: number;
    maxSpeed: number;
    maxForce: number;
    neighborDist: number;
    desiredSeparation: number;
    forceMultiplier: number;
    separationMultiplier: number;
    cohesionMultiplier: number;
    alignmentMultiplier: number;
    mouseMultiplier: number;

    mesh: Mesh;
    scene: Scene

    constructor(scene: Scene, mesh: Mesh, id: number, pos: Vector3) {
        this.id = id;

        this.position = pos;
        this.velocity = Vector3.Zero();
        this.acceleration = Vector3.Zero();

        this.neighbors = [];
        this.chunk = <BoidChunk>{};

        // Constraints
        this.r = 7;
        this.maxSpeed = 3;
        this.maxForce = 0.03;

        this.neighborDist = 50;
        this.desiredSeparation = 25;    // Should be less than neighborDist

        this.forceMultiplier = 1;       // Multiplies all of the following forces
        this.separationMultiplier = 2;  // Forces boids to separate to desiredSeparation
        this.cohesionMultiplier = 0.5;  // Forces boids towards one another when within neighborDist
        this.alignmentMultiplier = 1; // Forces boids to turn in the same direction as those within neighborDist
        this.mouseMultiplier = 10;      // Forces boids away from the mouse. Make negative to attract them to the mouse

        this.scene = scene;
        this.mesh = mesh;
    }

    // Draw lines between all boids in range with alphas inversely proportional to their distance
    renderLines() {
        this.neighbors.forEach((boid, i) => {
            // Need to check if their in range again because it may not have been updated
            if (this.position.dist(boid.position) < this.neighborDist) {
                let lineColor = this.p5.color(`rgba(255, 128, 26, ${10 / this.position.dist(boid.position)})`);
                this.p5.stroke(lineColor);
                this.p5.line(this.renderPosition().x, this.renderPosition().y, boid.renderPosition().x, boid.renderPosition().y);
            }
        });
    }

    renderPosition() {
        return this.p5.createVector(this.position.x + this.chunk.flock.position.x, this.position.y + this.chunk.flock.position.x);
    }

    run(boids: Array<Boid>) {
        this.flock(boids);
        this.update();
        this.borders();
        this.updateChunk();
    }

    // If this boids chunk is defined and it no longer contains this boid, move to the appropriate chunk
    updateChunk() {
        if(this.chunk !== undefined && !this.chunk.contains(this.position)) {
            let flock = this.chunk.flock;

            // Calculate the new row and column based on the position
            let newRow = Math.floor(this.position.y / flock.chunkSize);
            let newCol = Math.floor(this.position.x / flock.chunkSize);
            let newChunk = flock.chunks[newRow][newCol];
            // Remove this boid from the old chunk and add it to the new one
            this.chunk.removeBoid(this.id);
            newChunk.addBoid(this);
        }
    }

    update() {
        this.velocity.addInPlace(this.acceleration);

        // Set velocity to max speed
        this.velocity.normalize();
        this.velocity.scaleInPlace(this.maxSpeed);

        this.position.addInPlace(this.velocity.scale(this.scene.deltaTime * 0.05));
        this.acceleration.scaleInPlace(0);
    }

    // Wraps position to the other side when moving offscreen
    borders() {
        if (this.position.x < 0) this.position.x = this.chunk.flock.width-1;
        if (this.position.y < 0) this.position.y = this.chunk.flock.height-1;
        if (this.position.x > this.chunk.flock.width) this.position.x = 0;
        if (this.position.y > this.chunk.flock.height) this.position.y = 0;
    }

    applyForce(force: Vector3) {
        this.acceleration.addInPlace(force);
    }

    flock(boids: Array<Boid>) {
        // Get all boids within range
        this.neighbors = [];
        boids.forEach((boid, i) => {
            let d = this.position.subtract(boid.position).length();
            if(d < this.neighborDist)
                this.neighbors.push(boid);
        });

        let sep = this.separate(this.neighbors);
        let ali = this.align(this.neighbors);
        let coh = this.cohesion(this.neighbors);

        // Get mouse position and calculate a repulsion vector
        let mouse = this.p5.createVector(0,0);
        let mousePos = this.p5.createVector(this.p5.mouseX, this.p5.mouseY);
        if(this.position.dist(mousePos) < 200)
            mouse = this.seek(mousePos).mult(-1);

        // Force weights
        sep.mult(this.forceMultiplier*this.separationMultiplier);
        ali.mult(this.forceMultiplier*this.alignmentMultiplier);
        coh.mult(this.forceMultiplier*this.cohesionMultiplier);
        mouse.mult(this.forceMultiplier*this.mouseMultiplier);

        // Apply forces
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
        this.applyForce(mouse);
        this.applyForce(this.forward());
    }

    forward() {
        let velCopy = this.velocity.copy();
        velCopy.normalize();
        return velCopy;
    }

    seek(target: P5.Vector) {
        // Normalized vector pointing towards the target
        let targetVel = subVects(target, this.position);
        targetVel.setMag(this.maxSpeed);

        // Delta vector to targetVel to apply an appropriate force
        let steer = subVects(targetVel, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    // Returns the force to steer away from nearby boids
    separate(boids: Array<Boid>) {
        let steer = this.p5.createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        boids.forEach((other, i) => {
            let d = this.position.dist(other.position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < this.desiredSeparation)) {
                // Calculate vector pointing away from neighbor
                let diff = subVects(this.position, other.position);
                diff.normalize();
                diff.div(d);        // Weight by distance
                steer.add(diff);
                count++;            // Keep track of how many
            }
        });
        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    // Steer towards the average velocity of all nearby boids
    align(boids: Array<Boid>) {
        let sum = this.p5.createVector(0, 0);
        let count = 0;
        boids.forEach((other, i) => {
            let d = this.position.dist(other.position);
            if (d > 0) {
                sum.add(other.velocity);
                count++;
            }
        });
        if (count > 0) {
            sum.div(count);

            // Implement Reynolds: Steering = Desired - Velocity
            sum.setMag(this.maxSpeed);
            let steer = subVects(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }
        else {
            return this.p5.createVector(0, 0);
        }
    }

    // Steer towards the average position of all nearby boids
    cohesion(boids: Array<Boid>) {
        let sum = this.p5.createVector(0, 0);   // Start with empty vector to accumulate all positions
        let count = 0;
        boids.forEach((other, i) => {
            let d = this.position.dist(other.position);
            if (d > 0) {
                sum.add(other.position); // Add position
                count++;
            }
        });

        if (count > 0) {
            sum.div(count);
            return this.seek(sum);  // Steer towards the position
        }
        else {
            return this.p5.createVector(0, 0);
        }
    }

}

export default Boid;