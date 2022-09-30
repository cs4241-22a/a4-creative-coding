import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'
import html2canvas from 'html2canvas';

//Create a clock for rotation
const clock = new THREE.Clock()

// Set rotate boolean variable
let rotateModel = false

//Uploaded controls
var userUploaded = false
let controls

// Creates empty mesh container
const myMesh = new THREE.Mesh();

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0, 0, 0);

//Lights
const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(100, 100, 400);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, .5);
pointLight2.position.set(-500, 100, -400);
scene.add(pointLight2);

// Parameters
const stlLoader = new STLLoader()

//Material
const material = new THREE.MeshStandardMaterial()
material.flatShading = true
material.side = THREE.DoubleSide;

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 2000)

// Renderer
const renderer = new THREE.WebGLRenderer()

let effect;

let characters = ' .:-+*=%@#'
const effectSize = { amount: .205 }
let backgroundColor = 'black'
let ASCIIColor = 'green'

function createEffect() {
    effect = new AsciiEffect(renderer, characters, { invert: true, resolution: effectSize.amount });
    effect.setSize(sizes.width, sizes.height);
    effect.domElement.style.color = ASCIIColor;
    effect.domElement.style.backgroundColor = backgroundColor;
}

createEffect()

document.body.appendChild(effect.domElement)

document.getElementById("ascii").style.whiteSpace = "prewrap"

stlLoader.load(
    '/models/Ferrari.stl',
    function (geometry) {

        myMesh.material = material;
        myMesh.geometry = geometry;

        var tempGeometry = new THREE.Mesh(geometry, material)
        myMesh.position.copy = (tempGeometry.position)

        geometry.computeVertexNormals();
        myMesh.geometry.center()

        myMesh.rotation.x = -90 * Math.PI / 180;

        myMesh.geometry.computeBoundingBox();
        var bbox = myMesh.geometry.boundingBox;

        myMesh.position.y = ((bbox.max.z - bbox.min.z) / 5)

        camera.position.x = ((bbox.max.x * 4));
        camera.position.y = ((bbox.max.y));
        camera.position.z = ((bbox.max.z * 3));

        scene.add(myMesh);

        controls = new OrbitControls(camera, effect.domElement)


        function tick() {
            if (rotateModel == true) {
                const elapsedTime = clock.getElapsedTime()
                myMesh.rotation.z = (elapsedTime) / 3
                render()
                window.requestAnimationFrame(tick)
            } else {
                render()
                window.requestAnimationFrame(tick)
            }
        }

        function render() {
            effect.render(scene, camera);
        }

        tick()

        document.getElementById('file-selector').addEventListener('change', openFile, false);


        function openFile(evt) {
            const fileObject = evt.target.files[0];

            const reader = new FileReader();
            reader.readAsArrayBuffer(fileObject);
            reader.onload = function () {
                if (userUploaded == false) {
                    userUploaded = true;
                }
                const geometry = stlLoader.parse(this.result);
                tempGeometry = geometry;
                myMesh.geometry = geometry;
                myMesh.geometry.center()

                myMesh.rotation.x = -90 * Math.PI / 180;

                myMesh.geometry.computeBoundingBox();
                var bbox = myMesh.geometry.boundingBox;

                myMesh.position.y = ((bbox.max.z - bbox.min.z) / 6)

                scene.add(myMesh);
            };
        };
    }
)


document.getElementById('rotateButton').addEventListener('click', rotateMode);

function rotateMode() {
    rotateModel = !rotateModel
}

function updateASCII() {

  document.body.removeChild(effect.domElement)

  characters = " " + "." + document.getElementById('newASCII').value;

  createEffect()
  onWindowResize()

  document.body.appendChild(effect.domElement)

  controls = new OrbitControls(camera, effect.domElement)

}

document.getElementById('resetASCII').addEventListener('click', resetASCII);

function resetASCII() {

  document.body.removeChild(effect.domElement)

  characters = ' .:-+*=%@#'

  createEffect()
  onWindowResize()

  document.body.appendChild(effect.domElement)

  controls = new OrbitControls(camera, effect.domElement)
}

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
}



