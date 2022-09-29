console.log("script is connected");

const pane = new Tweakpane.Pane({
    container: document.querySelector('#container'),
});

const f1 = pane.addFolder({
    title: 'Monster 1',
});

f1.addInput()

const PARAMS = {
    factor: 123,
    title: 'hello',
    color: '#ff0055',
};

pane.addInput(PARAMS, 'factor');
pane.addInput(PARAMS, 'title');
pane.addInput(PARAMS, 'color');