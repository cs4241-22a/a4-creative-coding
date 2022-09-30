
import * as THREE from "https://unpkg.com/three/build/three.module.js";



const app = {
  init() {
    app.scene = new THREE.Scene();
    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();


    app.camera = new THREE.PerspectiveCamera();
    app.camera.position.z = 50;
    app.camera.add(listener);

    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.renderer.domElement);

   const pointLight = new THREE.PointLight(0xffffff);
   pointLight.position.z = 100;
   app.scene.add(pointLight); 

   app.knot = app.createKnot();


    app.render = app.render.bind(app);

    
	  audioLoader.load( 'https://cdn.glitch.global/163f56bd-2a47-4f3d-b6f0-a42072d923b0/mixkit-mystwrious-bass-pulse-2298.wav?v=1664503743586', function( buffer ) {
	  sound.setBuffer( buffer );
	  sound.setLoop( true );
	  sound.setVolume( 0.5 );
	  sound.play();
	  })
   

    const audioCtx = new AudioContext();
    const audioElement = document.createElement("audio");
    document.body.appendChild(audioElement);

    app.analyser = audioCtx.createAnalyser();
    app.analyser.fftSize = 1024; // 512 bins
    const player = audioCtx.createMediaElementSource(audioElement);
    player.connect(audioCtx.destination);
    player.connect(app.analyser);


    audioElement.src = 'mixkit-mystwrious-bass-pulse-2298.wav'
    audioElement.play();

    app.results = new Uint8Array(app.analyser.frequencyBinCount);


    const pane = new Tweakpane.Pane();

    const objcolor = 0x0088ff;

    const PARAMS = {
      song: "Song title",
      dodecahedron_color: 0x0088ff,
      volume: 0.5,

    };

    pane.addInput(PARAMS, 'song')

    pane.addInput(PARAMS, 'dodecahedron_color', {
      view: 'color',
    });

    pane.addInput(PARAMS, 'volume', {
      min: 0,
      max: 1,
    });


    app.render();
  },

  createKnot() {
    const knotgeo = new THREE.DodecahedronGeometry(10,0);
    const mat = new THREE.MeshPhongMaterial({
      color: 0x0088ff,
      shininess: 2000
    });
    const knot = new THREE.Mesh(knotgeo, mat);
    knot.wireframe = true;

    app.scene.add(knot);
    return knot;
  },

  render() {
    app.analyser.getByteFrequencyData(app.results);

    for (let i = 0; i < app.analyser.frequencyBinCount; i++) {
      app.knot.rotation.x += app.results[i];
      app.knot.rotation.y += app.results[i];
      app.knot.shininess += app.results[i];
      app.knot.rotation.z += app.results[i];

    }
    app.renderer.render(app.scene, app.camera);
    window.requestAnimationFrame(app.render);
  }
};


const playButton = document.getElementById( 'playButton' );
playButton.addEventListener( 'click', app.init );