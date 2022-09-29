import {GameOfLife} from './GameOfLife.js'

const PARAMS = {
    "Life Starting Percentage": 50,
    Width: 150,
    Height: 150,
    Delay: 0.05,
    Fun: false,
    "Show Grid": false
}

const pane = new Tweakpane.Pane({
    title: 'Parameters',
    container: document.getElementById('sidebar'),
});

pane.addInput(PARAMS, 'Life Starting Percentage',
    {min: 0, max: 100, step: 1})
pane.addInput(PARAMS, 'Width',
    {min: 25, max: 300, step: 25})
pane.addInput(PARAMS, 'Height',
    {min: 25, max: 300, step: 25})
pane.addInput(PARAMS, 'Delay',
    {min: 0, max: 2, step: 0.01})
pane.addInput(PARAMS, 'Fun')
pane.addInput(PARAMS, 'Show Grid')
pane.addSeparator()
const runButton = pane.addButton({
    title: 'Run'
})
const pauseButton = pane.addButton({
    title: 'Pause',
    disabled: true
})

let gameOfLife = new GameOfLife(PARAMS["Life Starting Percentage"], PARAMS.Delay, PARAMS.Width, PARAMS.Height, PARAMS.Fun, PARAMS["Show Grid"])
gameOfLife.reset()

let running = false
runButton.on('click', () => {
    // Stop previously running game of life
    if (running) {
        runButton.title = 'Run'
        running = false
        pauseButton.title = 'Pause'
        pauseButton.disabled = true
        gameOfLife.reset()
    } else {
        runButton.title = 'Stop'
        running = true
        pauseButton.disabled = false
        gameOfLife = new GameOfLife(PARAMS["Life Starting Percentage"], PARAMS.Delay, PARAMS.Width, PARAMS.Height, PARAMS.Fun, PARAMS["Show Grid"])
        gameOfLife.run()
    }
})

pauseButton.on('click', () => {
    gameOfLife.togglePause()
    if (gameOfLife.isPaused()) pauseButton.title = 'Unpause'
    else pauseButton.title = 'Pause'
})

