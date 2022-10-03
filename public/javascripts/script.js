let canvas = document.getElementById("visualizer");
let ctx = canvas.getContext("2d");

let audioElement = document.getElementById("audio");

let startButton = document.getElementById("start")

let audioCtx = null;
let analyser = null;
let source = null;
let data = null
var bufferLength = null;

audioElement.load();

audioElement.onplay = ()=> {
    audioCtx = new AudioContext();
    source = audioCtx.createMediaElementSource(audioElement);
    analyser = audioCtx.createAnalyser();
    
    analyser.fftSize = 1024;
    bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    
    source.connect(analyser);
    source.connect(audioCtx.destination);
    data = new Uint8Array(analyser.frequencyBinCount);
    
    ctx.clearRect(0, 0, 500, 500);
    requestAnimationFrame(renderVisuals);
}


function renderVisuals() {
    requestAnimationFrame(renderVisuals);
    analyser.getByteFrequencyData(data)
    draw(data);
}

function draw(){
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, 800, 500);

    var barWidth = (800 / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
        barHeight = data[i];
        
        var red = 255-barHeight
        var green = barHeight-red

        ctx.fillStyle = 'rgb(' + red + ',' + green + ',0)';
        ctx.fillRect(x,510-(barHeight*2),barWidth,(barHeight*2));

        x += barWidth + 1;
    }
}