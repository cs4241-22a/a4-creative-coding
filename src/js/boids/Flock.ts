import BoidChunk from "./BoidChunk.js";
import Boid from "./Boid.js";
import {Mesh, MeshBuilder, Scene, Vector3} from "babylonjs";

class Flock {

	position: Vector3;

	size: Vector3
	get width() { return this.size.x }
	get height() { return this.size.y }
	get depth() { return this.size.z }

	chunks: Array<BoidChunk>;
	chunkSize: number = 0;

	chunkArrayDims: Vector3
	get numRows() { return this.chunkArrayDims.x; }
	set numRows(val) { this.chunkArrayDims.x = val; }
	get numCols() { return this.chunkArrayDims.y; }
	set numCols(val) { this.chunkArrayDims.y = val; }
	get numSlices() { return this.chunkArrayDims.z; }
	set numSlices(val) { this.chunkArrayDims.z = val; }

	cursor: Mesh;

	scene: Scene;

	constructor(scene: Scene, cursor: Mesh, pos: Vector3, size: Vector3) {
		this.position = pos;
		this.size = size;
		this.chunkArrayDims = new Vector3();

		this.chunks = [];

		this.cursor = cursor;
		this.scene = scene;
	}

	// Runs every boid in every chunk
	run() {
		// Lookup neighboring boids
		for (const boidCell of this.chunks) {
			for(const boid of boidCell.boids) {
				// Get all boids in current and neighboring chunks
				let neighboringBoids = this.allBoidsIn(this.cellAndNeighboring(boidCell.row, boidCell.column, boidCell.slice));
				boid.flock(neighboringBoids);
			}
		}

		// Set boid velocities based on forces
		for (const boidCell of this.chunks) {
			for(const boid of boidCell.boids) {
				boid.update();
			}
		}

		// Teleport to the opposite side if the boid reaches a border
		for (const boidCell of this.chunks) {
			for(const boid of boidCell.boids) {
				boid.borders();
			}
		}

		// Move to appropriate chunk based on position
		for (const boidCell of this.chunks) {
			for(const boid of boidCell.boids) {
				boid.updateChunk();
			}
		}
	}

	// Returns an array containing the chunk at the given row and column and its neighbors
	cellAndNeighboring(chunkRow: number, chunkCol: number, chunkSlice: number) {
		const localChunks = [];
		const beginningRow = Math.max(chunkRow - 1, 0);
		const beginningCol = Math.max(chunkCol - 1, 0);
		const beginningSlice = Math.max(chunkSlice - 1, 0);
		const endingRow = Math.min(chunkRow + 1, this.numRows - 1);
		const endingCol = Math.min(chunkCol + 1, this.numCols - 1);
		const endingSlice = Math.min(chunkSlice + 1, this.numSlices - 1);

		for (let row = beginningRow; row <= endingRow; row++) {
			for (let col = beginningCol; col <= endingCol; col++) {
				for (let slice = beginningSlice; slice <= endingSlice; slice++) {
					localChunks.push(this.getChunk(row, col, slice));
					if (this.getChunk(row, col, slice) === undefined)
						console.log(`Chunk [${row}] [${col}] [${slice}] is undefined`);
				}
			}
		}

		return localChunks;
	}

	// Returns a list of all the boids in the given list of chunks
	allBoidsIn(chunks: Array<BoidChunk>): Array<Boid> {
		let boids: Array<Boid> = [];
		chunks.forEach((chunk, i) => {
			chunk.boids.forEach((boid, j) => {
				boids.push(boid);
			});
		});

		return boids;
	}

	getChunk(row: number, column: number, slice: number): BoidChunk {
		const rowOffset = row * this.numCols * this.numSlices;
		const colOffset = column * this.numSlices;

		return this.chunks[rowOffset + colOffset + slice];
	}

	addBoid(boid: Boid) {
		// The first boid added determines the chunk size
		if (this.chunks.length === 0) {
			this.generateChunks(boid.neighborDist);
		}

		// Calculate which chunk the boid should be placed in and add it
		let boidRow = Math.floor(boid.position.y / this.chunkSize);
		let boidCol = Math.floor(boid.position.x / this.chunkSize);
		let boidSlice = Math.floor(boid.position.z / this.chunkSize);
		this.getChunk(boidRow, boidCol, boidSlice).addBoid(boid);
	}

	// Create an array of chunks based on the screen size and cell size
	generateChunks(chunkSize: number) {
		this.chunkSize = chunkSize;
		this.numRows = Math.ceil(this.height / this.chunkSize);
		this.numCols = Math.ceil(this.width / this.chunkSize);
		this.numSlices = Math.ceil(this.depth / this.chunkSize);
		for (let row = 0; row < this.numRows; row++) {
			for (let col = 0; col < this.numCols; col++) {
				for (let slice = 0; slice < this.numSlices; slice++) {
					const newChunk = new BoidChunk(this.scene, new Vector3(row, col, slice), this.chunkSize, this);
					this.chunks.push(newChunk);
				}
			}
		}

		this.size = this.chunkArrayDims.scale(this.chunkSize);
	}
}

export default Flock;