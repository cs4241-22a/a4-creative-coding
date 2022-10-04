// window.onclick{
//     audioCtx = new AudioContext()
//     osc = audioCtx.createOscillator()
//     osc.connect( audioCtx.destination )

//     // now tell our osc oscillator to start running
//     // the 0 argument means start now, but we could also
//     // delay until some point in the future.
//     osc.start( 0 )

//     // we can change the frequency....
//     osc.frequency.value = 220

//     // we can also tell the oscillator to gradually ramp
//     // to a new frequency. Time is measured in seconds oscce
//     // the audio context was first created, to get a relative time value
//     // we can use the ctx.currentTime property

//     osc.frequency.linearRampToValueAtTime( 1760, audioCtx.currentTime + 30 )

//     // to stop...
//     // osc.stop()
// }