
console.log("in client script")

    let tempPop = 180671000

    d3.json('../uspopulation.json').then((data)=> { console.log(data)
    console.log("in json data")
    var canvasTest = d3.select("body").append("svg")
        .attr("width", 750)
        .attr("height", 3050)
        .attr("id", "svgBars")
        //.call(zoom)
        console.log("before rect")

    canvasTest.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", function(d) { return 749*(d.value / 331893745);})
        .attr("height", 50)
        .attr("y", function(d, i) { return i*50;})
        .attr("fill", "blue")
        console.log("before text")

    canvasTest.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("fill", "white")
        .attr("y", function(d, i) {return i * 50;})
        .text(function(d) {return d.date + ": " + d.value;})
        console.log("after text")


    let growthContainer = d3.select("#continuous").append("svg")
    .attr("width", 500)
    .attr("height", 500)


    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, 500 ]);
    growthContainer.append("g")
      .attr("transform", "translate(0," + 500 + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ 500, 0 ]);
    growthContainer.append("g")
      .call(d3.axisLeft(y))


    growthContainer.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.value) })
    )
    .attr("text", "US Population 1960-2021")

    })

console.log("end of script")


let growthData = {x: [1960, 1970, 1980, 1990, 2000, 2010, 2020], y: [2200600, 2000300, 1959400, 2941700, 2460911.8, 1900281, 1369892]}

let rearrangedData = growthData.x.map(function(d,i) {
    return {x:d, y:growthData.y[i]}
})
console.log(rearrangedData)
const rdSaver = rearrangedData

var x = d3.scaleLinear().domain([1960,2030]).range([0,500])
var y = d3.scaleLinear().domain([1000000,3000000]).range([500,0])

var lineG = d3.line()
             .x(function(d){ return x(d.x)})
             .y(function(d){return y(d.y)})
             .curve(d3.curveMonotoneX);

var growthSvg = d3.select("#growthDiv")
            .append("svg")
            .attr("width", 500)
            .attr("height", 500)

var path = growthSvg.append("path")
            .datum(rearrangedData)
            .attr("d", lineG)
            .attr("fill", "none")
            .attr("stroke", "black")  

growthSvg.append("g")
    .attr("transform", "translate(0,"+500+ ")")
    .attr("class", "x axis")
    .call(d3.axisBottom(x))

growthSvg.selectAll(".dot")
    .data(growthData)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5);



am5.ready(function() {

    var allData = {
        "0": {
          "1960s": 180671000,
          "1970s": 205052000,
          "1980s": 227225000,
          "1990s": 249623000,
          "2000s": 282162411,
          "2010s": 309327143,
          "2020s": 331501080
        },
        "1": {
            "1960s": 183691000,
            "1970s": 207661000,
            "1980s": 229466000,
            "1990s": 252981000,
            "2000s": 284968955,
            "2010s": 311583481,
            "2020s": 331893745
          },
        "2": {
            "1960s": 186538000,
            "1970s": 209896000,
            "1980s": 231664000,
            "1990s": 256514000,
            "2000s": 287625193,
            "2010s": 313877662,
            "2020s": 333390000
          },
        "3": {
            "1960s": 189242000,
            "1970s": 211909000,
            "1980s": 233792000,
            "1990s": 259919000,
            "2000s": 290107933,
            "2010s": 316059947,
            "2020s": 334910000
          },
        "4": {
            "1960s": 191889000,
            "1970s": 213854000,
            "1980s": 235825000,
            "1990s": 263126000,
            "2000s": 292805298,
            "2010s": 318386329,
            "2020s": 336570000
          },
        "5": {
            "1960s": 194303000,
            "1970s": 215973000,
            "1980s": 237924000,
            "1990s": 266278000,
            "2000s": 295516599,
            "2010s": 320738994,
            "2020s": 338270000
          },
        "6": {
            "1960s": 196560000,
            "1970s": 218035000,
            "1980s": 240133000,
            "1990s": 269394000,
            "2000s": 298379912,
            "2010s": 323071755,
            "2020s": 339970000
          },
        "7": {
            "1960s": 198712000,
            "1970s": 220239000,
            "1980s": 242289000,
            "1990s": 272657000,
            "2000s": 301231207,
            "2010s": 325122128,
            "2020s": 341690000
          },
        "8": {
            "1960s": 200706000,
            "1970s": 222585000,
            "1980s": 244499000,
            "1990s": 275854000,
            "2000s": 304093966,
            "2010s": 326838199,
            "2020s": 343430000
          },
        "9": {
            "1960s": 202677000,
            "1970s": 225055000,
            "1980s": 246819000,
            "1990s": 279040000,
            "2000s": 306771529,
            "2010s": 328329953,
            "2020s": 345200000
          }
      };



var root = am5.Root.new("chartdiv");

root.numberFormatter.setAll({
  numberFormat: "#a",

  bigNumberPrefixes: [
    { number: 1e6, suffix: "M" },
    { number: 1e9, suffix: "B" }
  ],
  smallNumberPrefixes: []
});

var stepDuration = 2000;

root.setThemes([am5themes_Animated.new(root)]);

var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelX: "none",
  wheelY: "none"
}));

