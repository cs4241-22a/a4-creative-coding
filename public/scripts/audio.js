// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API

// create the context
const audioContext = new AudioContext();

// get audio element from DOM && pass to audio context
const audioElement = document.querySelector('audio');
const track = audioContext.createMediaElementSource(audioElement)

// todo, output node? Give the track the audio context
track.connect(audioContext.destination);


//      --------------
//      MEDIA CONTROLS
//      --------------

// play/pause functionality
const playButton = document.querySelector('#play-pause'); // Select our play button
playButton.addEventListener('click', () => {
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
        console.log('resume')
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === 'false') {
        audioElement.play();
        playButton.dataset.playing = 'true';
        console.log('play')
    } else if (playButton.dataset.playing === 'true') {
        audioElement.pause();
        playButton.dataset.playing = 'false';
        console.log('pause')
    }
}, false);

// handle track ending
audioElement.addEventListener('ended', () => {
    playButton.dataset.playing = 'false';
}, false);


//      --------------
//      VISUALIZATIONS
//      --------------

//  Some Sources:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#visualizations
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData

const analyzer = audioContext.createAnalyser(); // create analyzer node
const dataArray = new Float32Array(analyzer.frequencyBinCount); // new float array of equal length as the number of data values we have to play with for the visualization.
//Set up audio node network
track.connect(analyzer);
analyzer.connect(audioContext.destination);


// Setup three.js scene/renderer/camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// for each bin...
const cubeArray = new Array(10);
for (let i = 0; i < 10; i++) {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x8E7CC3 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.position.x = -5 + i;
    cubeArray[i] = cube
}

// for each bin...
const cubeArraySet2 = new Array(10);
for (let i = 0; i < 10; i++) {
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.position.x = +10 + i;
    cubeArraySet2[i] = cube
}

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );

    if (playButton.dataset.playing === 'true') {
        // todo, pause here and await a callback to resume?
        //Get spectrum data
        analyzer.getFloatFrequencyData(dataArray); // put the current frequency data into dataArray

        for (let i = 0; i < cubeArray.length; i++) {
            if (PARAMS.rotation) {
                cubeArray[i].rotation.x += PARAMS.rotational_speed;
            }
            cubeArray[i].scale.set( 1, 1, (Math.abs(dataArray[i*100])/10)-5 );
        }

        for (let i = 0; i < cubeArraySet2.length; i++) {
            if (PARAMS.rotation) {
                cubeArraySet2[i].rotation.x += PARAMS.rotational_speed;
            }
            cubeArraySet2[i].scale.set( 1, 1, (Math.abs(dataArray[(i*100-99)])/10)-5 );
        }



        renderer.render( scene, camera );
    }
}


//      ----------
//      TWEAK-PANE
//      ----------
const pane = new Tweakpane.Pane();

const PARAMS = {
    CamZ: 5,
    rotation: true,
    rotational_speed: 0.01,
    colorSet1: 0x8E7CC3,
    colorSet2: 0xFFFFFF,
};

const cameraZInput = pane.addInput(PARAMS, 'CamZ', {min: 0, max: 100, step: 0.5});
cameraZInput.on('change', function(ev) {
    camera.position.z = ev.value;
});

const colorSet1Input = pane.addInput(PARAMS, 'colorSet1', {view: 'color'});
colorSet1Input.on('change', function(ev) {
    for (let i = 0; i < cubeArray.length; i++) {
        cubeArray[i].material.color.setHex(ev.value)
    }
});

const colorSet2Input = pane.addInput(PARAMS, 'colorSet2', {view: 'color'});
colorSet2Input.on('change', function(ev) {
    for (let i = 0; i < cubeArraySet2.length; i++) {
        cubeArraySet2[i].material.color.setHex(ev.value)
    }
});

pane.addInput(PARAMS, 'rotational_speed', {min: 0.005, max: 1.50, step: 0.005})
pane.addInput(PARAMS, 'rotation');


animate();
