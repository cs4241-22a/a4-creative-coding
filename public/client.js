// Tweakpane parameters
const PARAMS = {
  Red: 255,
  Green: 97,
  Blue: 199,
  Background: "#0A0B37",
  Height: 1,
  Width: 0,
};

// Initialize Tweakpane
const paneDiv = document.createElement("div");
paneDiv.id = "pane";
document.body.appendChild(paneDiv);
const pane = new Tweakpane.Pane({
  title: "Visualizer Controls",
  container: document.getElementById("paneDiv"),
});
pane.addInput(PARAMS, "Red", {
  min: 0,
  max: 255,
  step: 1,
});
pane.addInput(PARAMS, "Green", {
  min: 0,
  max: 255,
  step: 1,
});
pane.addInput(PARAMS, "Blue", {
  min: 0,
  max: 255,
  step: 1,
});
pane.addInput(PARAMS, "Background");
pane.addInput(PARAMS, "Height", {
  min: 1,
  max: 2.5,
  step: 0.01,
});
pane.addInput(PARAMS, "Width", {
  min: 0,
  max: 100,
  step: 1,
});

// Setup visualizer
const visualizer = function (song) {
  // Initialize canvas
  document.getElementById("startButtons").remove();
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = (window.innerWidth * 4) / 5;
  canvas.height = window.innerHeight;
  const context = canvas.getContext("2d");

  // Initialize audio
  const audioContext = new AudioContext();
  const audioElement = document.createElement("audio");
  document.body.appendChild(audioElement);

  // Setup Analyzer
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024; // 512 bins
  const player = audioContext.createMediaElementSource(audioElement);
  player.connect(audioContext.destination);
  player.connect(analyser);

  // Set size of visualizer lines
  const lineWidth = canvas.width / analyser.frequencyBinCount;
  let lineHeight = 0;

  // Setup song
  audioElement.crossOrigin = "anonymous";
  audioElement.src = song;
  audioElement.play();

  // Holds all the data points from the chosen song
  const results = new Uint8Array(analyser.frequencyBinCount);

  const draw = function () {
    // temporal recursion, call tthe function in the future
    window.requestAnimationFrame(draw);

    // Initialize canvas
    context.fillStyle = PARAMS.Background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Update CSS colors
    document.body.style.background = PARAMS.Background;
    document.body.style.color = `rgb(${PARAMS.Red}, ${PARAMS.Green}, ${PARAMS.Blue})`;
    
    // Tracks current x-axis placement for visualizer line
    let x = 0;

    // set color for drawing the visuaization
    analyser.getByteFrequencyData(results);

    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      // Set line height to current data height
      lineHeight = results[i] * PARAMS.Height;
      context.fillStyle = `rgb(${PARAMS.Red}, ${PARAMS.Green}, ${PARAMS.Blue})`;
      context.fillRect(
        x,
        canvas.height - lineHeight,
        lineWidth - PARAMS.Width,
        lineHeight
      );
      x += lineWidth;
    }
  };
  draw();
};
