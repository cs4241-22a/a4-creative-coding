let canvas, ctx;
let lenCoeff = 0.8;
let widthCoeff = 0.8;
let angleCoeff = 0.75;
let angleStd = 0.2;
let lenStd = 0.05;
let widthStd = 0.05;
let startWidth = 10;
let startLength = 100;
let seed = 61;
let numTrees = 3;
let trees = [];
let drawShadows = false;
let branchColor = "#4d2806";
let leafColor = "green";
let doDrawLeaves = true;
let doDrawBackground = true;
let backgroundColor = "black";
const defaultHelpText = "Hover over a slider to see its description";

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let moonLoc = new Point(100, 100);

window.onload = function () {
  //get the canvas element
  canvas = document.getElementById("game");
  //get the 2d context
  ctx = canvas.getContext("2d");
  //set the canvas width and height
  canvas.width = 1200;
  canvas.height = 800;

  const renderScene = () => {
    console.time("render");
    trees = [];
    Math.seedrandom(seed);
    resetBackground();
    genTrees();
    drawTrees();
    drawFog();
    console.timeEnd("render");
  };

  let helpPane = window.document.getElementById("help-pane");
  //on hover for any of the sliders, show a message in the help pane
  helpPane.innerHTML = defaultHelpText;

  //set on input listeners
  let seedElt = window.document.getElementById("seed");

  let fancyRender = window.document.getElementById("generate");
  fancyRender.addEventListener("click", () => {
    drawShadows = true;
    renderScene();
    drawShadows = false;
  });

  fancyRender.addEventListener("mouseover", () => {
    helpPane.innerHTML = "Over 1 sec/tree to render with shadows.";
  });

  fancyRender.addEventListener("mouseout", () => {
    helpPane.innerHTML = defaultHelpText;
  });

  let branchColorElt = window.document.getElementById("branchColor");
  branchColorElt.addEventListener("input", (e) => {
    branchColor = e.target.value;
    renderScene();
  });

  branchColorElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Change the color of the branches";
  });

  branchColorElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let leafColorElt = window.document.getElementById("leafColor");
  leafColorElt.addEventListener("input", (e) => {
    leafColor = e.target.value;
    renderScene();
  });

  leafColorElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Change the color of the leaves";
  });

  leafColorElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let leavesElt = window.document.getElementById("leaves");
  leavesElt.addEventListener("input", (e) => {
    //check if the checkbox is checked
    doDrawLeaves = e.target.checked;
    renderScene();
  });

  leavesElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Toggle leaves on and off";
  });

  leavesElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let downloadButton = window.document.getElementById("download");
  downloadButton.addEventListener("click", () => {
    //download the canvas as an image
    let link = document.createElement("a");
    link.download = "treeScene.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  downloadButton.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Download the scene as an image";
  });

  downloadButton.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let startLengthElt = window.document.getElementById("startLength");
  startLengthElt.addEventListener("input", (e) => {
    startLength = e.target.value;
    renderScene();
  });

  startLengthElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Change the length of the first branch";
  });

  startLengthElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let lenCoeffElt = window.document.getElementById("lenCoeff");
  lenCoeffElt.addEventListener("input", (e) => {
    console.log(lenCoeff);
    //parse the value as a float
    lenCoeff = parseFloat(e.target.value);
    console.log(lenCoeff);
    renderScene();
  });

  lenCoeffElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Change the length coefficient";
  });

  lenCoeffElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let lenStdElt = window.document.getElementById("lenStd");
  lenStdElt.addEventListener("input", (e) => {
    lenStd = parseFloat(e.target.value);
    renderScene();
  });

  lenStdElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Change the length standard deviation";
  });

  lenStdElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let widthElt = window.document.getElementById("startWidth");
  widthElt.addEventListener("input", (e) => {
    startWidth = parseFloat(e.target.value);
    renderScene();
  });

  widthElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Change the width of the first branch";
  });

  widthElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let widthCoeffElt = window.document.getElementById("widthCoeff");
  widthCoeffElt.addEventListener("input", (e) => {
    widthCoeff = parseFloat(e.target.value);
    renderScene();
  });

  widthCoeffElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Mean multiplier for a new branch's width";
  });

  widthCoeffElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let widthStdElt = window.document.getElementById("widthStd");
  widthStdElt.addEventListener("input", (e) => {
    widthStd = parseFloat(e.target.value);
    renderScene();
  });

  widthStdElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Standard deviation for a new branch's width";
  });

  widthStdElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let angleCoeffElt = window.document.getElementById("angleCoeff");
  angleCoeffElt.addEventListener("input", (e) => {
    angleCoeff = parseFloat(e.target.value);
    renderScene();
  });

  angleCoeffElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Mean change in a new branch's angle";
  });

  angleCoeffElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let angleStdElt = window.document.getElementById("angleStd");
  angleStdElt.addEventListener("input", (e) => {
    angleStd = parseFloat(e.target.value);
    renderScene();
  });

  angleStdElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Standard deviation for a new branch's angle";
  });

  angleStdElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let numTreesElt = window.document.getElementById("numTrees");
  numTreesElt.addEventListener("input", (e) => {
    numTrees = parseInt(e.target.value);
    renderScene();
  });

  numTreesElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Number of trees to draw";
  });

  numTreesElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  seedElt.oninput = (event) => {
    seed = event.target.value;
    renderScene();
  };

  seedElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Seed for the random number generator";
  });

  seedElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let backgroundElt = window.document.getElementById("background");
  backgroundElt.addEventListener("input", (e) => {
    //checkbox
    doDrawBackground = e.target.checked;
    renderScene();
  });

  backgroundElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Toggle background";
  });

  backgroundElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  let backgroundColorElt = window.document.getElementById("backgroundColor");
  backgroundColorElt.addEventListener("input", (e) => {
    backgroundColor = e.target.value;
    renderScene();
  });

  backgroundColorElt.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Change background color";
  });

  backgroundColorElt.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  const resetUI = () => {
    //update the UI and send input events to the controls
    seedElt.value = seed;
    seedElt.dispatchEvent(new Event("input"));
    startLengthElt.value = startLength;
    startLengthElt.dispatchEvent(new Event("input"));
    lenCoeffElt.value = lenCoeff;
    lenCoeffElt.dispatchEvent(new Event("input"));
    lenStdElt.value = lenStd;
    lenStdElt.dispatchEvent(new Event("input"));
    widthElt.value = startWidth;
    widthElt.dispatchEvent(new Event("input"));
    widthCoeffElt.value = widthCoeff;
    widthCoeffElt.dispatchEvent(new Event("input"));
    widthStdElt.value = widthStd;
    widthStdElt.dispatchEvent(new Event("input"));
    angleCoeffElt.value = angleCoeff;
    angleCoeffElt.dispatchEvent(new Event("input"));
    angleStdElt.value = angleStd;
    angleStdElt.dispatchEvent(new Event("input"));
    numTreesElt.value = numTrees;
    numTreesElt.dispatchEvent(new Event("input"));
    backgroundElt.checked = doDrawBackground;
    backgroundElt.dispatchEvent(new Event("input"));
    backgroundColorElt.value = backgroundColor;
    backgroundColorElt.dispatchEvent(new Event("input"));
    leafColorElt.value = leafColor;
    branchColorElt.value = branchColor;
  };

  const resetVals = () => {
    //reset all the values to their defaults
    seed = 61;
    startLength = 100;
    lenCoeff = 0.8;
    lenStd = 0.05;
    startWidth = 10;
    widthCoeff = 0.8;
    widthStd = 0.05;
    angleCoeff = 0.75;
    angleStd = 0.2;
    numTrees = 3;
    doDrawLeaves = true;
    drawShadows = false;
    doDrawBackground = true;
    backgroundColor = "#000000";
    branchColor = "#4d2806";
    leafColor = "green";
  };

  const resetAll = () => {
    resetVals();
    resetUI();
  };

  const preset1 = () => {
    resetAll();
    //click the fancy button
    fancyRender.dispatchEvent(new Event("click"));
  };

  const preset2 = () => {
    resetVals();
    seed = 69;
    startLength = 200;
    lenCoeff = 0.75;
    lenStd = 0;
    startWidth = 12;
    widthCoeff = 0.8;
    widthStd = 0;
    angleCoeff = 1.06;
    angleStd = 0;
    numTrees = 1;
    doDrawLeaves = false;
    doDrawBackground = false;
    backgroundColor = "white";
    branchColor = "black";
    resetUI();
  };

  const preset3 = () => {
    resetVals();
    // 238, 17, 95
    leafColor = "#ee115f";

    resetUI();
    fancyRender.dispatchEvent(new Event("click"));
  };

  const preset4 = () => {
    resetVals();
    //0,174,0
    leafColor = "#00ae00";
    seed = 56;
    startLength = 144;
    lenStd = 0.03;
    widthCoeff = 0.81;
    widthStd = 0.03;
    angleCoeff = 0.89;
    angleStd = 0.09;
    numTrees = 1;
    resetUI();
    fancyRender.dispatchEvent(new Event("click"));
  };

  let preset1Elt = window.document.getElementById("preset1");
  preset1Elt.addEventListener("click", (e) => {
    preset1();
  });

  let preset2Elt = window.document.getElementById("preset2");
  preset2Elt.addEventListener("click", (e) => {
    preset2();
  });

  let preset3Elt = window.document.getElementById("preset3");
  preset3Elt.addEventListener("click", (e) => {
    preset3();
  });

  let preset4Elt = window.document.getElementById("preset4");
  preset4Elt.addEventListener("click", (e) => {
    preset4();
  });

  let resetBtn = window.document.getElementById("reset");
  resetBtn.addEventListener("click", (e) => {
    resetAll();
  });

  resetBtn.addEventListener("mouseover", (e) => {
    helpPane.innerHTML = "Reset all parameters to their default values";
  });

  resetBtn.addEventListener("mouseout", (e) => {
    helpPane.innerHTML = defaultHelpText;
  });

  seedElt.dispatchEvent(new Event("input"));

  renderScene();

  //add a key listener
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      seed = Math.floor(Math.random() * 100000);
      seedElt.value = seed;
      renderScene();
    }
  });
};

