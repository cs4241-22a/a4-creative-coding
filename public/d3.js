const countryURLs = [
    "http://api.worldbank.org/v2/countries/USA/indicators/SP.POP.TOTL?per_page=5000&format=json",
    "http://api.worldbank.org/v2/countries/IND/indicators/SP.POP.TOTL?per_page=5000&format=json",
    "http://api.worldbank.org/v2/countries/CHN/indicators/SP.POP.TOTL?per_page=5000&format=json"
]

let baseColor = '#ff0055';
let baseLineColor = '#007dff'

const PARAMS = {
    chartColor: '#ff0055',
    showLine: false,
    lineColor: "#007dff"
};

let margin = {top: 20, right: 20, bottom: 80, left: 100},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

let xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);


window.addEventListener('load', () => {
    createPane()
    getChart(countryURLs[0])
})

function createPane() {
    const pane = new Tweakpane.Pane();

    const chartColorInput = pane.addInput(PARAMS, 'chartColor');
    chartColorInput.on('change', function (e) {
        countrySvg.selectAll(".bar")
            .style("fill", e.value)
        baseColor = e.value
    })

    const lineInput = pane.addInput(PARAMS, 'showLine', {
        label: "Show line?",
    });
    lineInput.on('change', function (e) {
        let opacity = e.value ? 4 : 0;
        console.log(opacity)
        countrySvg.selectAll("#blueLine")
            .style("stroke-width", opacity)
    })

    const lineColorInput = pane.addInput(PARAMS, 'lineColor');
    lineColorInput.on('change', function (e) {
        countrySvg.selectAll("#blueLine")
            .style("stroke", e.value)
        baseLineColor = e.value
    })


    const countryInput = pane.addBlade({
        view: 'list',
        label: 'country',
        options: [
            {text: 'USA', value: countryURLs[0]},
            {text: 'India', value: countryURLs[1]},
            {text: 'China', value: countryURLs[2]},
        ],
        value: 'USA',
    });

    countryInput.on('change', function (e) {
        getChart(e.value)
        lineInput.value = false
    })
}

function createScales(data) {
    xScale.domain(data.map(function (d) {
        return d.date;
    }));
    yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

}

let countrySvg = d3.select("#countryChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function getChart(countryURL) {
    countrySvg.selectAll('*').remove();
    console.log(countryURL)
    fetch(countryURL)
        .then(data => data.json())
        .then(jsonData => {
            let data = jsonData[1]
            createScales(data)
            console.log(data.length)
            let countryTitle = document.getElementById("countryTitle");
            countryTitle.innerHTML = data[0].country.value
            for (let i = 0; i < data.length; i++) {
                data[i].date = parseInt(data[i].date);
                data[i].value = parseInt(data[i].value);
                console.log("year = " + data[i].date + " value = " + data[i].value);

            }

            countrySvg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return xScale(d.date);
                })
                .attr("y", function (d) {
                    return yScale(d.value);
                })
                .attr("width", xScale.bandwidth())
                .attr("height", function (d) {
                    return height - yScale(d.value);
                })
                .style("fill", baseColor)
                .on('mouseover', function (d) {
                    d3.select(this).style("fill", "black");
                    let div = document.getElementById("textBox");
                    div.innerHTML += d.country.value + "<br>";
                    div.innerHTML += "Population in " + d.date + " was : " + d.value.toLocaleString() + "<br>"
                })
                .on('mouseout', function () {
                    d3.select(this).style("fill", baseColor);
                    let div = document.getElementById("textBox");
                    div.innerHTML = "";
                })


            let x = d3.scaleBand()
                .padding(0.2)
                .range([0, width]);

            let y = d3.scaleLinear()
                .range([height, 0]);

            let xAxis = d3.axisBottom()
                .scale(x);

            let yAxis = d3.axisLeft()
                .scale(y)
                .ticks(15);

            x.domain(data.map(function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);

            countrySvg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function() {
                    return "rotate(-65)"
                });

            countrySvg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Year");

            countrySvg.append("path")
                .attr("id", "blueLine")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", baseLineColor)
                .attr("stroke-width", 0)
                .attr("d", d3.line()
                    .x(function(d) { return x(d.date) })
                    .y(function(d) { return y(d.value) })
                )

        })

}