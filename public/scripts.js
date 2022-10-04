// Add some Javascript code here, to run on the front end.

//making the barchart
var margin = {top: 20, right: 20, bottom: 110, left: 60},
width = 500 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// Set ranges
var x = d3.scaleBand()
      .range([40, width])
      .padding(0.1);  

var y = d3.scaleBand().range([height, -height]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

//getting data
d3.csv("tempData.csv").then(function(data) {
    console.log(data);


    var barDataValue = [];
    for (let i = 0; i < data.length; i++) { 
        barDataValue[i] = data[i].value;
    }
    
    var yScale = d3.scaleLinear()
                 .domain([0, d3.max(barDataValue)])
                 .range([0, height]);

    var yAxisScale = d3.scaleLinear()
                     .domain([d3.min(barDataValue), d3.max(barDataValue)])
                     .range([height, 0]);

    
    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.year; }));
    y.domain([d3.min(data,function(d){return d.value}), d3.max(data, function(d) { return d.value; })]);

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", function(d) {
            return "hidden";
        })
        .style("background", "#808080")
        .style("stroke", "white")
        .style("stroke-width", "1px")
        .text("test");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("x", function(d,i) { return margin.left + i * x.bandwidth();})
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return height - Math.max(0, yScale(d.value)); })
        .attr("height", function(d) { return Math.abs(yScale(d.value)); })
        .style("fill", function(d){
            if(d.value < 0) {
                return "#4e79a7";
            } else {
                return "#e15759";
            };
        })
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .on("mouseover", function(d) { return tooltip.style("visibility", "visible");})
        .on("mousemove", function(d,i){ 
            tooltip.text("Year: " + i.year + " Value: " + i.value); 
            return tooltip.style("top", (d.clientY +400) +"px").style("left",(d.clientX + 10) +"px");
        })
        .on("mouseout", function(d){
            return tooltip.style("visibility", "hidden");
        });

     // Add x axis
    svg.append("g")
        .attr("transform", "translate(0," +(height) + ")");

    // Add y axis
    var yAxis = d3.axisLeft(yAxisScale);
    svg.append("g")
    .attr("transform", "translate(" + (margin.left) + ", 0)")
    .call(yAxis);

});