chart.zoomOutButton.set("forceHidden", true);

var yRenderer = am5xy.AxisRendererY.new(root, {
  minGridDistance: 20,
  inversed: true
});
yRenderer.grid.template.set("visible", false);

var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0,
  categoryField: "network",
  renderer: yRenderer
}));

var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0,
  min: 0,
  strictMinMax: true,
  extraMax: 0.1,
  renderer: am5xy.AxisRendererX.new(root, {})
}));

xAxis.set("interpolationDuration", stepDuration / 10);
xAxis.set("interpolationEasing", am5.ease.linear);

var series = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueXField: "value",
  categoryYField: "network"
}));

series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });
series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});
series.columns.template.adapters.add("stroke", function (stroke, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.bullets.push(function () {
  return am5.Bullet.new(root, {
    locationX: 1,
    sprite: am5.Label.new(root, {
      text: "{valueXWorking.formatNumber('#.# a')}",
      fill: root.interfaceColors.get("alternativeText"),
      centerX: am5.p100,
      centerY: am5.p50,
      populateText: true
    })
  });
});

var label = chart.plotContainer.children.push(am5.Label.new(root, {
  text: "decade start",
  fontSize: "8em",
  opacity: 0.2,
  x: am5.p100,
  y: am5.p100,
  centerY: am5.p100,
  centerX: am5.p100
}));

function getSeriesItem(category) {
  for (var i = 0; i < series.dataItems.length; i++) {
    var dataItem = series.dataItems[i];
    if (dataItem.get("categoryY") == category) {
      return dataItem;
    }
  }
}

function sortCategoryAxis() {
  series.dataItems.sort(function (x, y) {
    return y.get("valueX") - x.get("valueX"); // descending
  });

  am5.array.each(yAxis.dataItems, function (dataItem) {
    var seriesDataItem = getSeriesItem(dataItem.get("category"));
    if (seriesDataItem) {
      var index = series.dataItems.indexOf(seriesDataItem);
      var deltaPosition =
        (index - dataItem.get("index", 0)) / series.dataItems.length;
      if (dataItem.get("index") != index) {
        dataItem.set("index", index);
        dataItem.set("deltaPosition", -deltaPosition);
        dataItem.animate({
          key: "deltaPosition",
          to: 0,
          duration: stepDuration / 2,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }
    }
  });
  yAxis.dataItems.sort(function (x, y) {
    return x.get("index") - y.get("index");
  });
}

let startYear = 0
let endYear = 9


const PARAMS = {
    step: 2000,
    start: 0,
    color: 'ff0055',
    end: 9
}

const pane = new Tweakpane.Pane()

const stIn = pane.addInput(PARAMS, 'step')
const sIn = pane.addInput(PARAMS, 'start')
const cIn = pane.addInput(PARAMS, 'color')
const eIn = pane.addInput(PARAMS, 'end')

stIn.on('change', function(ev) {
    stepDuration = ev.value
})

cIn.on('change', function(ev) {
    d3.select('svgBars').selectAll("rect").attr("fill", '#'+ev.value)
})

sIn.on('change', function(ev) {
    startYear = ev.value
})

eIn.on('change', function(ev) {
    endYear = ev.value
})


var year = startYear;

var interval = setInterval(function () {
  year++;

  if (year > endYear) {
    clearInterval(interval);
    clearInterval(sortInterval);
  }

  updateData();
}, stepDuration);

var sortInterval = setInterval(function () {
  sortCategoryAxis();
}, 100);

function setInitialData() {
  var d = allData[year];

  for (var n in d) {
    series.data.push({ network: n, value: d[n] });
    yAxis.data.push({ network: n });
  }
}

function updateData() {
  var itemsWithNonZero = 0;

  if (allData[year]) {
    label.set("text", year.toString());

    am5.array.each(series.dataItems, function (dataItem) {
      var category = dataItem.get("categoryY");
      var value = allData[year][category];

      if (value > 0) {
        itemsWithNonZero++;
      }

      dataItem.animate({
        key: "valueX",
        to: value,
        duration: stepDuration,
        easing: am5.ease.linear
      });
      dataItem.animate({
        key: "valueXWorking",
        to: value,
        duration: stepDuration,
        easing: am5.ease.linear
      });
    });

    yAxis.zoom(0, itemsWithNonZero / yAxis.dataItems.length);
  }
}
setInitialData();
setTimeout(function () {
  year++;
  updateData();
}, 50);

series.appear(1000);
chart.appear(1000, 100);
}); 
