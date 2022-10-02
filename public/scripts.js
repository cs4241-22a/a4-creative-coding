let     audio = new Audio(),
       source = null,
     analyzer = null;
    audio.src = "/source.mp3";
const context = new (window.AudioContext || window.webkitAudioContext)(),
    container = document.getElementById( "container" ),
       canvas = document.getElementById( "canvas" );
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
source = context.createMediaElementSource( audio );
analyzer = context.createAnalyser();
source.connect( analyzer );
analyzer.connect( context.destination );

analyzer.fftSize = 128;
const buflen = analyzer.frequencyBinCount,
        data = new Uint8Array( buflen ),
    barwidth = canvas.width / buflen;

function animate()
{
    x = 0;
    context.clearRect( 0, 0, canvas.width, canvas.height );
    analyzer.getByteFrequencyData( data );
    for ( let i = 0 ; i < buflen ; i++ )
    {
        barheight = data[i];
        context.fillStyle = "white";
        context.fillRect( x, canvas.height - barheight, barwidth, barheight );
        x += barwidth;
    }
    requestAnimationFrame(animate);
}
window.onload = function()
{
    audio.play();
    animate();
};