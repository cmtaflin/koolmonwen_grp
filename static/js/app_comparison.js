function init() {
    var rightdata = [{
      values: [19, 26, 55, 88],
      labels: ["Spotify", "Soundcloud", "Pandora", "Itunes"],
      type: "pie"
    }];
  
    var rightlayout = {
      title: "Country 1",
      width: 600,
      height: 300,
    };
  
    Plotly.plot("#compRightPie", rightdata, rightlayout);

    var leftdata = [{
        values: [19, 26, 55, 88],
        labels: ["Spotify", "Soundcloud", "Pandora", "Itunes"],
        type: "pie"
      }];
    
      var leftlayout = {
        title: "Country 2",
        width: 600,
        height: 300,
      };
    
      Plotly.plot("#compLeftPie", leftdata, leftlayout);
  

}



  
init();