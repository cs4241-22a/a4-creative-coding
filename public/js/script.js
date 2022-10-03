//audio init
const audioCtx = new AudioContext()
const audioElement = document.createElement('audio')
document.body.appendChild(audioElement)

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const instruction = document.getElementById('instruction')
const main = document.getElementById('main')
const startBtn = document.getElementById('startBtn')

const volume = document.getElementById('volume'),
      pauseBtn = document.getElementById('pauseBtn'),
      playSet = document.getElementById('playBtn'),
      mute = document.getElementById('mute'),
      currentSong = document.getElementById('currentSong')

const replayBtn = document.getElementById('replay'),
    ratherBeBtn = document.getElementById('rather-be')

const replay = "../audio/replay.mp3",
    ratherbe = "../audio/ratherbe.mp3"


const white = document.getElementById('whiteBtn');
const green = document.getElementById('greenBtn');
const red = document.getElementById('redBtn');
const yellow = document.getElementById('yellowBtn');
const blue = document.getElementById('blueBtn');


const bkgWhite = document.getElementById('bkgWhiteBtn');
const bkgBlack = document.getElementById('bkgBlackBtn');
const bkgPink = document.getElementById('bkgPinkBtn');
const bkgPurple = document.getElementById('bkgPurpleBtn');
const bkgOrange = document.getElementById('bkgOrangeBtn');

let color = 'white'
let background = 'black'

//Start button onClick
startBtn.addEventListener('click', function () {
    document.body.style.backgroundColor = "black";
    document.body.removeChild(instruction);
    main.style.display = 'block';
    audioCtx.resume();
    start();
})

const start = function () {

    //audio graph setup
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const player = audioCtx.createMediaElementSource(audioElement);
    player.connect(audioCtx.destination);
    player.connect(analyser);

    audioElement.src = replay;
    audioElement.play();
    audioElement.crossOrigin = "anonymous";

    currentSong.value = replayBtn.value;

    const results = new Uint8Array(analyser.frequencyBinCount);

    draw = function () {
        window.requestAnimationFrame(draw);

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color;

        analyser.getByteFrequencyData(results);

        for (let i = 0; i < analyser.frequencyBinCount; i++) {
            ctx.fillRect(i*5, canvas.height, 3.5, -results[i]*2);
        }
    }
    draw()
}

ratherBeBtn.addEventListener('click', function () {
    audioElement.src = ratherbe;
    audioElement.play();
    currentSong.value = ratherBeBtn.value;
})

//settings
playSet.addEventListener('click', ()=> audioElement.play())
pauseBtn.addEventListener('click', ()=> audioElement.pause())
volume.addEventListener("change", (e)=> audioElement.volume = e.currentTarget.value / 100)

mute.addEventListener('click', function() {
    if (mute.checked) {
        audioElement.muted = true
    } else {
        audioElement.muted = false
    }
})


//color and background change
function gradient (c1, c2) {
    let gradient = ctx.createLinearGradient(50, 0, 1250, 0);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(0.1, c2);
    gradient.addColorStop(0.3, c1);
    gradient.addColorStop(0.4, c2);
    gradient.addColorStop(0.5, c1);
    gradient.addColorStop(0.6, c2);
    gradient.addColorStop(0.7, c1);
    gradient.addColorStop(0.8, c2);
    gradient.addColorStop(0.9, c1);
    gradient.addColorStop(1, c2);
    return gradient;
}

white.addEventListener('click', ()=> color = 'white')

red.addEventListener('click', function () {
    color = gradient ("#cd0f2b", "#c96877");
})

green.addEventListener('click', function () {
    color = gradient ("#038003", "#abfdab");
})

yellow.addEventListener('click', function () {
    color = gradient ("#e9dc2b", "#fff9a8");
})

blue.addEventListener('click', function () {
    color = gradient ("#2c2496", "#7f9bf6");
})


bkgBlack.addEventListener('click', function() {
    document.body.style.backgroundColor = "black";
    background = "black";
})
bkgWhite.addEventListener('click', function() {
    document.body.style.backgroundColor = "white";
    background = "white";
})
bkgPink.addEventListener('click', function() {
    document.body.style.backgroundColor = "pink";
    background = "pink";
})
bkgPurple.addEventListener('click', function() {
    document.body.style.backgroundColor = "purple";
    background = "purple";
})
bkgOrange.addEventListener('click', function() {
    document.body.style.backgroundColor = "orange";
    background = "orange";
})