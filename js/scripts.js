import Tweakpane from 'tweakpane';
console.log("script is connected");

const pane = new Tweakpane({
    container: document.querySelector('#container'),
});

const PARAMS = {
    factor: 123,
    title: 'hello',
    color: '#ff0055',
};

pane.addInput(PARAMS, 'factor');
pane.addInput(PARAMS, 'title');
pane.addInput(PARAMS, 'color');