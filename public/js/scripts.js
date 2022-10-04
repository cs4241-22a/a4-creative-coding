document.body.innerHTML = ''
canvas = document.createElement( 'canvas' )
document.body.appendChild( canvas )

canvas.width = canvas.height = 512

// get our 2D drawing context, pass 'webgl' for most 3D drawing
ctx = canvas.getContext( '2d' )
audioCtx = new AudioContext()
osc  = audioCtx.createOscillator()
osc.type = 'square'
osc.frequency.value = 80
osc.frequency.linearRampToValueAtTime( 880 * 4, audioCtx.currentTime + 30 )
osc.start()
osc.connect( audioCtx.destination )

var analyser = audioCtx.createAnalyser()

analyser.fftSize = 1024 // 512 bins

// connect our sin oscillator to our analyser node
osc.connect( analyser )

// create a typed JS array to hold analysis results
var results = new Uint8Array( analyser.frequencyBinCount )

draw = function() {
  // temporal recursion, call tthe function in the future
  window.requestAnimationFrame( draw )
  
  ctx.fillStyle = 'black' 
  ctx.fillRect( 0,0,canvas.width,canvas.height )
  ctx.fillStyle = 'white' 
  
  analyser.getByteFrequencyData( results )
  
  for( let i = 0; i < analyser.frequencyBinCount; i++ ) {
    ctx.fillRect( i, 0, 1, results[i] ) // upside down
  }
}

// must call draw to start the loop
draw()