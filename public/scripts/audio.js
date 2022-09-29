// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API

// create the context
const audioContext = new AudioContext();

// get audio element from DOM && pass to audio context
const audioElement = document.querySelector('audio');
const track = audioContext.createMediaElementSource(audioElement)

// todo, output node? Give the track the audio context
track.connect(audioContext.destination);


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


// Visualizations:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#visualizations
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

const gainNode = audioContext.createGain();
track.connect(gainNode).connect(audioContext.destination);

// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
const analyzer = audioContext.createAnalyser();
const dataArray = new Float32Array(analyzer.frequencyBinCount);
analyzer.getFloatFrequencyData(dataArray);
