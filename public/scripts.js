
let     audio = new Audio();
audio.src = "/withoutyou.mp3";
const  canvas = document.getElementById( "visualiserCanvas" ),
    playBtnControl = document.getElementById( "playButton" ),
    context = new window.AudioContext(),
    ctx = canvas.getContext('2d'),
    tbl = document.getElementById( 'inputTable' );
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let source = context.createMediaElementSource( audio ),
    analyzer = context.createAnalyser();
source.connect( analyzer );
analyzer.connect( context.destination );
analyzer.fftSize = 1024;
let buflen = analyzer.frequencyBinCount,
    data = new Uint8Array( buflen ),
    barwidth = canvas.width / buflen + 4,
    volume = 1,
    speed = 1,
    colors = [ "#696969", "#696969", "#696969", "#696969", "#696969" ],
    grd = readUserInput();

playBtnControl.addEventListener('click', () =>
{
    if( context.state === 'suspended' ) { context.resume(); }
    if( playBtnControl.dataset.state === 'off' )
    {
        document.body.style = 'animation-play-state: running;';
        audio.play();
        playBtnControl.dataset.state = 'on';
        playBtnControl.innerHTML = 'Pause';
        grd = readUserInput();
        console.log('play');
    }
    else if( playBtnControl.dataset.state === 'on' )
    {
        document.body.style = 'animation-play-state: paused;';
        audio.pause();
        playBtnControl.dataset.state = 'off';
        playBtnControl.innerHTML = 'Begin'
        grd = readUserInput();
        console.log('pause');
    }
}, false );

audio.addEventListener('ended', () =>
{
    document.body.style = 'animation-play-state: paused;';
    playBtnControl.dataset.state = 'off';
    playBtnControl.innerHTML = 'Restart';
    grd = readUserInput();
    console.log('ended');
}, false );

function animate()
{
    if( playBtnControl.dataset.state === 'on' )
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

function readUserInput()
{
    if( playBtnControl.dataset.state === 'off' )
    {
        tbl.innerHTML  = '<td><label for="vl" style="font-family:\'Karla\',sans-serif;background-color:rgba(255,255,255,.6);text-align:center;">Playback Volume: </label>'
        tbl.innerHTML +=     '<input type="range" id="vl" value="' + volume*10 + '" min="0" max="10" step="1" style="width:210px; height:25px;"></td>'
        tbl.innerHTML += '<td><input type="color" id="c0" value="' + colors[0] + '" style="width:210px; height:25px; text-align:center;"></td><td><input type="color" id="c2" value="' + colors[2] + '" style="width:210px; height:25px; text-align:center;"></td>';
        tbl.innerHTML += '<td><input type="color" id="c1" value="' + colors[1] + '" style="width:210px; height:25px; text-align:center;"></td><td><input type="color" id="c3" value="' + colors[3] + '" style="width:210px; height:25px; text-align:center;"></td>';

        tbl.innerHTML += '<td><label for="sp" style="font-family:\'Karla\',sans-serif;background-color:rgba(255,255,255,.6);text-align:center;">Playback Speed: </label>'
        tbl.innerHTML +=     '<input type="range" id="sp" value="' +  speed*4  + '" min="2" max="12" step="1" style="width:210px; height:25px;"></td>'
    }
    if( playBtnControl.dataset.state === 'on' )
    {
        volume = document.getElementById( "vl" ).value / 10;
        colors[0] = document.getElementById( "c0" ).value;
        colors[1] = document.getElementById( "c1" ).value;
        colors[2] = document.getElementById( "c2" ).value;
        colors[3] = document.getElementById( "c3" ).value;
        colors[4] = document.getElementById( "c3" ).value;
        speed = document.getElementById( "sp" ).value /  4;
        tbl.innerHTML  = '';
    }
    audio.volume = volume;
    audio.playbackRate = speed;
    let grd = ctx.createLinearGradient( 0, 0, 1000, 0 );
    grd.addColorStop( 0.00, colors[0] );
    grd.addColorStop( 0.25, colors[1] );
    grd.addColorStop( 0.50, colors[2] );
    grd.addColorStop( 0.75, colors[3] );
    grd.addColorStop( 1.00, colors[4] );
    return grd;
}
window.onload = function() { animate(); }