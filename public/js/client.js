import {GameOfLife} from './GameOfLife.js'

const PARAMS = {
    "Life Starting Percentage": 50,
    Width: 150,
    Height: 150,
    Delay: 0.05,
    Fun: false
}

const pane = new Tweakpane.Pane({
    title: 'Parameters',
    container: document.getElementById('sidebar'),
});

pane.addInput(PARAMS, 'Life Starting Percentage',
    {min: 0, max: 100, step: 1})
pane.addInput(PARAMS, 'Width',
    {min: 25, max: 400, step: 25})
pane.addInput(PARAMS, 'Height',
    {min: 25, max: 400, step: 25})
pane.addInput(PARAMS, 'Delay',
    {min: 0, max: 2, step: 0.01})
pane.addInput(PARAMS, 'Fun')
pane.addSeparator()
const button = pane.addButton({
    title: 'Run'
})

let gameOfLife = new GameOfLife(PARAMS["Life Starting Percentage"], PARAMS.Delay, PARAMS.Width, PARAMS.Height, PARAMS.Fun)
gameOfLife.reset()

let running = false
button.on('click', () => {
    // Stop previously running game of life
    if (running) {
        button.title = 'Run'
        running = false
        gameOfLife.reset()
    } else {
        button.title = 'Stop'
        running = true
        gameOfLife = new GameOfLife(PARAMS["Life Starting Percentage"], PARAMS.Delay, PARAMS.Width, PARAMS.Height, PARAMS.Fun)
        gameOfLife.run()
    }
})

