const Tweakpane = require('tweakpane');
const PARAMS = {
    factor: 123,
    title: 'hello',
    color: '#ff0055',
    percentage: 50,
    theme: 'dark',
};

const pane = new Pane({
    container: document.getElementById('someContainer'),
});

pane.addInput(PARAMS, 'factor');
pane.addInput(PARAMS, 'title');
pane.addInput(PARAMS, 'color');

// `min` and `max`: slider
pane.addInput(
    PARAMS, 'percentage',
    { min: 0, max: 100, step: 10 }
);

// `options`: list
pane.addInput(
    PARAMS, 'theme',
    { options: { Dark: 'dark', Light: 'light' } }
);