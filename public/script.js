// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// window.addEventListener("load", () => {
const radius = 40,
  y = 50;
let color = 0;
let radius_val = 40;
let backgrnd_color = "#000000";
let gdp_bool = false;

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", 1000);

document.body.appendChild(svg);

const pane = new Tweakpane.Pane();

const PARAMS = {
  key: "#ff0055ff",
  RGB: 0,
  radius: 50,
  GPB: true,
};

//color picker for background
pane
  .addInput(PARAMS, "key", {
    picker: "inline",
    expanded: true,
  })
  .on("change", (val) => {
    backgrnd_color = val.value;
    console.log(backgrnd_color);
    d3.select("body").style("background-color", backgrnd_color);
  });

//RGB selector for circles
pane
  .addInput(PARAMS, "RGB", {
    options: {
      Red: 0,
      Green: 1,
      Blue: 2,
    },
  })
  .on("change", (val) => {
    color = val.value;
    console.log(color);
    if (color == 0) {
      d3.selectAll("circle").attr(
        "fill",
        (d) => `rgba( ${Math.floor(d.value)}, 100, 100, .5 )`
      );
    } else if (color == 1) {
      d3.selectAll("circle").attr(
        "fill",
        (d) => `rgba( 100, ${Math.floor(d.value)}, 100, .5 )`
      );
    } else {
      d3.selectAll("circle").attr(
        "fill",
        (d) => `rgba( 100, 100, ${Math.floor(d.value)}, .5 )`
      );
    }
  });

//Radius for circle
pane
  .addInput(PARAMS, "radius", {
    step: 10,
    min: 10,
    max: 100,
  })
  .on("change", (val) => {
    radius_val = val.value;
    d3.selectAll("circle").attr("r", radius_val);
    console.log(radius_val);
  });

fetch("https://api.exchangerate-api.com/v4/latest/GBP")
  .then((data) => data.json())
  .then((jsonData) => {
    //console.log( d3.select('body').selectAll('div') )

    const group = d3
      .select("svg")
      .selectAll("circle")
      .data(d3.entries(jsonData.rates))
      .join("g");

    pane.addInput(PARAMS, "GPB").on("change", (val) => {
      gdp_bool = val.value;
      console.log(gdp_bool);
      if(gdp_bool == true){
        d3.selectAll("text").text((d) => d.value)
      }
      else{
         d3.selectAll("text").text((d) => d.key)
      }
      
    });

    group
      .append("circle")
      .attr("fill", (d) => `rgba( ${Math.floor(d.value)}, 100, 100, .5 )`)
      .attr("cx", (d, i) => i * radius)
      .attr("cy", y)
      .attr("r", radius);

    group
      .append("text")
      .text((d) => d.key)
      .attr("fill", "white")
      .attr("x", (d, i) => i * radius - radius / 2)
      .attr("y", y + radius + 25);
  });
// });

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
