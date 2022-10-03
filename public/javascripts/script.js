let canvas = document.getElementById("visualizer");
let width = window.screen.availWidth - 100
canvas.width = width
let ctx = canvas.getContext("2d");

let audioElement = document.getElementById("audio");

let startButton = document.getElementById("start")

let audioCtx = null;
let analyser = null;
let source = null;
let data = null
let highest = new Uint16Array(256);
let bufferLength = null;
let gradient = null;

let gradient1 = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient1.addColorStop(0.1, "lightgreen")
gradient1.addColorStop(0.45, 'green');
gradient1.addColorStop(0.6, 'yellow')
gradient1.addColorStop(0.75, 'orange')
gradient1.addColorStop(0.9, 'red');
let gradient2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient2.addColorStop(0.1, 'green');
gradient2.addColorStop(0.36, 'yellow')
gradient2.addColorStop(0.63, 'orange')
gradient2.addColorStop(0.9, 'red');
let gradient3 = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient3.addColorStop(0.1, 'yellow')
gradient3.addColorStop(0.5, 'orange')
gradient3.addColorStop(0.9, 'red');
let gradient4 = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient4.addColorStop(0.1, 'orange')
gradient4.addColorStop(0.9, 'red');

audioElement.load();

audioElement.onplay = ()=> {
    isPlaying = true;
    if (audioCtx == null){
        audioCtx = new AudioContext();
        source = audioCtx.createMediaElementSource(audioElement);
        analyser = audioCtx.createAnalyser();

        analyser.fftSize = 512;
        //analyser.smoothingTimeConstant = .75;
        // analyser.maxDecibels = 0
        // analyser.minDecibels = -110
        analyser.channelInterpretation = "discrete"
        analyser.channelCount = 1
        analyser.channelCountMode = "explicit"
        bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        source.connect(analyser);
        source.connect(audioCtx.destination);
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0.1, "lightgreen")
        gradient.addColorStop(0.3, 'green');
        gradient.addColorStop(0.5, 'yellow')
        gradient.addColorStop(0.7, 'orange')
        gradient.addColorStop(0.9, 'red');
    }
    data = new Uint8Array(analyser.frequencyBinCount);
    highest = new Uint16Array(256);



    ctx.clearRect(0, 0, width, canvas.height);
    requestAnimationFrame(renderVisuals);
}
audioElement.onpause = ()=> {
    isPlaying = false;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, canvas.height);
}
var isPlaying = true;


function renderVisuals() {
    if (isPlaying){
        requestAnimationFrame(renderVisuals);
        analyser.getByteFrequencyData(data)
        draw(data);
    }
}



function draw(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, canvas.height);
    ctx.fillStyle = gradient;

    const barWidth = (width / 193);
    let barHeight;
    var x = 0

    for(var i = 0; i < bufferLength; i++) {
        barHeight = data[i]*2;
        //ctx.fillStyle = (data[i] > 204) ? "lightgreen" : (data[i] > 166) ? "green" : (data[i] > 102) ? "yellow" : (data[i] > 64) ? "orange" : "red"
        //ctx.fillStyle = (data[i] > 218) ? gradient1 : (data[i] > 169) ? gradient2 : (data[i] > 118) ? gradient3 : (data[i] > 67) ? gradient4 : "red"
        if (barHeight > highest[i]) {highest[i] = (data[i]*2)}
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
    
    
    // approximate a spline for highest levels
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - highest[0]);
    x = 0;
    i = 1;
    for (i = 1; i < highest.length - 2; i ++)
    {
        var xc = (x + (x+barWidth+1)) / 2;
        var yc = canvas.height - ((highest[i] + highest[i + 1]) / 2);
        ctx.quadraticCurveTo(x, canvas.height - highest[i], xc, yc);
        x += barWidth + 1;
    }
    ctx.quadraticCurveTo(x, canvas.height - highest[i], x+barWidth+1, canvas.height - highest[i+1]);
    //ctx.strokeStyle = "teal";
    ctx.lineWidth = "2";
    ctx.strokeStyle = gradient
    ctx.stroke();
}