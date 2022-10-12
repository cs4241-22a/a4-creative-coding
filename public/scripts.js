import * as THREE from 'three'
const scene = new THREE.Scene()
const camera = THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
scene.background = new THREE.Color(0x0D1821)
//boolean for what cubes are visible
var uppercube = true
var lowercube = true
//the base size of the cube, and the variables
// that are multiplying the sizes
var defaultsize = 1
var uppersize = 1
var lowersize = 1

//create box and make two meshes
var box = new THREE.BoxGeometry(1, 1, 1)
var basiccolor = new THREE.MeshBasicMaterial({color: 0xB4CDED})
var cube1 = new THREE.Mesh(box, basiccolor)
var cube2 = new THREE.Mesh(box, basiccolor)
//create the audio and play it
const context = new AudioContext()
const audio = new Audio("./Assets/188 Lake Floria (Underwater).mp3")
audio.load();
audio.play();

//webaudio gives us audio context
const src = context.createMediaElementSource(audio)
const analyser = context.createAnalyser()
src.connect(analyser)
//analyser to get the frequencies
analyser.connect(context.destination)

//frequency data array
analyser.fftSize = 512
var bufferLength = analyser.frequencyBinCount
var dataArray = new Uint8Array(bufferLength)

//place the boxes on the screen
const placeobjs = function(){

  cube2.position.x = 5

  scene.add(cube1)
  scene.add(cube2)

  camera.position.z=5
  camera.position.x = (cube1.position.x + cube2.position.x)/1

}

//animate the boxes to rotate constantly
const animate = function(){
  requestAnimationFrame(animate)

  cube1.rotation.x += 0.01
  cube1.rotation.y += 0.01
  cube2.rotation.x += 0.01
  cube2.rotation.y += 0.01
  
  //also change the size of the cubes
  // based on the average frequencies
  cube1.scale.x = defaultsize * uppersize
  cube1.scale.y = defaultsize * uppersize
  cube1.scale.z = defaultsize * uppersize
  
  cube1.scale.x = defaultsize * lowersize
  cube1.scale.y = defaultsize * lowersize
  cube1.scale.z = defaultsize * lowersize
  //render the scene to the screen
  renderer.render(scene, camera)
}
//call animate to constantly animate
animate();
//get the frequency data
const render = function(){
  //get the raw data
  analyser.getByteFrequencyData(dataArray)
  
  //slice it in half to get two frequency arrays
  var lowerHalf = dataArray.slice(0, (dataArray.length/2) - 1)
  var upperHalf = dataArray.slice((dataArray.length/2) - 1, dataArray.length -1)
  
  //find max and averages
  var lowerMax = findmax(lowerHalf)
  var lowerAvg = findavg(lowerHalf)
  var upperMax = findmax(upperHalf)
  var upperAvg = findavg(upperHalf) 
  
  //set the multiplying variables to be the
  // averages divided by 3 to get a smaller number
  uppersize = upperAvg / 3
  lowersize = lowerAvg / 3
}
//call render to constantly update data
render();
  
//function to find the maximum number in an array
const findmax = function(array){
  let max = 0
  for(var x = 0; x < array.length; x++){
    if(array[x] > max){
      max = array[x]
    }
  }
  return max
}
//function to find the average of an array
const findavg = function(array){
  let avg = 0
  let numind = array.length
  let total = 0
  for(var x = 0; x < numind; x++){
    total = total + array[x]
  }
  avg = total/numind
  return avg
}

//on load call the object placement and animate
window.onload = function(){
  placeobjs()
  animate()
}
//trigger changes with the update button hit
const updatebtn = document.getElementById("updatebtn")
const onClickUpdate = function(){
  //remove the cubes so that we dont have duplicates
  scene.remove(cube1)
  uppercube = false
  scene.remove(cube2)
  lowercube = false
  
  //get the boxes that are clicked
  const upperfrq = document.querySelector("#upperfr")
  const lowerfrq = document.querySelector("#lowerfr")
  
  //spawn in cubes as selected
  if(upperfrq == true){
    scene.add(cube1)
    uppercube = true
  }else{}
  if(lowerfrq == true){
    scene.add(cube2)
    cube2.position.x = 5
    lowercube = true
  }else{}
  
  //change camera location according to cubes spawned in
  if(uppercube == true || lowercube == true){
    camera.position.z=5
    camera.position.x = (cube1.position.x + cube2.position.x)/1
  }else if(uppercube == true){
    camera.position.x = cube1.position.x
  }else if(lowercube == true){
    camera.position.x = cube2.position.x
  }
}
