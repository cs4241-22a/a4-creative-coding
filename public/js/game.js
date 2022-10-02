//this script is loaded in the index.html file
// generates a random tree when the spacebar is pressed
let canvas, ctx;
let lenCoeff = 0.8;
let widthCoeff = 0.8;
let angleCoeff = Math.PI / 4;
let angleStd = Math.PI / 16;
let startWidth = 10;
let startLength = 100;

window.onload = function () {
  //get the canvas element
  canvas = document.getElementById("game");
  //get the 2d context
  ctx = canvas.getContext("2d");
  //set the canvas width and height
  canvas.width = 800;
  canvas.height = 600;
  //set the canvas background color
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw the tree
  let tree = new Tree(
    new Point(canvas.width / 2, canvas.height),
    startLength,
    -Math.PI / 2,
    startWidth
  );
  tree.draw();

  //add a key listener
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      //clear the canvas
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //draw the tree
      let tree = new Tree(
        new Point(canvas.width / 2, canvas.height),
        100,
        -Math.PI / 2,
        10
      );
      tree.draw();
    }
  });
};

const getNormalDist = (mean, std) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num * std + mean;
  return num;
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Branch {
  constructor(start, length, angle, stroke) {
    this.start = start;
    this.length = length;
    this.angle = angle;
    this.stroke = stroke;

    this.end = new Point(
      this.start.x + this.length * Math.cos(this.angle),
      this.start.y + this.length * Math.sin(this.angle)
    );

    this.branches = [];
    if (stroke < 1) return;

    for (let i = 0; i < 2; i++) {
      let newAngle =
        getNormalDist(this.angle, angleStd) + angleCoeff * (i - 0.5);
      let newLength = this.length * lenCoeff;
      let newStroke = this.stroke * widthCoeff;
      this.branches.push(new Branch(this.end, newLength, newAngle, newStroke));
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.lineWidth = this.stroke;
    ctx.strokeStyle = "brown";
    ctx.stroke();
    for (let branch of this.branches) {
      branch.draw();
    }
  }
}

class Tree {
  constructor(start, length, angle, stroke) {
    this.start = start;
    this.length = length;
    this.angle = angle;
    this.stroke = stroke;
    this.root = new Branch(this.start, this.length, this.angle, this.stroke);
  }

  draw() {
    this.root.draw();
  }
}
