console.log("script is connected");

const start = function() {
  const audioCtx = new AudioContext()
  const audioElem = document.createElement('audio')

  audioElem.src = '/sound1.ogg'
  audioElem.play()
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