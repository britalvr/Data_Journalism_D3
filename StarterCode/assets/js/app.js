// @TODO: YOUR CODE HERE!





// Setting the chart size
var svgWidth = 950;
var svgHeight = 650;




// Setting the chart margins
var margin = {
    top: 30,
    right: 50,
    bottom: 70,
    left: 60
};




var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;



// Wrapper, append group, and shift by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
// var chart = chart.append("svg")
//     .append("div")
//     .classed("chart", true);



// Import the data and cast as numbers. Create scale functions
d3.csv("./assets/data/data.csv").then(function(bureau_data) {
    

    bureau_data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.heathcare = +d.healthcare;
    });


    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(bureau_data, d => d.poverty) - 1,
                d3.max(bureau_data, d => d.poverty) + 1])
        .range([0, width]);
        // .nice()

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(bureau_data, d => d.heathcare) + 1])
        //.domain([d3.min(bureau_data, d => d.healthcare) - 1])
        .range([height, 0]);
        // .nice()





    // Create the axis functions and append the axes to the chart
    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);





    // Append circles for chart
    var circlesGroup = chartGroup.selectAll("circle")
      .data(bureau_data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .classed("stateCircle", true)
      .style("stroke-width", ".2")
      .attr("r", 14);
    




    // Add state text to the circles
    var textGroup = chartGroup.selectAll(".stateText")
        .data(bureau_data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .style("fill", "white")
        // .style("font-weight", "bold"
        .text(function(d){return d.abbr})
        .classed("stateText", true);







    // Adding the axes labels
    var poverty_text = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .classed("aText", true)
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text(" In Poverty (%)");
    
        
    var healthcare_text = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .classed("aText", true)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Lacks Healthcare (%)");   
      




    // Adding the tool tips
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, -50])
        .html(function (d) { 
            return `State: ${d.state} <br> Poverty: ${d.poverty}% <br> Lacks Healthcare: ${d.healthcare}%`});

    circlesGroup.call(toolTip);




    //Adding the events
    circlesGroup.on("mouseover", toolTip.show).on("mouseout", toolTip.hide);
});




