let     audio = new Audio();
    audio.src = "/source.mp3";
const  canvas = document.getElementById( "canvas" ),
      control = document.getElementById( "playbutton" ),
      context = new window.AudioContext(),
          ctx = canvas.getContext('2d'),
          tbl = document.getElementById( 'colors' );
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let source = context.createMediaElementSource( audio ),
  analyzer = context.createAnalyser();
source.connect( analyzer );
analyzer.connect( context.destination );
analyzer.fftSize = 512;
let buflen = analyzer.frequencyBinCount,
      data = new Uint8Array( buflen ),
  barwidth = canvas.width / buflen,
    colors = [ "#080806", "#977A74", "#EBE84D", "#EA3522", "#397326" ];

audio.addEventListener('ended', () =>
{
    document.body.style = 'animation-play-state: paused;';
    control.dataset.state = 'off';
    control.innerHTML = 'play again?';
    readcolors();
    console.log('ended');
}, false );
control.addEventListener('click', () => 
{
    if( context.state === 'suspended' ) { context.resume(); }
    if( control.dataset.state === 'off' )
    {
        document.body.style = 'animation-play-state: running;';
        audio.play();
        control.dataset.state = 'on';
        control.innerHTML = 'pause!';
        readcolors();
        console.log('play');
    }
    else if( control.dataset.state === 'on' )
    {
        document.body.style = 'animation-play-state: paused;';
        audio.pause();
        control.dataset.state = 'off';
        control.innerHTML = 'play!'
        readcolors();
        console.log('pause');
    }
}, false );

function animate()
{
    if( control.dataset.state === 'on' )
    {
        var x = 0;
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        analyzer.getByteFrequencyData( data );
        for ( let i = 0 ; i < buflen ; i++ )
        {
            let barheight = data[i]*2.5;
            ctx.fillStyle = grd;
            ctx.fillRect( x, canvas.height - barheight, barwidth, barheight );
            x += barwidth;
        }
    }
    requestAnimationFrame(animate);
}
function readcolors()
{
    if( control.dataset.state === 'off' )
    {
        tbl.innerHTML  = '<td><input type="text" id="c0" value="' + colors[0] + '" style="width:210px; height:25px; text-align:center;"></td>';
        tbl.innerHTML += '<td><input type="text" id="c2" value="' + colors[2] + '" style="width:210px; height:25px; text-align:center;"></td>';
        tbl.innerHTML += '<td><input type="text" id="c1" value="' + colors[1] + '" style="width:210px; height:25px; text-align:center;"></td>';
        tbl.innerHTML += '<td><input type="text" id="c3" value="' + colors[3] + '" style="width:210px; height:25px; text-align:center;"></td>';
        tbl.innerHTML += '<td><input type="text" id="c4" value="' + colors[4] + '" style="width:210px; height:25px; text-align:center;"></td>';
    }
    if( control.dataset.state === 'on' )
    {
        colors[0] = document.getElementById( "c0" ).value;
        console.log( document.getElementById( "c0" ).value );
        colors[1] = document.getElementById( "c1" ).value;
        colors[2] = document.getElementById( "c2" ).value;
        colors[3] = document.getElementById( "c3" ).value;
        colors[4] = document.getElementById( "c4" ).value;
        console.log( colors );
        tbl.innerHTML  = '';
    }
    grd = ctx.createLinearGradient( 0, 0, 1000, 0 );
                grd.addColorStop( 0.00, colors[0] );
                grd.addColorStop( 0.25, colors[1] );
                grd.addColorStop( 0.50, colors[2] );
                grd.addColorStop( 0.75, colors[3] );
                grd.addColorStop( 1.00, colors[4] );
    return grd;
}
window.onload = function() { readcolors(); animate(); }