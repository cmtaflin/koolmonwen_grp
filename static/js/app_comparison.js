
function rightPieChart (){
  d3.json("/comparison/compRightPie").then(function(response) {
    console.log(response)
    
    var rightPieTrace= response;
   
    var rightlayout = {
      showlegend:false,
      title: "Country 1",
    };
  
    Plotly.newPlot("compRightPie", rightPieTrace, rightlayout);
  });  
};
  
// Function 2:Create a pie chart on the left side of the screen, user's right side - Shows percentage break down of country's happiness
function leftPieChart(){
  d3.json('/comparison/compLeftPie').then(function(response){
    console.log(response)

    var leftPieTrace= response;

    var leftlayout = {
      title: "Country 2",
      showlegend:false
    };
    
    Plotly.newPlot("compLeftPie", leftPieTrace, leftlayout);
  });  
};

function init() {
  // Grab a reference to the dropdown select element
  var rightSelector = d3.select("#selCountryRight");
    
  // Use the list of sample names to populate the select options                                                                                                                                                             
  d3.json("/countries").then((rightCountryNames) => {
    rightCountryNames.forEach((rightCountry) => {
      rightSelector
        .append("option")
        .text(rightCountry)
        .property("value", rightCountry);
    });

  // Use the first sample from the list to build the initial plots
    const firstSample = rightCountryNames[2];
    rightPieChart(firstSample);
    leftPieChart(firstSample);
    console.log(firstSample);
  });
   
  // Grab a reference to the dropdown select element
  var leftSelector = d3.select("#selCountryLeft");
    
  // Use the list of sample names to populate the select options
  d3.json("/countries").then((leftCountryNames) => {
    leftCountryNames.forEach((leftCountry) => {
       leftSelector
         .append("option")
         .text(leftCountry)
         .property("value", leftCountry);
    });
  
    // Use the first sample from the list to build the initial plots
    const firstSample = leftCountryNames[0];
    rightPieChart(firstSample);
    leftPieChart(firstSample);
    console.log(firstSample);
  });      
}

function optionchanged(selectedcountry){
  rightPieChart(selectedcountry),
  leftPieChart(selectedcountry)
}

// Initialize the dashboard
init();