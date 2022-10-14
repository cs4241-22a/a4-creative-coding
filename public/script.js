const bar = document.getElementById("bar");
const canvas = document.getElementById("board");

const ctx = canvas.getContext("2d");
console.log(ctx);

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

// this makes the whole canvas fit properly on the screen
canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let setX;
let setY;
let paint = false; //to check if we are currently painting or not
let ls = 5; // settign the line size to 5

const draw = (e) => {
  if (!paint) {
    return;
  }

  ctx.ls = ls;

  ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
  ctx.stroke();
};

bar.addEventListener("click", (e) => {
  if (e.target.id === "erase") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (e.target.id === "download") {
    console.log("here");
    var MySketch = canvas.toDataURL();

    // create temporary link
    var tempLink = document.createElement("a");
    tempLink.download = "MySketch.png";
    tempLink.href = MySketch;

    // temporarily add link to body and initiate the download
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
     console.log("here");
  }

  if (e.target.id === "randomCircle") {
    var x = Math.random() * window.innerHeight;
    var y = Math.random() * window.innerWidth;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2, false);
    ctx.strokeStyle = "blue";
    ctx.stroke();
  }

  // if (e.target.id === "randomRect") {
  //   var x = Math.random() * window.innerHeight;
  //   var y = Math.random() * window.innerWidth;
  //   ctx.fillRect(x*2, x/2, y-26, y*-3)
  //   ctx.strokeStyle = "green"
  //   ctx.stroke();
  // }
});

bar.addEventListener("change", (e) => {
  if (e.target.id === "colorme") {
    ctx.strokeStyle = e.target.value; // this sets th new color value ot the pencil
  }

  if (e.target.id === "thickness") {
    ls = e.target.value;
    ctx.lineWidth = ls;
    console.log(ls);
  }
});

canvas.addEventListener("mousedown", (e) => {
  paint = true;
  setX = e.clientX;
  setY = e.clientY;
});

canvas.addEventListener("mouseup", (e) => {
  paint = false;
  ctx.stroke(); // coloring our line again
  ctx.beginPath(); // to start path again
});

canvas.addEventListener("mousemove", draw);

// // client-side js, loaded by index.html
// // run by the browser each time the page is loaded

// console.log("hello world :o");

// // define variables that reference elements on our page
// const dreamsList = document.getElementById("dreams");
// const dreamsForm = document.querySelector("form");

// // a helper function that creates a list item for a given dream
// function appendNewDream(dream) {
//   const newListItem = document.createElement("li");
//   newListItem.innerText = dream;
//   dreamsList.appendChild(newListItem);
// }

// // fetch the initial list of dreams
// fetch("/dreams")
//   .then(response => response.json()) // parse the JSON from the server
//   .then(dreams => {
//     // remove the loading text
//     dreamsList.firstElementChild.remove();

//     // iterate through every dream and add it to our page
//     dreams.forEach(appendNewDream);

//     // listen for the form to be submitted and add a new dream when it is
//     dreamsForm.addEventListener("submit", event => {
//       // stop our form submission from refreshing the page
//       event.preventDefault();

//       // get dream value and add it to the list
//       let newDream = dreamsForm.elements.dream.value;
//       dreams.push(newDream);
//       appendNewDream(newDream);

//       // reset form
//       dreamsForm.reset();
//       dreamsForm.elements.dream.focus();
//     });
//   });
