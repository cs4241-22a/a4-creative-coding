let     audio = new Audio();
    audio.src = "/source.mp3";
const canvas  = document.getElementById( "canvas" ),
      control = document.getElementById( "playbutton" ),
      context = new window.AudioContext(),
          ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight*.75;
audio.addEventListener('ended', () => { control.dataset.state = 'off'; console.log('ended'); }, false );
let source = context.createMediaElementSource( audio ),
  analyzer = context.createAnalyser();
source.connect( analyzer );
analyzer.connect( context.destination );
analyzer.fftSize = 128;
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

function eq()
{
    if( control.dataset.state === 'on' )
    {
        var ctx = canvas.getContext('2d');
        x = 0;
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        analyzer.getByteFrequencyData( data );
        for ( let i = 0 ; i < buflen ; i++ )
        {
            barheight = data[i];
            let grd = createLinearGradient( 0, 0, 100, 0 );
            grd.addColorStop( 0.00, "#080806" );
            grd.addColorStop( 0.25, "#977A74" );
            grd.addColorStop( 0.50, "#EBE84D" );
            grd.addColorStop( 0.75, "#EA3522" );
            grd.addColorStop( 1.00, "#397326" );
            ctx.fillStyle = grd;
            ctx.fillRect( x, canvas.height - barheight, barwidth, barheight );
            x += barwidth;
        }
    }
    requestAnimationFrame(eq);
}
window.onload = function() { eq(); }