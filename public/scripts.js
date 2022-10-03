let     audio = new Audio();
    audio.src = "/source.mp3";
const canvas  = document.getElementById( "canvas" ),
      control = document.getElementById( "playbutton" );
      context = new window.AudioContext();
audio.addEventListener('ended', () => { control.dataset.state = 'off'; console.log('ended'); }, false );
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let source = context.createMediaElementSource( audio ),
  analyzer = context.createAnalyser();
source.connect( analyzer );
analyzer.connect( context.destination );
analyzer.fftSize = 128;
let buflen = analyzer.frequencyBinCount,
data = new Uint8Array( buflen )
barwidth = canvas.width / buflen;



control.addEventListener('click', () => 
{
    if( context.state === 'suspended' )
    {
        context.resume();
        console.log('resume');
    }
    else if( control.dataset.state === 'off' )
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

function animate()
{
    if( control.dataset.state === 'on' )
    {
        x = 0;
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        analyzer.getByteFrequencyData( data );
        for ( let i = 0 ; i < buflen ; i++ )
        {
            barheight = data[i];
            ctx.fillStyle = "white";
            ctx.fillRect( x, canvas.height - barheight, barwidth, barheight );
            x += barwidth;
        }
    }
    requestAnimationFrame(animate);
}
window.onload = function()
{
    animate();
}