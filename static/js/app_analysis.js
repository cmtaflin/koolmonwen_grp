
var socialUrl = "/socialhappy";

var svgWidth = 900;
var svgHeight = 500;


var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("class", "chart")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial parameters
var chosenXAxis = "SPI";
var chosenYAxis = "HAPPINESS_SCORE";

//insert the functions needed to give variable scales on axis click

//updating x-scale variable upon click on axis label
function xScale(socialData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(socialData, d => d[chosenXAxis]) * 0.8,
      d3.max(socialData, d => d[chosenXAxis]) *1.2])
    .range([0,width]);

  return xLinearScale;
}

// updating y-scale variable upon click on axis label
function yScale(socialData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(socialData, d => d[chosenYAxis]) * 0.8,
      d3.max(socialData, d => d[chosenYAxis]) *1.2])
    .range([height,0]);

  return yLinearScale;
}


function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//function to give variable scales on y axis click
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function for updating circles group with a transition 
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
  .duration(1000)
  .attr("cx", d => newXScale(d[chosenXAxis]))
  .attr("cy", d => newYScale(d[chosenYAxis]));

return circlesGroup;
}

// function to update tooltip with new circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //which x-axis is changed...
  switch (chosenXAxis) {
    case "SPI":
      xlabel = "Social Progress Index";
      break;
    case "Free_Cho":
      xlabel = "Personal Freedom and Choice";
      break;
    case "Health":
      xlabel = "Health and Wellness";
  }

  //which y-axis is changed...
  switch (chosenYAxis) {
    case "HAPPINESS_SCORE":
      ylabel = "Happiness Score";
      break;
    case "FREEDOM":
      ylabel = "Freedom";
      break;
    case "HEALTH_LIFE_EXPECTANCY":
      ylabel = "Life Expectancy";
  }

  //initialize tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -50])
    .html(function(d) {
      return (`${d.Country}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`)
    });

    //tooltip goes into chart
    circlesGroup.call(toolTip);


    //now for mouseovers...
    circlesGroup.on("mouseover", function(tipData) {
      toolTip.show(tipData);
    })

      .on("mouseout", function(tipData, index) {
        toolTip.hide(tipData);
      });

      return circlesGroup;
    }

//now to finally read the data...

d3.json("/socialhappy", function(socialData) {
  console.log(socialData);

  socialData.forEach(function(data) {
    data.HAPPINESS_SCORE = +data.HAPPINESS_SCORE;
    data.FREEDOM = +data.FREEDOM;
    data.HEALTH_LIFE_EXPECTANCY = +data.HEALTH_LIFE_EXPECTANCY;
    data.Free_Cho = +data.Free_Cho;
    data.SPI = +data.SPI;
    data.Health = +data.Health;
  })

  //x scale above api call
  var xLinearScale = xScale(socialData, chosenXAxis);

  //y scale above api call
  var yLinearScale = yScale(socialData, chosenYAxis);

  //create axes
  var bottomAxis = d3.axisBottom().scale(xLinearScale);
  var leftAxis = d3.axisLeft().scale(yLinearScale);

  // add axes to chart group
  var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

  var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

// go through each cx and cy and find if either is NULL. if so, do not draw. put within createcircles (cx & cy)

      //create initial circles
      var circlesGroup = chartGroup.selectAll("circle")
      .data(socialData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis])) 
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "9")
      .attr("fill", "#350431")
      .attr("stroke", "grey")
      .attr("opacity", ".7");

      circlesGroup.filter(function(d) { 
        return d[chosenXAxis] == 0; 
        })
        .remove()

        circlesGroup.filter(function(d) { 
          return d[chosenYAxis] == 0; 
          })
          .remove()


      // create group for 3 x-axis labels
      var labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

      var SPILabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "SPI") // value to grab for event listener
        .classed("active", true)
        .classed("x-text", true)
        .text("Social Progress Index (SPI)");

      var FreeChoiceLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "Free_Cho") // value to grab for event listener
        .classed("inactive", true)
        .classed("x-text", true)
        .text("Free Choice Score");

      var HealthLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "Health") // value to grab for event listener
        .classed("inactive", true)
        .classed("x-text", true)
        .text("Health Score");
      

      // create group for the 3 y-axis labels
      var labelsYGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

      var HappyLabel = labelsYGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "HAPPINESS_SCORE") // value to grab for event listener
        .classed("active", true)
        .classed("y-text", true)
        .text("Happiness Rating");

      var FreedomLabel = labelsYGroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "FREEDOM") // value to grab for event listener
        .classed("inactive", true)
        .classed("y-text", true)
        .text("Freedom Rating");

      var LifeLabel = labelsYGroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "HEALTH_LIFE_EXPECTANCY") // value to grab for event listener
        .classed("inactive", true)
        .classed("y-text", true)
        .text("Life Expectancy Rating");
      

      var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


      // now comes the fun part - even listeners - first X and then Y
    labelsXGroup.selectAll(".x-text")
      .on("click", function() {
      // get value of selection
      var xValue = d3.select(this).attr("value");
      if (xValue != chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xValue;

        console.log(chosenXAxis)

        // functions here found above api import
        // updates x scale for new data
        xLinearScale = xScale(socialData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);


        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "SPI") {
          SPILabel
            .classed("active", true)
            .classed("inactive", false);
          FreeChoiceLabel
            .classed("active", false)
            .classed("inactive", true);
          HealthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "Free_Cho") {
          SPILabel
            .classed("active", false)
            .classed("inactive", true);
          FreeChoiceLabel
            .classed("active", true)
            .classed("inactive", false);
          HealthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          SPILabel
            .classed("active", false)
            .classed("inactive", true);
          FreeChoiceLabel
            .classed("active", false)
            .classed("inactive", true);
          HealthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


    // now the Y axis listening...
    labelsYGroup.selectAll(".y-text")
      .on("click", function() {
      // get value of selection
      var yValue = d3.select(this).attr("value");
      if (yValue != chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = yValue;

        console.log(chosenYAxis)

        // functions here found above api import
        // updates y scale for new data
        yLinearScale = yScale(socialData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "HAPPINESS_SCORE") {
          HappyLabel
            .classed("active", true)
            .classed("inactive", false);
          FreedomLabel
            .classed("active", false)
            .classed("inactive", true);
          LifeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "FREEDOM") {
          HappyLabel
            .classed("active", false)
            .classed("inactive", true);
          FreedomLabel
            .classed("active", true)
            .classed("inactive", false);
          LifeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          HappyLabel
            .classed("active", false)
            .classed("inactive", true);
          FreedomLabel
            .classed("active", false)
            .classed("inactive", true);
          LifeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
  
  


});
