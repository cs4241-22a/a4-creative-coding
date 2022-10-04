window.onload = function() {
  let ctx =  new AudioContext()
  let osc = ctx.createOscillator()
  osc.connect( ctx.destination )
  let gainNode = ctx.createGain()

  const startBut = document.querySelector("#start")

  startBut.addEventListener('click', () => {
    osc.start(0)
  })
  
  const stopBut = document.querySelector("#stop")
  
  stopBut.addEventListener('click', () => {
    osc.stop(0)
  })
  
  const freqType = document.querySelector("#type")
  
  freqType.addEventListener('input', () => {
    osc.type = freqType.value
  })
  
  const volControl = document.querySelector("#volume")
  
  volControl.addEventListener('input', () => {
    gainNode.gain.value = volControl.value
  })

  const freqControl = document.querySelector("#frequency")

  freqControl.addEventListener("input", () => {
    osc.frequency.setValueAtTime(freqControl.value, ctx.currentTime)
  })

  const detuneControl = document.querySelector("#detune")

  detuneControl.addEventListener("input", () => {
    osc.detune.setValueAtTime(detuneControl.value, ctx.currentTime)
  })

}
