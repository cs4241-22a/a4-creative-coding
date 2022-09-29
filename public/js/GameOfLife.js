export class GameOfLife {
    constructor(startingPercent, delay, width, height, fun) {
        this.startingPercent = startingPercent
        this.delay = delay
        this.fun = fun
        this.running = true

        // Determine heights
        this.canvas = document.getElementById('canvas')
        this.canvasContext = this.canvas.getContext("2d")
        this.canvas.width = Math.round(this.canvas.scrollWidth)
        this.canvas.height = Math.round(this.canvas.scrollHeight)
        this.CELL_WIDTH = Math.round(this.canvas.scrollWidth) / width
        this.CELL_HEIGHT = Math.round(this.canvas.scrollHeight) / height
        this.canvas.addEventListener('mousedown', (e) => {
            this.adding = true
            this.addNewCells(this.canvas, e)
        })
        this.canvas.addEventListener('mouseup', (e) => this.adding = false)
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.adding) {
                this.addNewCells(this.canvas, e)
            }
        })

        // Create arrays
        this.current = Array.from(Array(height), () => Array.from(Array(width), () => false))
        this.next = this.current
    }

    generateStartingBoard() {
        for (let row = 0; row < this.current.length; row++) {
            for (let col = 0; col < this.current[0].length; col++) {
                if (this.getRandomInt(1, 100) < this.startingPercent) {
                    this.current[row][col] = true
                }
            }
        }
    }

    async run() {
        this.running = true
        this.generateStartingBoard()
        while (this.running) {
            this.iterate()
            await new Promise(r => setTimeout(r, 1000 * this.delay))
        }
    }

    reset() {
        this.running = false
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.canvasContext.fillStyle = "#000000"
        this.canvasContext.font = "30px Arial"
        this.canvasContext.fillText("Welcome to John Conway's Game of Life", 10, 50)
        this.canvasContext.fillText("Interactions:", 10, 150)
        this.canvasContext.font = "20px Arial"
        this.canvasContext.fillText("1) Change the parameters in the bottom right and press Run", 10, 200)
        this.canvasContext.fillText("2) While running, click and drag your mouse on the screen to add new shapes.", 10, 225)
    }

    iterate() {
        // Update next array and paint from previous
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let row = 0; row < this.current.length; row++) {
            for (let col = 0; col < this.current[0].length; col++) {
                // Background color is white, cell color is black unless fun option is specified, in which case it is a random color
                let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16)
                this.canvasContext.fillStyle = !this.current[row][col] ? "#FFFFFF" : this.fun ? randomColor : "#000000"
                this.canvasContext.fillRect(col * this.CELL_WIDTH, row * this.CELL_HEIGHT, this.CELL_WIDTH, this.CELL_HEIGHT);
                this.updateCell(row, col)
            }
        }

        // Update current using next (this deep copies it)
        this.current = JSON.parse(JSON.stringify(this.next))
    }

    updateCell(row, col) {
        if (this.isCellAlive(row, col) && this.countAliveNeighbors(row, col) < 2) {
            this.next[row][col] = false
        } else if (this.isCellAlive(row, col) && this.countAliveNeighbors(row, col) > 3) {
            this.next[row][col] = false
        } else if (this.isCellDead(row, col) && this.countAliveNeighbors(row, col) === 3) {
            this.next[row][col] = true
        }
    }

    countAliveNeighbors(row, col) {
        let neighbors = 0

        const maxRow = this.current.length - 1
        const maxCol = this.current[0].length - 1

        if (row !== 0 && col !== 0 && this.current[row - 1][col - 1])
            neighbors++                                                        // Above and to the left
        else if (row === 0 && col === 0 && this.current[maxRow][maxCol])
            neighbors++

        if (row !== 0 && this.current[row - 1][col])
            neighbors++                                                         // Directly above
        else if (row === 0 && this.current[maxRow][col])
            neighbors++

        if (row !== 0 && col !== maxCol && this.current[row - 1][col + 1])
            neighbors++                                                         // Above and to the right
        else if (row === 0 && col === maxCol && this.current[maxRow][0])
            neighbors++

        if (col !== maxCol && this.current[row][col + 1])
            neighbors++                                                         // Directly right
        else if (col === maxCol && this.current[row][0])
            neighbors++

        if (row !== maxRow && col !== maxCol && this.current[row + 1][col + 1])
            neighbors++                                                         // Below and to the right
        else if (row === maxRow && col === maxCol && this.current[0][0])
            neighbors++

        if (row !== maxRow && this.current[row + 1][col])
            neighbors++                                                         // Directly below
        else if (row === maxRow && this.current[0][col])
            neighbors++

        if (row !== maxRow && col !== 0 && this.current[row + 1][col - 1])
            neighbors++                                                         // Below and to the left
        else if (row === maxRow && col === 0 && this.current[0][maxCol])
            neighbors++

        if (col !== 0 && this.current[row][col - 1])
            neighbors++                                                         // Directly left
        else if (col === 0 && this.current[row][maxCol])
            neighbors++

        return neighbors
    }

    isCellAlive(row, col) {
        return this.current[row][col]
    }

    isCellDead(row, col) {
        return !this.current[row][col]
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    addNewCells(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        this.current[Math.floor(y / this.CELL_HEIGHT)][Math.floor(x / this.CELL_WIDTH)] = true
    }
}