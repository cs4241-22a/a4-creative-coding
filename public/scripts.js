let     audio = new Audio(), context = null, canvas = null, source = null, analyzer = null, buflen = null, data = null, barwidth = null;
    audio.src = "/source.mp3";
function starter()
{
    context = new (window.AudioContext || window.webkitAudioContext)(),
    canvas = document.getElementById( "canvas" );
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    source = context.createMediaElementSource( audio );
    analyzer = context.createAnalyser();
    source.connect( analyzer );
    analyzer.connect( context.destination );
    analyzer.fftSize = 128;
    buflen = analyzer.frequencyBinCount;
    data = new Uint8Array( buflen );
    barwidth = canvas.width / buflen;
    audio.play();
    animate();
}

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
    const startbutton = document.getElementById( "startbutton" );
    startbutton.onclick = starter;
};