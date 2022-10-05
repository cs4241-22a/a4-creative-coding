import { Vector3 } from "babylonjs";
import { distance, limit } from "../Utils.js";
import { deltaTime } from "../scripts.js";
class Boid {
    constructor(scene, id, pos, mesh) {
        this.id = id;
        this.scene = scene;
        this.mesh = mesh;
        this.position = pos;
        this.velocity = Vector3.Zero();
        this.acceleration = Vector3.Zero();
        this.neighbors = [];
        this.chunk = {};
        // Constraints
        this.maxSpeed = 0.3;
        this.maxForce = 0.03;
        this.neighborDist = 10;
        this.desiredSeparation = 2; // Should be less than neighborDist
        this.forceMultiplier = 0.25; // Multiplies all of the following forces
        this.separationMultiplier = 1; // Forces boids to separate to desiredSeparation
        this.cohesionMultiplier = 0.1; // Forces boids towards one another when within neighborDist
        this.alignmentMultiplier = 2.5; // Forces boids to turn in the same direction as those within neighborDist
        this.cursorMultiplier = 0.3; // Forces boids away from the mouse. Make negative to attract them to the mouse
    }
    get position() { return this.mesh.position; }
    set position(val) { this.mesh.position = val; }
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
            // Calculate the new chunk coordinate based on the position
            let newRow = Math.floor((this.position.x - flock.position.x) / flock.chunkSize);
            let newCol = Math.floor((this.position.y - flock.position.y) / flock.chunkSize);
            let newSlice = Math.floor((this.position.z - flock.position.z) / flock.chunkSize);
            let newChunk = flock.getChunk(newRow, newCol, newSlice);
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
        // Orient to flight direction
        const fin = Vector3.Up();
        const side = Vector3.Cross(this.forward(), fin);
        this.mesh.rotation = Vector3.RotationFromAxis(side, this.forward(), fin);
        this.position.addInPlace(this.velocity.scale(deltaTime * 0.05));
        this.acceleration.scaleInPlace(0);
    }
    // Wraps position to the other side when moving offscreen
    borders() {
        const flock = this.chunk.flock;
        const offset = 0.01;
        if (this.position.x < flock.position.x)
            this.position.x = flock.position.x + flock.width - offset;
        if (this.position.y < flock.position.y)
            this.position.y = flock.position.y + flock.height - offset;
        if (this.position.z < flock.position.z)
            this.position.z = flock.position.z + flock.depth - offset;
        if (this.position.x > flock.position.x + flock.width)
            this.position.x = flock.position.x + offset;
        if (this.position.y > flock.position.y + flock.height)
            this.position.y = flock.position.y + offset;
        if (this.position.z > flock.position.z + flock.depth)
            this.position.z = flock.position.z + offset;
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
        let cursorPos = this.chunk.flock.cursor.position;
        if (distance(this.position, cursorPos) < 40)
            cursor = this.seek(cursorPos).scale(-1);
        // Force weights
        sep.scaleInPlace(this.forceMultiplier * this.separationMultiplier);
        ali.scaleInPlace(this.forceMultiplier * this.alignmentMultiplier);
        coh.scaleInPlace(this.forceMultiplier * this.cohesionMultiplier);
        cursor.scaleInPlace(this.forceMultiplier * this.cursorMultiplier);
        // Apply forces
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
        this.applyForce(cursor);
        this.applyForce(this.forward());
    }
    forward() {
        const velCopy = this.velocity.clone();
        velCopy.normalize();
        return velCopy;
    }
    seek(target) {
        // Normalized vector pointing towards the target
        let targetVel = target.subtract(this.position);
        targetVel.normalize().scaleInPlace(this.maxSpeed);
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
