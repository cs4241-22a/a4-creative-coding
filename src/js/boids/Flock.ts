import BoidChunk from "./BoidChunk";
import Boid from "./Boid";
import {Mesh, Scene, Vector3} from "babylonjs";

class Flock {

	position: Vector3;
	width: number;
	height: number;

	chunks: Array<BoidChunk>;
	chunkSize: number = 0;

	numCols: number = 0;
	numRows: number = 0;
	numSlices: number  = 0;

	cursor: Mesh;

	scene: Scene;

	constructor(scene: Scene, cursor: Mesh, pos: Vector3, width: number, height: number) {
		this.position = pos;
		this.width = width;
		this.height = height;

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
				let neighboringBoids = this.allBoidsIn(this.cellAndNeighboring(boidCell.row, boidCell.column))
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
	cellAndNeighboring(chunkRow: number, chunkCol: number) {
		let localChunks = [];
		let beginningRow = Math.max(chunkRow - 1, 0);
		let beginningCol = Math.max(chunkCol - 1, 0);
		let endingRow = Math.min(chunkRow + 1, this.numRows - 1);
		let endingCol = Math.min(chunkCol + 1, this.numCols - 1);

		for (let row = beginningRow; row <= endingRow; row++) {
			for (let col = beginningCol; col <= endingCol; col++) {
				localChunks.push(this.chunks[row][col]);
				if (this.chunks[row][col] === undefined)
					console.log(`Chunk [${row}] [${col}] is undefined`);
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

	addBoid(boid: Boid) {
		// The first boid added determines the chunk size
		if (this.chunks.length === 0) {
			this.generateChunks(boid.neighborDist);
		}

		// Calculate which chunk the boid should be placed in and add it
		let boidRow = Math.floor(boid.position.y / this.chunkSize);
		let boidCol = Math.floor(boid.position.x / this.chunkSize);
		this.chunks[boidRow].addBoid(boid);
	}

	// Create an array of chunks based on the screen size and cell size
	generateChunks(chunkSize: number) {
		this.chunkSize = chunkSize;
		this.numRows = Math.ceil(this.height / this.chunkSize);
		this.numCols = Math.ceil(this.width / this.chunkSize);
		for (let row = 0; row < this.numRows; row++) {
			for (let col = 0; col < this.numCols; col++) {
				for (let slice = 0; col < this.numSlices; col++) {
					this.chunks.push(new BoidChunk(this.scene, new Vector3(row, col, 0), this.chunkSize, this));
				}
			}
		}

		this.width = this.numCols * this.chunkSize;
		this.height = this.numRows * this.chunkSize;
	}

	renderChunks() {
		let opacityFunc = function(num: number) {
			return -(1/(0.3 * Math.pow(num, 2) + 1)) + 1;
		}

		this.chunks.forEach((chunkRow, row) => {
			chunkRow.forEach((chunk, col) => {
				let fillColor = this.scene.color(`rgba(0,147,246,${opacityFunc(chunk.boids.length)})`);
				this.scene.fill(fillColor);
				this.scene.rect(this.position.x + chunk.position().x, this.position.y + chunk.position().y, chunk.width, chunk.height);
				this.scene.fill(255)
				this.scene.text(`${chunk.boids.length} boids`, this.position.x + chunk.position().x, this.position.y + chunk.position().y + (chunk.height / 2))
			});
		});
	}
}

export default Flock;