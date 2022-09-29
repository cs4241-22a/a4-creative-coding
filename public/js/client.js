import {GameOfLife} from './GameOfLife.js'
// import { Pane } from 'tweakpane';
//
// const pane = new Pane({
//     container: document.getElementById('sidebar'),
// });


let gameOfLife = new GameOfLife(50, 0, 100, 100)
gameOfLife.run()

