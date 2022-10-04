import { MeshBuilder, Vector3 } from "babylonjs";
import { distance, limit } from "../Utils";
class Boid {
    constructor(scene, id, pos) {
        this.id = id;
        this.position = pos;
        this.velocity = Vector3.Zero();
        this.acceleration = Vector3.Zero();
        this.neighbors = [];
        this.chunk = {};
        // Constraints
        this.r = 7;
        this.maxSpeed = 3;
        this.maxForce = 0.03;
        this.neighborDist = 50;
        this.desiredSeparation = 25; // Should be less than neighborDist
        this.forceMultiplier = 1; // Multiplies all of the following forces
        this.separationMultiplier = 2; // Forces boids to separate to desiredSeparation
        this.cohesionMultiplier = 0.5; // Forces boids towards one another when within neighborDist
        this.alignmentMultiplier = 1; // Forces boids to turn in the same direction as those within neighborDist
        this.mouseMultiplier = 10; // Forces boids away from the mouse. Make negative to attract them to the mouse
        this.scene = scene;
        this.mesh = MeshBuilder.CreateBox('newBox', { size: 0.5 }, this.scene);
    }
    // Draw lines between all boids in range with alphas inversely proportional to their distance
    // renderLines() {
    //     this.neighbors.forEach((boid, i) => {
    //         // Need to check if their in range again because it may not have been updated
    //         if (this.position.dist(boid.position) < this.neighborDist) {
    //             let lineColor = this.p5.color(`rgba(255, 128, 26, ${10 / distance(this.position, boid.position)})`);
    //             this.p5.stroke(lineColor);
    //             this.p5.line(this.renderPosition().x, this.renderPosition().y, boid.renderPosition().x, boid.renderPosition().y);
    //         }
    //     });
    // }
    renderPosition() {
        return this.position.add(this.chunk.flock.position);
    }
    run(boids) {
        this.flock(boids);
        this.update();
        this.borders();
        this.updateChunk();
    }
    // If this boids chunk is defined and it no longer contains this boid, move to the appropriate chunk
    updateChunk() {
        if (this.chunk !== undefined && !this.chunk.contains(this.position)) {
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
        if (this.position.x < 0)
            this.position.x = this.chunk.flock.width - 1;
        if (this.position.y < 0)
            this.position.y = this.chunk.flock.height - 1;
        if (this.position.x > this.chunk.flock.width)
            this.position.x = 0;
        if (this.position.y > this.chunk.flock.height)
            this.position.y = 0;
    }
    applyForce(force) {
        this.acceleration.addInPlace(force);
    }
    flock(boids) {
        // Get all boids within range
        this.neighbors = [];
        boids.forEach((boid, i) => {
            let d = this.position.subtract(boid.position).length();
            if (d < this.neighborDist)
                this.neighbors.push(boid);
        });
        let sep = this.separate(this.neighbors);
        let ali = this.align(this.neighbors);
        let coh = this.cohesion(this.neighbors);
        // Get mouse position and calculate a repulsion vector
        let cursor = Vector3.Zero();
        let cursorPos = new Vector3(this.p5.mouseX, this.p5.mouseY); // TODO: Get mouse Pos
        if (distance(this.position, cursorPos) < 200)
            cursor = this.seek(cursorPos).scale(-1);
        // Force weights
        sep.scaleInPlace(this.forceMultiplier * this.separationMultiplier);
        ali.scaleInPlace(this.forceMultiplier * this.alignmentMultiplier);
        coh.scaleInPlace(this.forceMultiplier * this.cohesionMultiplier);
        cursor.scaleInPlace(this.forceMultiplier * this.mouseMultiplier);
        // Apply forces
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
        this.applyForce(cursor);
        this.applyForce(this.forward());
    }
    forward() {
        let velCopy = this.velocity.clone();
        velCopy.normalize();
        return velCopy;
    }
    seek(target) {
        // Normalized vector pointing towards the target
        let targetVel = target.subtract(this.position);
        targetVel.normalize().scaleInPlace(1 / this.maxSpeed);
        // Delta vector to targetVel to apply an appropriate force
        let steer = targetVel.subtract(this.velocity);
        steer = limit(steer, this.maxForce);
        return steer;
    }
    // Returns the force to steer away from nearby boids
    separate(boids) {
        let steer = Vector3.Zero();
        let count = 0;
        // For every boid in the system, check if it's too close
        boids.forEach((other, i) => {
            let d = distance(this.position, other.position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < this.desiredSeparation)) {
                // Calculate vector pointing away from neighbor
                let diff = this.position.subtract(other.position);
                diff.normalize();
                diff.scaleInPlace(1 / d); // Weight by distance
                steer.add(diff);
                count++; // Keep track of how many
            }
        });
        // Average -- divide by how many
        if (count > 0) {
            steer.scaleInPlace(1 / count);
        }
        // As long as the vector is greater than 0
        if (steer.length() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize().scaleInPlace(this.maxSpeed);
            steer.subtractInPlace(this.velocity);
            steer = limit(steer, this.maxForce);
        }
        return steer;
    }
    // Steer towards the average velocity of all nearby boids
    align(boids) {
        let sum = Vector3.Zero();
        let count = 0;
        boids.forEach((other, i) => {
            let d = distance(this.position, other.position);
            if (d > 0) {
                sum.add(other.velocity);
                count++;
            }
        });
        if (count > 0) {
            sum.scaleInPlace(1 / count);
            // Implement Reynolds: Steering = Desired - Velocity
            sum.normalize().scaleInPlace(this.maxSpeed);
            let steer = sum.subtract(this.velocity);
            steer = limit(steer, this.maxForce);
            return steer;
        }
        else {
            return Vector3.Zero();
        }
    }
    // Steer towards the average position of all nearby boids
    cohesion(boids) {
        let sum = Vector3.Zero(); // Start with empty vector to accumulate all positions
        let count = 0;
        boids.forEach((other, i) => {
            let d = distance(this.position, other.position);
            if (d > 0) {
                sum.add(other.position); // Add position
                count++;
            }
        });
        if (count > 0) {
            sum.scaleInPlace(1 / count);
            return this.seek(sum); // Steer towards the position
        }
        else {
            return Vector3.Zero();
        }
    }
}
export default Boid;
