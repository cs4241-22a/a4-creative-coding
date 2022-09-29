import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

let sphere, velocity = Object();
velocity.x = 1.4;
velocity.z = 1.4;
let radius = 5;
let red = false;
let pink = false;
let green = false;

// CAMERA
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.set(130, 90, 0);
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

    //update boundingBox if object moves
    boxRedBB.copy(boxRed.geometry.boundingBox).applyMatrix4(boxRed.matrixWorld);
    boxGreenBB.copy(boxGreen.geometry.boundingBox).applyMatrix4(boxGreen.matrixWorld);
    boxPinkBB.copy(boxPink.geometry.boundingBox).applyMatrix4(boxPink.matrixWorld);

    //check if cubes or sphere touch each other
    checkIntersecting()

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// ambient light -> no shadows
let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(hemiLight);

//directional light -> shadows
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(50, 70, -40);
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

    return blockPlane;
}


function createSphere() {
    let pos = { x: 10, y: radius, z: 10 };

    sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0x43a1f4 }))
    sphere.position.set(pos.x, pos.y, pos.z)

    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)

    return sphere
}

function createBox(x, z, color) {
    let scale = { x: 6, y: 6, z: 6 }
    let pos = { x: x, y: scale.y / 2, z: z }

    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({ color: color }));
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box)

    return box
}

function createBoundingBox(box) {
    let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cubeBB.setFromObject(box);

    return cubeBB;
}

function createBoundingSphere(sphere) {
    let sphereBB = new THREE.Sphere(sphere.position, radius)

    return sphereBB;
}

function showWinMsg() {
    const buttonW = document.getElementById("win")
    buttonW.style.visibility = 'visible';
}


function showLooseMsg() {
    const buttonL = document.getElementById("loose")
    buttonL.style.visibility = 'visible';
}

function reloadSite() {
    location.reload();
}

function createGui() {
    const gui = new dat.GUI();
    gui.add(sphere.position, "x", -40, 40, 5,).name("X Position");
    gui.add(sphere.position, "z", -40, 40, 5,).name("Z Position");
    gui.add(sphere.material, "wireframe");

    const folderVel = gui.addFolder("velocity")
    folderVel.add(velocity, "x", -30, 30, 1,).name("X Velocity");
    folderVel.add(velocity, "z", -30, 30, 1,).name("Z Velocity");

    const folderScale = gui.addFolder("scale")
    folderScale.add(sphere.scale, "x", -30, 30, 5,).name("X Position");
    folderScale.add(sphere.scale, "z", -30, 30, 5,).name("Z Position");
}

function checkIntersecting() {

    // Checking if player sphere touches cubes
    if (playerBB.intersectsBox(boxRedBB)) {
        boxRed.position.x -= 1;
    }

    if (playerBB.intersectsBox(boxGreenBB)) {
        boxGreen.position.z -= 1;
    }

    if (playerBB.intersectsBox(boxPinkBB)) {
        boxPink.position.z += 1;
    }


    //Check if all cubes are off the platform
    if (pink && green && red) {
        console.log("WINNER WINNER CHICKEN DINNER")
        pink = green = red = false
        showWinMsg()
    }


    //check if box touches plane else "fall"
    if (!boxRedBB.intersectsBox(planeBB)) {
        boxRed.position.y -= 1;
        boxRed.position.x -= 0.2;
        if (boxRed.position.y > -5) {
            red = true;
        }
    }

    if (!boxGreenBB.intersectsBox(planeBB)) {
        boxGreen.position.y -= 1;
        boxGreen.position.z -= 0.2;
        if (boxGreen.position.y > -5) {
            green = true;
        }
    }

    if (!boxPinkBB.intersectsBox(planeBB)) {
        boxPink.position.y -= 1;
        boxPink.position.z -= 0.2;
        if (boxPink.position.y > -5) {
            pink = true;
        }
    }

    //check if sphere touches plane 
    if (!playerBB.intersectsBox(planeBB)) {
        sphere.position.y -= 1;
        showLooseMsg()
    }
}




//EVENT LISTENERS

window.addEventListener('keydown', (event) => {

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

document.getElementById("win").addEventListener("click", reloadSite, false);
document.getElementById("loose").addEventListener("click", reloadSite, false);



//init creation
let plane = createFloor()
let planeBB = createBoundingBox(plane)

let player = createSphere()
let playerBB = createBoundingSphere(player)

let boxRed = createBox(-40, 15, 0xDC143C)
let boxRedBB = createBoundingBox(boxRed)
let boxPink = createBox(10, 40, 0xfe4fe3)
let boxPinkBB = createBoundingBox(boxPink)
let boxGreen = createBox(23, -30, 0x11e99a)
let boxGreenBB = createBoundingBox(boxGreen)


createGui()

animate()
