import Flock from "./Flock";
import Boid from "./Boid";

class BoidChunk {

    row: number;
    column: number;

    height: number;
    width: number;

    boids: Array<Boid>;
    flock: Flock;

    constructor(row: number, col: number, width: number, height: number, flock: Flock) {
        this.row = row;
        this.column = col;

        this.height = height;
        this.width = width;

        this.boids = [];
        this.flock = flock;

        this.p5 = p5;
    }

    // Remove a specified boid by the boid id
    removeBoid(id: number) {
        for(let i=0; i<this.boids.length; i++) {
            let boid = this.boids[i];
            if (boid.id === id) {
                this.boids.splice(i, 1);
                break;
            }
        }
    }

    // **Use this instead of manually setting the boid chunk of the boid**
    // Adds the boid and sets its chunk to this
    addBoid(boid: Boid) {
        this.boids.push(boid);
        boid.chunk = this;
    }

    // Checks if this cell contains given coordinates
    contains(coordinates: P5.Vector) {
        let xContained = (coordinates.x >= this.width*this.row) && (coordinates.x < this.width*(this.row+1));
        let yContained = (coordinates.y >= this.height*this.column) && (coordinates.y < this.height*(this.column+1));

        return xContained && yContained;
    }

    position() {
        return this.flock.position.copy().add(
            this.p5.createVector(this.flock.position.x + (this.column * this.flock.chunkSize),
                this.flock.position.y + (this.row * this.flock.chunkSize))
        );
    }
}

export default BoidChunk;