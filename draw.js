const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.style.backgroundColor = "white";
canvas.style.width ='100%';
canvas.style.height ='100%';

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

console.log("started!");

//changing elements
const background = document.getElementById("backSlide");
const canvasBack = document.getElementById("canvasSlide")

//changes background using slider
background.addEventListener('input', function () {
    console.log(background.value);
    if(background.value == 1)
        document.body.style.backgroundColor = "black";
    if(background.value == 2)
        document.body.style.backgroundColor = "dimgray";
    if(background.value == 3)
        document.body.style.backgroundColor = "gray";
    if(background.value == 4)
        document.body.style.backgroundColor = "darkgray";
    if(background.value == 5)
        document.body.style.backgroundColor = "silver";
    if(background.value == 6)
        document.body.style.backgroundColor = "gainsboro";
    if(background.value == 7)
        document.body.style.backgroundColor = "white";
  }, false);

  canvasBack.addEventListener('input', function () {
    console.log(canvasBack.value);
    if(canvasBack.value == 2)
        canvas.style.backgroundColor = "dimgray";
    if(canvasBack.value == 3)
        canvas.style.backgroundColor = "gray";
    if(canvasBack.value == 4)
        canvas.style.backgroundColor = "darkgray";
    if(canvasBack.value == 5)
        canvas.style.backgroundColor = "silver";
    if(canvasBack.value == 6)
        canvas.style.backgroundColor = "gainsboro";
    if(canvasBack.value == 7)
        canvas.style.backgroundColor = "white";

  }, false);

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);