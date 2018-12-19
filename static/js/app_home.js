
function buildMetadata() {
    var dataURL = "/countries";
    var panelBody = d3.select("#search");
    panelBody.html("");


    d3.json(dataURL).then(function(countryData) {
        Object.entries(countryData).forEach(([key,value]) => {
            panelBody.append("h3").text(`${key}: ${value}`);
        })
    })
}

function buildCharts() {
  d3.json(`/happycountry/<COUNTRY_Happy>`).then(function(response) {
    var trace1 =response;
    var pieLayout = {
        showlegend: true,
        title: "Happiness chart by Country",
        legend: {
            x: 1,
            y: 0.5
        }
    };
    Plotly.newPlot("pie", trace1, pieLayout);
    });
};
  
function init() {
    // Grab a reference to the dropdowapn select element
    var selector = d3.select("#selCountryindex");
    
    // Use the list of sample names to populate the select options
    d3.json("/countries").then((sampleNames) => {
        sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
      console.log(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    console.log(newSample);
  }
  
  // Initialize the dashboard
  init();