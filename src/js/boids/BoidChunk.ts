import Flock from "./Flock";
import Boid from "./Boid";
import {Scene, Vector3} from "babylonjs";

class BoidChunk {

    // Coordinate Properties
    coordinate: Vector3
    get row(): number { return this.coordinate.x }
    set row(val) { this.coordinate.x = val }

    get column(): number { return this.coordinate.y }
    set column(val) { this.coordinate.y = val }

    get slice(): number { return this.coordinate.z }
    set slice(val) { this.coordinate.z = val }


    // Size Properties
    size: Vector3
    get width(): number { return this.size.x }
    set width(val) { this.size.x = val }

    get height(): number { return this.size.y }
    set height(val) { this.size.y = val }

    get depth(): number { return this.size.z }
    set depth(val) { this.size.z = val }


    boids: Array<Boid>;
    flock: Flock;

    scene: Scene;

    constructor(scene: Scene, coordinate: Vector3, size: number, flock: Flock) {
        this.size = Vector3.One().scale(size);

        this.boids = [];
        this.flock = flock;

        this.scene = scene;
        this.coordinate = coordinate;
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