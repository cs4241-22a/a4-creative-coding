import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';
//import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

let sphere, velocity = Object(); 
velocity.x = 1.4;
velocity.z = 1.4;
// CAMERA
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.set(150, 150, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// WINDOW RESIZE HANDLING
export function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfd1e5);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

export function animate() {
    dragObject();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// ambient light
let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(hemiLight);

//Add directional light
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;

function createFloor() {
    let pos = { x: 0, y: -1, z: 3 };
    let scale = { x: 100, y: 2, z: 100 };

    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({ color: 0xf9c834 }));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);

    blockPlane.userData.ground = true
}


function createSphere() {
    let radius = 4;
    let pos = { x: 15, y: radius, z: -15 };

    const axesHelper = new THREE.AxesHelper(51);
    scene.add(axesHelper);

    sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0x43a1f4 }))
    sphere.position.set(10, 4, 10)
    //camera.position.set(100, 500, 100)
    // camera.position.set(10,1,1)
    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)


    sphere.userData.draggable = true
    sphere.userData.name = 'SPHERE'
}



const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2();  // create once
const moveMouse = new THREE.Vector2();   // create once
var draggable;

function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
}




//EVENT LISTENERS

window.addEventListener('click', event => {
    if (draggable != null) {
        console.log(`dropping draggable ${draggable.userData.name}`)
        draggable = null
        return;
    }

    // THREE RAYCASTER
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const found = intersect(clickMouse);
    if (found.length > 0) {
        if (found[0].object.userData.draggable) {
            draggable = found[0].object
            console.log(`found draggable ${draggable.userData.name}`)
        }
    }
})

window.addEventListener('mousemove', event => {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('keydown', (event) => {
    console.log(event.key)

    let pressed = (event.key).toLowerCase()
    if (pressed === 'w') {
        sphere.position.x -= velocity.x;
    } else if (pressed === 'a') {
        sphere.position.z += velocity.z;
    } else if (pressed === 's') {
        sphere.position.x += velocity.x;
    } else if (pressed === 'd') {
        sphere.position.z -= velocity.z;
    }

})




//FUNCTIONS
function dragObject() {
    if (draggable != null) {
        const found = intersect(moveMouse);
        if (found.length > 0) {
            for (let i = 0; i < found.length; i++) {
                if (!found[i].object.userData.ground)
                    continue

                let target = found[i].point;
                draggable.position.x = target.x
                draggable.position.z = target.z
            }
        }
    }
}

function createGui() {
    const gui = new dat.GUI();
    gui.add(sphere.position, "x", -30, 30, 5,).name("X Position");
    gui.add(sphere.position, "z", -30, 30, 5,).name("Z Position");
    gui.add(sphere.material, "wireframe");

    const folderVel = gui.addFolder("velocity")
    folderVel.add(velocity, "x", -30, 30, 1,).name("X Velocity");
    folderVel.add(velocity, "z", -30, 30, 1,).name("Z Velocity");
}


createFloor()
createSphere()
createGui()

animate()
