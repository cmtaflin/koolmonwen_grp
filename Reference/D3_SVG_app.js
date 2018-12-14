// Will analyze poverty and obesity for the homework. field names:
// abbr: State abbreviation
// poverty: poverty%
// obesity: obesity%

// This section to set the SVG width/height/margins, etc.


var svgWidth = 1000;
var svgHeight = 660;


var margin = {
    top: 50,
    right: 50,
    bottom: 70,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// create SVG wrapper, append and group (div = "scatter")
var svg = d3.select("#scatter")
    .append("svg")
    .attr("class", "chart")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// retrieve data from csv file
d3.csv("../data/data.csv")
    .then(function(censusData) {


    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });


    //create scales. 0-max did not look good.
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => (d.obesity-2)))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(censusData, d => (d.poverty-2)))
        .range([height, 0]);

    //create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // add axes to chart group
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create scatterplot circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d=> xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "12")
        .attr("fill", "#9ECAE1FF")
        .attr("opacity", ".9");

    chartGroup.selectAll(".label")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("class", "stateText")
        .attr("x", d=> xLinearScale(d.obesity))
        .attr("y", d => yLinearScale(d.poverty));

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Poverty (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 6})`)
        .attr("class", "aText")
        .text("Obesity (%)");

    //create tooltip to match label as a test. This is part of the advanced version
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
    });

    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });


});

// set up mouseovers and tooltips