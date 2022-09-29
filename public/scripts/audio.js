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
const audioSourceNode = audioContext.createMediaElementSource(audioElement);

//Set up audio node network
audioSourceNode.connect(analyzer);
analyzer.connect(audioContext.destination);

function draw() {
    requestAnimationFrame(draw); // re-call draw for the next frame

    // don't waste time drawing next frame if audio is paused
    if (playButton.dataset.playing === 'false') {
        // todo, pause here and await a callback to resume?
        return;
    }

    //Get spectrum data
    analyzer.getFloatFrequencyData(dataArray); // put the current frequency data into dataArray
    console.log(dataArray[0]); // todo, temp demo
}

draw();
