
function countryData(countries) {
    var dataURL = "/countries";
    var panelBody = d3.select("#search");
    panelBody.html("");


    d3.json(dataURL).then(function(countryData) {
        Object.entries(countryData).forEach(([key,value]) => {
            panelBody.append("h3").text(`${key}: ${value}`);
        })
    })
}

function buildCharts(countries) {
    d3.json(`/countries/${countries}`).then(function(response) {
        var trace1 =[{
            values: response.country_values,
            labels: response.happiness_rank,
            type: "pie"
        }];
        var pieLayout = {
            showlegend: true,
            title: "Happiness chart by Country"
        };
        Plotly.newplot("pie", trace1, pieLayout);
    })
}
  
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selYear");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
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
  }
  
  // Initialize the dashboard
  init();