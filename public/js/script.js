import * as THREE from "https://unpkg.com/three/build/three.module.js";
import "https://cdn.jsdelivr.net/npm/tweakpane@3.0.5/dist/tweakpane.min.js";

const app = {
  init() {
    document.getElementById("start").style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("audio-upload").style.display = "none";
    document.getElementById("audio-label").style.display = "none";

    app.scene = new THREE.Scene();
    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    const fieldOfView = 75;
    const aspect = 2;
    const near = 2;
    const far = 1;

    app.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    app.camera.position.z = 3;
    app.camera.add(listener);

    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.renderer.domElement);

    app.cube = app.makeCube();

    app.render = app.render.bind(app);
    
    if (app.audioCtx == null) {
      const audioCtx = new AudioContext();
      const audioElement = document.createElement("audio");
      audioElement.controls = true;
      audioElement.reload = "auto";
      document.body.appendChild(audioElement);

      app.analyser = audioCtx.createAnalyser();
      app.analyser.fftSize = 1024;
      const player = audioCtx.createMediaElementSource(audioElement);
      player.connect(audioCtx.destination);
      player.connect(app.analyser);

      audioElement.src = "GoodVibes.mp3";
      audioElement.play();
    }

    app.results = new Uint8Array(app.analyser.frequencyBinCount);

    app.render();
  },

  makeCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: "#b2b2b2",
      wireframe: true,
    });

    const cube = new THREE.Mesh(geometry, material);
    app.scene.add(cube);
    
    const pane = new Tweakpane.Pane();
    const color = pane.addInput({ color: "#b2b2b2" }, "color", {
      view: "color", // show values as hex
    });
    color.on("change", (v) => {
      material.color = new THREE.Color(v.value);
    });

    const x = pane.addInput({ x: 1 }, "x", {
      min: 0,
      step: 1,
      max: 5,
    });
    x.on("change", (x) => {
      cube.scale.x = x.value;
    });

    const y = pane.addInput({ y: 1 }, "y", {
      min: 0,
      step: 1,
      max: 5,
    });
    y.on("change", (y) => {
      cube.scale.y = y.value;
    });

    const z = pane.addInput({ z: 1 }, "z", {
      min: 0,
      step: 1,
      max: 5,
    });
    z.on("change", (z) => {
      cube.scale.z = z.value;
    });
    
    const wireframe = pane.addInput({ wireframe: true }, "wireframe");
    wireframe.on("change", (w) => {
      material.wireframe = w.value;
    });
    
    return cube;
  },

  render() {
    app.analyser.getByteFrequencyData(app.results);
    for (let i = 0; i < app.analyser.frequencyBinCount; i++) {
      app.cube.rotation.x += app.results[i] * 0.000002;
      app.cube.rotation.y += app.results[i] * 0.000002;
      app.cube.rotation.z += app.results[i] * 0.000002;
    }
    app.renderer.render(app.scene, app.camera);
    window.requestAnimationFrame(app.render);
  },
};

const start = document.getElementById("start");
start.addEventListener("click", app.init);

function changeHandler({ target }) {
  if (!target.files.length) return;

  const urlObj = URL.createObjectURL(target.files[0]);

  app.audioCtx = new AudioContext();
  const audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.reload = "auto";
  document.body.appendChild(audioElement);

  app.analyser = app.audioCtx.createAnalyser();
  app.analyser.fftSize = 1024;
  const player = app.audioCtx.createMediaElementSource(audioElement);
  player.connect(app.audioCtx.destination);
  player.connect(app.analyser);

  audioElement.addEventListener("load", () => {
    URL.revokeObjectURL(urlObj);
  });

  audioElement.src = urlObj;
  audioElement.play();
  app.init();
}

document
  .getElementById("audio-upload")
  .addEventListener("change", changeHandler);
