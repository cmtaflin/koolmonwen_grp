// from data.js
var tableData = data;

// select table body
var tbody = d3.select("#tableBody");

//create the table the first time...
tableData.forEach((tableData) => {

  //append one row per entry in data.js
  var row = tbody.append("tr");

  //append one cell per item in data.js
  Object.entries(tableData).forEach(([key,value]) => {
    var cell = row.append("td");
    cell.text(value);
  })
});

//function for entire data entry process
function handleSubmit() {

  //prevent page from refreshing
  d3.event.preventDefault();

  //Select the input value from the datetime window
  var dataTable = d3.select("#datetime").node().value;
  console.log(dataTable);

  //Show the output array to verify it worked
  var filteredData = tableData.filter(ufo => ufo.datetime === dataTable);
  console.log(filteredData);

  //first we need to clear out the previous entry of the table
  document.getElementById("tableBody").innerHTML = "";

  // now run the table creation loop...
  filteredData.forEach((dataTable) => {

    //append one row per entry in data.js
    var row = tbody.append("tr");

    //append one cell per item in data.js
    Object.entries(dataTable).forEach(([key,value]) => {
      var cell = row.append("td");
      cell.text(value);
    })
})
};

 // listen for the button click
 d3.select("#filter-btn").on("click", handleSubmit);