console.log("script is connected");

let ctx = null
  const pane = new Tweakpane.Pane();

  window.onclick = function() {
    ctx = new AudioContext()
    const osc = ctx.createOscillator()
    osc.connect( ctx.destination )
    osc.start(0)
    window.onclick = null
    
    const btn = pane.addButton({
      title: 'turn sound off',
    })
    
    btn.on( 'click', () => {
      osc.stop()
    })
  }
  

// const pane = new Tweakpane.Pane({
//     container: document.querySelector('#container'),
// });

// const btn = pane.addButton({
//     title: 'Play/Pause',
//     label: 'Noggin',
// });

// var context = new AudioContext();
// var buffer;
// var source;
// var isPlaying = false;

// fetch("/noggin.wav")
//   .then(response => response.arrayBuffer())
//   .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
//   .then(audioBuffer => {
//     buffer = audioBuffer;
//   });

// function start() {
//   source = context.createBufferSource();
//   source.buffer = buffer;
//   source.connect(context.destination);
//   source.loop = true;
//   source.start();
// }

// function stop() {
//   source.stop();
// }

// function toogle(button) {
//   isPlaying = !isPlaying;
//   if(isPlaying) {
//     start();
//     button.innerHTML = "Stop";
//   } else {
//     stop();
//     button.innerHTML = "Start";
//   }
// }


// const AudioContext = window.AudioContext || window.webkitAudioContext;

// const audioContext = new AudioContext();
// // get the audio element

// const audioElement = new Audio('/noggin.wav');
// const audioElement2 = new Audio('/shrubb.ogg');

// // pass it into the audio context
// const track = audioContext.createMediaElementSource(audioElement);

// track.connect(audioContext.destination);

// const source = audioContext.createBufferSource();

// const arrayBuffer = await fetch('assets\01-BC_Monster_01.ogg', 
// ).then((res) => res.arrayBuffer());

// const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
// source.buffer = audioBuffer;
// source.loop = true;

// // Select our play button
// const playButton = document.querySelector('button');

// playButton.addEventListener('click', () => {
//   // Check if context is in suspended state (autoplay policy)
//   if (audioContext.state === 'suspended') {
//     audioContext.resume();
//   }

//   // Play or pause track depending on state
//   if (playButton.dataset.playing === 'false') {
//     audioElement.play();
//     playButton.dataset.playing = 'true';
//   } else if (playButton.dataset.playing === 'true') {
//     audioElement.pause();
//     playButton.dataset.playing = 'false';
//   }
// }, false);



// audioElement.addEventListener('ended', () => {
//     playButton.dataset.playing = 'false';
//   }, false);

