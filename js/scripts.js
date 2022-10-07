console.log("script is connected");

const start = function() {
  const audioCtx = new AudioContext()
  const audioElem = document.createElement('audio')
  source = audioCtx.createBufferSource()

  audioElem.src = '/sound1.ogg'
  audioElem.play()

  audioCtx.decodeAudioData(
    audioElem,
    (buffer) => {
      myBuffer = buffer
      source.buffer = myBuffer
      source.playbackRate.value = playbackControl.value
      source.connect(audioCtx.destination)
      source.loop = true
    }
  )
}

window.onload = function() {
  const pane = new Tweakpane.Pane();
  const btn = pane.addButton({
    title: 'hello'
  })

  btn.on('click', () => {
    start()
  })
}