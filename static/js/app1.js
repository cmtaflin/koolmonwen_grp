/* data route */
var socialUrl = "/socialprogress";

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

var svg = d3.select("#bubble")
    .append("svg")
    .attr("class", "chart")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.json(`/socialprogress`).then(function(socialData) {
  console.log(socialData);

  socialData.forEach(function(data) {
    data.BNeeds = +data.BNeeds;
    data.FWellB = +data.FWellB;
    data.SPI = +data.SPI;
  });

  var xLinearScale = d3.scaleLinear()
  .domain(d3.extent(socialData, d => d.BNeeds))
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain(d3.extent(socialData, d => d.SPI))
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
      .data(socialData)
      .enter()
      .append("circle")
      .attr("cx", d=> xLinearScale(d.BNeeds))
      .attr("cy", d => yLinearScale(d.SPI))
      .attr("r", "12")
      .attr("fill", "#9ECAE1FF")
      .attr("opacity", ".9");


      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
          return (`${d.Country}<br>BNeeds: ${d.BNeeds}%<br>SPI: ${d.SPI}%`);
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