const drawFog = () => {
  //add a grey fog effect using gradient to the bottom of the canvas
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0.25, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,.25)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const resetBackground = () => {
  //draw shadow
  if (drawShadows) {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = "black";
  } else {
    ctx.shadowColor = "none";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = "white";
  }

  if (doDrawBackground) {
    //set the canvas background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //create a "moon" in the corner
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(moonLoc.x, moonLoc.y, 50, 50, 0, 0, 2 * Math.PI);
    ctx.fill();

    drawStars();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

const genTrees = () => {
  for (let i = 0; i < numTrees; i++) {
    let tree = new Tree(
      new Point(Math.random() * canvas.width, canvas.height),
      startLength,
      -Math.PI / 2,
      startWidth
    );
    trees.push(tree);
  }
};

const drawTrees = () => {
  trees.forEach(async (tree) => {
    tree.draw();
  });
};

const drawStars = () => {
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 2,
      Math.random() * 2,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
};

const getNormalDist = (mean, std) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // to avoid log(0)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num * std + mean;
  return num;
};

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
      let newLength = this.length * getNormalDist(lenCoeff, lenStd);
      let newStroke = this.stroke * getNormalDist(widthCoeff, widthStd);
      this.branches.push(new Branch(this.end, newLength, newAngle, newStroke));
    }
  }

  drawLeaf() {
    ctx.strokeStyle = leafColor;
    ctx.fillStyle = leafColor;
    //draw an oval from the start point to the end point at the correct angle
    ctx.beginPath();
    //set angle
    ctx.translate(this.end.x, this.end.y);
    ctx.rotate(this.angle);
    //draw oval
    ctx.ellipse(0, 0, this.length, this.stroke * 2, 0, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fill();
    //reset angle
    ctx.rotate(-this.angle);
    ctx.translate(-this.end.x, -this.end.y);
  }

  drawBranch() {
    ctx.strokeStyle = branchColor;

    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.lineWidth = this.stroke;
    ctx.stroke();
  }

  draw() {
    if (this.length < 20 && doDrawLeaves) {
      //leaf
      this.drawLeaf();
    } else {
      //branch
      this.drawBranch();
    }

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
