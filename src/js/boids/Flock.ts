import * as P5 from "p5";
import BoidChunk from "./BoidChunk";
import Boid from "./Boid";

class Flock {

    position: P5.Vector;
    width: number;
    height: number;

    chunks: Array<Array<BoidChunk>>;
    chunkSize: number = 0;
    numCols: number = 0;
    numRows: number = 0;

    p5: P5;

    constructor(p5: P5, pos: P5.Vector, width: number, height: number) {
        this.position = pos;
        this.width = width;
        this.height = height;

        this.chunks = [];

        this.p5 = p5;
    }

    // Runs every boid in every chunk
    run() {
        this.chunks.forEach((boidRow, row) => {
            boidRow.forEach((boidCell, col) => {
                boidCell.boids.forEach((boid, i) => {
                    // Get all boids in current and neighboring chunks
                    let neighboringBoids = this.allBoidsIn(this.cellAndNeighboring(row, col))
                    boid.flock(neighboringBoids);
                });
            });
        });

        this.chunks.forEach((boidRow, row) => {
            boidRow.forEach((boidCell, col) => {
                boidCell.boids.forEach((boid, i) => {
                    boid.update();
                });
            });
        });

        this.chunks.forEach((boidRow, row) => {
            boidRow.forEach((boidCell, col) => {
                boidCell.boids.forEach((boid, i) => {
                    boid.borders();
                });
            });
        });

        this.chunks.forEach((boidRow, row) => {
            boidRow.forEach((boidCell, col) => {
                boidCell.boids.forEach((boid, i) => {
                    boid.updateChunk();
                });
            });
        });

        this.chunks.forEach((boidRow, row) => {
            boidRow.forEach((boidCell, col) => {
                boidCell.boids.forEach((boid, i) => {
                    boid.renderLines();
                });
            });
        });

        this.chunks.forEach((boidRow, row) => {
            boidRow.forEach((boidCell, col) => {
                boidCell.boids.forEach((boid, i) => {
                    boid.render();
                });
            });
        });
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
        (this.chunks[boidRow][boidCol]).addBoid(boid);
    }

    // Create an array of chunks based on the screen size and cell size
    generateChunks(chunkSize: number) {
        this.chunkSize = chunkSize;
        this.numRows = Math.ceil(this.height / this.chunkSize);
        this.numCols = Math.ceil(this.width / this.chunkSize);
        for (let row = 0; row < this.numRows; row++) {
            let currentRow = [];
            for (let col = 0; col < this.numCols; col++) {
                currentRow.push(new BoidChunk(this.p5, row, col, this.chunkSize, this.chunkSize, this));
            }
            this.chunks.push(currentRow);
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
                let fillColor = this.p5.color(`rgba(0,147,246,${opacityFunc(chunk.boids.length)})`);
                this.p5.fill(fillColor);
                this.p5.rect(this.position.x + chunk.position().x, this.position.y + chunk.position().y, chunk.width, chunk.height);
                this.p5.fill(255)
                this.p5.text(`${chunk.boids.length} boids`, this.position.x + chunk.position().x, this.position.y + chunk.position().y + (chunk.height / 2))
            });
        });
    }
}

export default Flock;