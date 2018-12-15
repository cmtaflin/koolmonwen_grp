/* data route */
var url = "/data";

function buildPlot() {
  d3.json(url).then(function(response) {

    console.log(response);
    // var trace = {
    //   type: "pie",
    //   label:
    //   value: 
    //   }
    // };

    var data = [trace];

    var layout = {
      title: "What makes up Happiness",
      
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot("plot", data, layout);
  });
}

buildPlot();
