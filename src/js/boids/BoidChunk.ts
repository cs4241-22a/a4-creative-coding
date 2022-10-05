import Flock from "./Flock.js";
import Boid from "./Boid.js";
import {Scene, Vector3} from "babylonjs";


class BoidChunk {

    // Coordinate Properties
    coordinates: Vector3
    get row(): number { return this.coordinates.x }
    set row(val) { this.coordinates.x = val }

    get column(): number { return this.coordinates.y }
    set column(val) { this.coordinates.y = val }

    get slice(): number { return this.coordinates.z }
    set slice(val) { this.coordinates.z = val }


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
        this.coordinates = coordinate;
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
    contains(coordinates: Vector3) {
        let xContained = (coordinates.x >= this.width*this.row) && (coordinates.x < this.width*(this.row+1));
        let yContained = (coordinates.y >= this.height*this.column) && (coordinates.y < this.height*(this.column+1));
        let zContained = (coordinates.z >= this.depth*this.slice) && (coordinates.z < this.depth*(this.slice+1));

        return xContained && yContained && zContained;
    }

    position() {
        return this.flock.position.add(
            new Vector3(this.flock.position.x + (this.column * this.flock.chunkSize),
                this.flock.position.y + (this.row * this.flock.chunkSize),
                this.flock.position.z + (this.slice * this.flock.chunkSize))
        );
    }
}

export default BoidChunk;