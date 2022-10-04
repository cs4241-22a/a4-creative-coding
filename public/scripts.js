import * as THREE from "https://unpkg.com/three/build/three.module.js";
import  "https://cdn.jsdelivr.net/npm/tweakpane@3.0.5/dist/tweakpane.min.js";

console.log("javascript HERE");
  let audioContext = null;

const app = {
  init() {
    console.log("Javascript");
    app.scene = new THREE.Scene();
    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    
    
    const PARAMS = {
      position: 100
    }
    const pane = new Tweakpane.Pane();
    const pos = pane.addInput(PARAMS, 'position', {
      min: 20,
      max:100,
      step: 10,
    })
    
    
    //add camera
        app.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
    app.camera.position.z = PARAMS.position;

    pos.on("change", (pos) =>{
      app.camera.position.z = PARAMS.position;
    })
    
    app.camera.add(listener);

    //set render to the window size
    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(app.renderer.domElement);
    //app.render = app.render.bind(app)


    //adding audio
    if (audioContext == null) { //prevent multiple audio being created
      audioContext = new AudioContext();
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.reload = "auto";
      audio.crossOrigin = "anonymous";
      document.body.appendChild(audio);

      //adding analyser
      app.analyser = audioContext.createAnalyser();
      app.analyser.fffSize = 1024;
  
      const player = audioContext.createMediaElementSource(audio);
      player.connect(audioContext.destination);
      player.connect(app.analyser);

      //adding the source song
      audio.src =
        "https://cdn.glitch.global/f89fff4f-5829-4005-9d84-0593112f09ad/yt1s.com%20-%20T%C3%8CNH%20B%E1%BA%A0N%20DI%E1%BB%86U%20K%E1%BB%B2%20%20Amee%20x%20Ricky%20Star%20x%20L%C4%83ng%20LD.mp3?v=1664863078721";
      audio.play();
    }
    app.dataArray = new Uint8Array(app.analyser.frequencyBinCount);  
        
    //make ball
    app.ball = app.createSphere()
    
    //add light
    app.lightControl()
    
    app.render();
  },
  
  lightControl(){
    //create ambien light
    var ambientLight = new THREE.AmbientLight(0xffffff)
    app.scene.add(ambientLight)
    
    //create Spot Light
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.itensity = 0.9 
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(app.ball);
    spotLight.castShadow = true;
    app.scene.add(spotLight);
    
    
  },
  
  createSphere(){
    var geometry = new THREE.IcosahedronGeometry(20, 1);
    var wireframe = new THREE.EdgesGeometry(geometry);
    
    var material = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color("#fff1eb")
            },
            color2: {
                value: new THREE.Color("#3d3d3d")
            }
        },
        vertexShader: `
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          
          varying vec2 vUv;
          
          void main() {
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `,
        wireframe: true
    });
    
    var ball = new THREE.Mesh(geometry, material);
    app.scene.add(ball)
    
    return ball;
    
  },
  
  render(){
    
    app.analyser.getByteFrequencyData(app.dataArray)

    for (let i = 0; i < app.analyser.frequencyBinCount; i++) {
    app.ball.rotation.x += app.dataArray[i] * 0.0000009;
    app.ball.rotation.y += app.dataArray[i] * 0.0000008;
    app.ball.rotation.z += app.dataArray[i] * 0.0000006;
    }
    
    window.requestAnimationFrame(app.render)
    app.renderer.render(app.scene, app.camera) 
  },
  
};


window.onload = function () {
  console.log("Am i here?");
  const button = document.getElementById("button");
  button.onclick = app.init;
};
