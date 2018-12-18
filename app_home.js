

function buildCharts(countries) {
    d3.json(`/countries/${COUNTRY_Happy}`).then(function(response) {
        console.log(response);
        var trace1 =[{
            values: response.FAMILY.slice(0,10),
            labels: response.COUNTRY_Happy.slice(0,10),
            type: "pie"
        }];
        var pieLayout = {
            showlegend: true,
            title: "Happiness chart by Country"
        };
        Plotly.newPlot("#pie", trace1, pieLayout);
    })
}
  
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selCountry");
  
    // Use the list of sample names to populate the select options
    d3.json("/countries").then((countryNames) => {
      countryNames.forEach((happycountry) => {
        selector
          .append("option")
          .text(happycountry)
          .property("value", happycountry);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstCountry = countryNames[0];
      buildCharts(firstCountry);
      buildMetadata(firstCountry);
      console.log(firstCountry);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
  }
  
  // Initialize the dashboard
  init();