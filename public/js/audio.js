var synths = [undefined, undefined, undefined, undefined];
var lowpass = [undefined, undefined, undefined, undefined];
var highpass = [undefined, undefined, undefined, undefined];
var reverb = [undefined, undefined, undefined, undefined];
const frets = [
  ["z", "x", "c", "v", "b", "n", "m"],
  ["a", "s", "d", "f", "g", "h", "j"],
  ["q", "w", "e", "r", "t", "y", "u"],
  ["1", "2", "3", "4", "5", "6", "7"],
];
const freqs = [392, 261, 329, 440]; //G C E A handtuned
let clicked = false;

let keysPressed = [];

window.onload = function () {
  document.addEventListener("click", () => {
    if (!clicked) {
      clicked = true;
      for (let i = 0; i < 4; i++) {
        synths[i] = new Tone.PluckSynth({
          attackNoise: 10,
          release: "64n",
          resonance: 0.98,
        });
        highpass[i] = new Tone.Filter(200, "highpass");
        lowpass[i] = new Tone.Filter(4000, "lowpass").toDestination();
        reverb[i] = new Tone.Reverb(3);
        synths[i].connect(highpass[i]);
        highpass[i].connect(lowpass[i]);
        lowpass[i].connect(reverb[i]);
      }
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!keysPressed.includes(e.key.toLowerCase())) {
      keysPressed.push(e.key.toLowerCase());
    }
  });
  document.addEventListener("keyup", (e) => {
    if (keysPressed.includes(e.key.toLowerCase())) {
      keysPressed.splice(keysPressed.indexOf(e.key.toLowerCase()), 1);
    }
  });
  const strings = document.getElementsByClassName("string");
  for (let i = strings.length - 1; i >= 0; i--) {
    strings[strings.length - i - 1].addEventListener(
      "mouseenter",
      (e) => playnote(e, i),
      false
    );
  }
  const volume = document.getElementById("volume");
  volume.oninput = ()=>{
    let vol = volume.value
    synths.forEach((e)=>{
      e.volume.value = (vol -8)*2;
    }); 
  };
  const sustain = document.getElementById("sustain");
  sustain.oninput = ()=>{
    let sus = sustain.value
    synths.forEach((e)=>{
      e.set({resonance: sus/500 + 0.97});
    }); 
  };
  draw();
};

const draw = () => {
  const strings = document.getElementsByClassName("string");
  for (let i = 0; i < strings.length; i++) {
    strings[i].width = document.body.clientWidth - 10;
    strings[i].height = 25 + (-strings.length + i) * 1.5;
    let ctx = strings[i].getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, strings[i].width, strings[i].height);
    let width = strings[i].width;
    ctx.font = "17px sans-serif"
    ctx.fillStyle = "white";
    for (let j = 0; j < frets[0].length; j++) {
      ctx.fillText(
        frets[frets.length - (1+i)][j],
        Math.floor(((width - 5) * j) / (frets[0].length * 2) + (width - 5)/ (frets[0].length * 4) ),
        15,
      );
    }
  }
  const spaces = document.getElementsByClassName("space");
  for (let i = 0; i < spaces.length; i++) {
    spaces[i].width = document.body.clientWidth - 10;
    spaces[i].height = 10;
    let ctx = spaces[i].getContext("2d");
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, spaces[i].width, spaces[i].height);
    ctx.fillStyle = "black";
    ctx.fillRect(spaces[i].width - 10, -32.5, spaces[i].width, spaces[i].height);
    ctx.fillStyle = "yellow";
    let width = spaces[i].width;
    for (let i = 0; i <= frets[0].length; i++) {
      ctx.fillRect(
        Math.floor(((width - 5) * i) / (frets[0].length * 2)),
        0,
        5,
        10
      );
    }
  }
  const top_body = document.getElementById("topbody");
  top_body.width = document.body.clientWidth - 10;
  let radius = document.body.clientWidth/10
  top_body.height = radius;
  let ctx = top_body.getContext("2d");
  ctx.fillStyle = "#ab5a27";
  ctx.beginPath();
  ctx.moveTo(top_body.width/1.75, top_body.height);
  ctx.bezierCurveTo(top_body.width/1.75 + 10, 0, top_body.width/1.2, 0, top_body.width/1.1, 50);
  ctx.bezierCurveTo(top_body.width/1.05, -5, top_body.width , 0, top_body.width, 0);
  ctx.lineTo(top_body.width,top_body.height)
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(top_body.width -radius*2 , top_body.height + 67.5, radius, Math.sin(67.5/radius), Math.PI - Math.sin(67.5/radius), true);
  ctx.fill();
  const bot_body = document.getElementById("bottombody");
  bot_body.width = document.body.clientWidth - 10;
  bot_body.height = radius;
  ctx = bot_body.getContext("2d");
  ctx.fillStyle = "#ab5a27";
  ctx.beginPath();
  ctx.moveTo(top_body.width/1.75, 0);
  ctx.bezierCurveTo(bot_body.width/1.75 + 10, bot_body.height, bot_body.width/1.2, bot_body.height, bot_body.width/1.1, bot_body.height-50);
  ctx.bezierCurveTo(bot_body.width/1.05, bot_body.height+5, bot_body.width , bot_body.height, bot_body.width, bot_body.height);
  ctx.lineTo(bot_body.width,0)
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bot_body.width -radius*2 , - 67.5, radius, -Math.sin(67.5/radius), Math.sin(67.5/radius) - Math.PI, false );
  ctx.fill();
  window.requestAnimationFrame(draw);
};
const playnote = (e, note) => {
  if (clicked && e.buttons % 2 === 1) {
    let index = 0;
    for (let i = frets[note].length; i > 0; i--) {
      if (keysPressed.includes(frets[note][i - 1])) {
        index = i;
        break;
      }
    }
    synths[note].triggerAttack(
      freqs[note] * Math.pow(1.05946, index),
      Tone.now()
    );
  }
};
