import "https://cdn.jsdelivr.net/npm/tweakpane@3.0.5/dist/tweakpane.min.js";

const pane = new Tweakpane.Pane();

const params = {
  barWidth: 2.5,
  denseFFS: true,
  lockWindowSlider: 1,
  yOffSet: 1,
}

const heightSlider =pane.addInput(params, 'barWidth', {
  step: 0.5,
  min: 0.5,
  max: 5,
});

const denseFFS = pane.addInput(params, 'denseFFS')

const wPer = pane.addInput(params, 'lockWindowSlider', {
  min: 0,
  max: 1,
});

const hPer = pane.addInput(params, 'yOffSet', {
  min: 0,
  max: 1,
});



var audio = document.getElementById("audio");

audio.onplay = function() {
  // audio.load();
  // audio.play();
  var context = new AudioContext();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();

  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight/2;
  var ctx = canvas.getContext("2d");

  src.connect(analyser);
  analyser.connect(context.destination);


  analyser.fftSize = 256;
  denseFFS.on('change', (df) => {
    if(df.value){
      analyser.fftSize = 256;
    }
    else{
      analyser.fftSize = 128;
    }
  });
  

  var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);

  var dataArray = new Uint8Array(bufferLength);

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  wPer.on('change', (w) => {
    WIDTH = canvas.width * w.value;
  });
  hPer.on('change', (h) => {
    HEIGHT = canvas.height * h.value;
  });

  var barWidth = (WIDTH / bufferLength) * 2.5;
  heightSlider.on('change', (hs) => {
    barWidth = (WIDTH / bufferLength) * hs.value;
  });
  var barHeight;
  var x = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    x = 0;
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];


      var r = barHeight + (25 * (i/bufferLength));
      var g = 250 * (i/bufferLength);
      var b = 50;

      ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  audio.play();
  renderFrame();
};
