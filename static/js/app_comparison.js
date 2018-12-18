function init() {
// javaScript File creates 2 pie charts for the comparison tab leveraging two input forms for the user to select two different countries and compare.

// Function 1: Create a pie chart on the right side of the screen, user's left side - Shows percentage break down of country's happiness
  // function rightPieChart (){
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
    
  Plotly.plot("compRightPie", rightdata, rightlayout);
  // };

  // Function 2:Create a pie chart on the left side of the screen, user's right side - Shows percentage break down of country's happiness
  // function leftPieChart(){
  // d3.json('/comparison/compLeftPie').then(function(response){
  //   console.log(response)
  // });  

  // var leftPieTrace={
  //   labels: response.labels,
  //   values: response.values,
  //   type: "pie"
  // };
      
  // var leftlayout = {
  //   title: "Country 2",
  //   width: 600,
  //   height: 300
  // };
      
  // Plotly.newPlot("compLeftPie", leftPieTrace, leftlayout);
  // }; 

};
// function init() {

  
  // function rightPieChart
  // function leftPieChart
    
// };  

function optionchanged(selectedmonth){
  rightPieChart(selectedmonth),
  leftPieChart(selectedmonth)
};

// Initialize the dashboard
init();


//   {
    //     "labels": [
    //       "ECONOMY_GDP_PER_CAPITA", 
    //       "FAMILY", 
    //       "HEALTH_LIFE_EXPECTANCY", 
    //       "FREEDOM", 
    //       "GENEROSITY", 
    //       "TRUST_GOVERNMENT_CORRUPTION"
    //     ],  
    //     "values": [
    //       1.44163, 
    //       1.4964600000000001, 
    //       0.8053359999999999, 
    //       0.5081899999999999, 
    //       0.492774, 
    //       0.265428
    //     ],
    //     "type": "pie"
    //   }
    // ] 
    