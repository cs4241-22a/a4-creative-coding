import { Vector3 } from "babylonjs";
class BoidChunk {
    constructor(scene, coordinate, size, flock) {
        this.size = Vector3.One().scale(size);
        this.boids = [];
        this.flock = flock;
        this.scene = scene;
        this.coordinates = coordinate;
    }
    get row() { return this.coordinates.x; }
    set row(val) { this.coordinates.x = val; }
    get column() { return this.coordinates.y; }
    set column(val) { this.coordinates.y = val; }
    get slice() { return this.coordinates.z; }
    set slice(val) { this.coordinates.z = val; }
    get width() { return this.size.x; }
    set width(val) { this.size.x = val; }
    get height() { return this.size.y; }
    set height(val) { this.size.y = val; }
    get depth() { return this.size.z; }
    set depth(val) { this.size.z = val; }
    // Remove a specified boid by the boid id
    removeBoid(id) {
        for (let i = 0; i < this.boids.length; i++) {
            let boid = this.boids[i];
            if (boid.id === id) {
                this.boids.splice(i, 1);
                break;
            }
        }
    }
    // **Use this instead of manually setting the boid chunk of the boid**
    // Adds the boid and sets its chunk to this
    addBoid(boid) {
        this.boids.push(boid);
        boid.chunk = this;
    }
    // Checks if this cell contains given coordinates
    contains(coordinates) {
        let xContained = (coordinates.x >= this.width * this.row) && (coordinates.x < this.width * (this.row + 1));
        let yContained = (coordinates.y >= this.height * this.column) && (coordinates.y < this.height * (this.column + 1));
        let zContained = (coordinates.z >= this.depth * this.slice) && (coordinates.z < this.depth * (this.slice + 1));
        return xContained && yContained && zContained;
    }
    position() {
        return this.flock.position.add(new Vector3(this.flock.position.x + (this.column * this.flock.chunkSize), this.flock.position.y + (this.row * this.flock.chunkSize), this.flock.position.z + (this.slice * this.flock.chunkSize)));
    }
}
export default BoidChunk;
