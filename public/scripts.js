let     audio = new Audio();
    audio.src = "/source.mp3";
const  canvas = document.getElementById( "canvas" ),
      cubevas = document.getElementById( "cubevas" ),
      control = document.getElementById( "playbutton" ),
      context = new window.AudioContext(),
          ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
audio.addEventListener('ended', () => { control.dataset.state = 'off'; console.log('ended'); }, false );
let source = context.createMediaElementSource( audio ),
  analyzer = context.createAnalyser();
source.connect( analyzer );
analyzer.connect( context.destination );
analyzer.fftSize = 256;
let buflen = analyzer.frequencyBinCount,
data = new Uint8Array( buflen ),
barwidth = canvas.width / buflen;

control.addEventListener('click', () => 
{
    if( context.state === 'suspended' ) { context.resume(); }
    if( control.dataset.state === 'off' )
    {
        audio.play();
        control.dataset.state = 'on';
        console.log('play');
    }
    else if( control.dataset.state === 'on' )
    {
        audio.pause();
        control.dataset.state = 'off';
        console.log('pause');
    }
}, false );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 25, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( /*renderer.domElement*/ cubevas );
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0xaaaaaa } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 3;

function animate()
{
    if( control.dataset.state === 'on' )
    {
        var ctx = canvas.getContext('2d'),
        x = 0;
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        analyzer.getByteFrequencyData( data );
        for ( let i = 0 ; i < buflen ; i++ )
        {
            barheight = data[i]*2.5;
            let grd = ctx.createLinearGradient( 0, 0, 1000, 0 );
            grd.addColorStop( 0.00, "#080806" );
            grd.addColorStop( 0.25, "#977A74" );
            grd.addColorStop( 0.50, "#EBE84D" );
            grd.addColorStop( 0.75, "#EA3522" );
            grd.addColorStop( 1.00, "#397326" );
            ctx.fillStyle = grd;
            ctx.fillRect( x, canvas.height - barheight, barwidth, barheight );
            x += barwidth;
        }
        cube.rotation.x += 0.10;
        cube.rotation.y += 0.10;
        cube.rotation.z += 0.10;
        renderer.render( scene, camera );
    }
    requestAnimationFrame(animate);
}
window.onload = function() { animate(); }