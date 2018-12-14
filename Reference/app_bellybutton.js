function buildMetadata(sample) {

  // variable URL path based on the sample chosen.
  var metadataURL = "/metadata/" + sample;

  var panelBody = d3.select("#sample-metadata");

  // clear out the body of the metadata panel so it doesn't just append
  panelBody.html("");

  // Add in the various components of the metadata based on the chosen sample
  d3.json(metadataURL).then(function(metaData) {
    Object.entries(metaData).forEach(([key,value]) => {
      panelBody.append("h5").text(`${key}: ${value}`);
    })
  })

}

function buildCharts(sample) {

  //grab the data from the sample selected
  d3.json(`/samples/${sample}`).then(function(response) {
    console.log(response);


    //create the bubble chart. Doing this first since I slice it later for the pie chart.
    var bubbleTrace = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: "markers",
      text: response.otu_labels,
      marker: {
        color: response.otu_ids,
        size: response.sample_values,
        colorscale: "Earth"
      }
    };

    var bubbleTrace = [bubbleTrace];
    var bubbleLayout = {
      showlegend: false
    };

    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);


    //Start the code for the pie chart..
    var trace1 = [{
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      hovertext: response.otu_labels.slice(0,10),
      type: "pie"      
    }];

    //layout for the pie chart.  Kept it basic on purpose...
    var pieLayout = {
      showlegend: true,
      title: "Belly Button Bacteria Results"
    };
    
    Plotly.newPlot("pie", trace1, pieLayout);

  })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

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
