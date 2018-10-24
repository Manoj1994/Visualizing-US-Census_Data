var wi = 700;
var hei = 500;
var marginValues = {top: 40, right: 10, bottom: 20, left: 30};

var dateFormat = d3.time.format("%Y");

var xScaleLine = d3.time.scale().range([ marginValues.left + 120, wi - marginValues.right - marginValues.left - 50]);

var yScaleLine = d3.scale.linear().range([ marginValues.top , hei - marginValues.bottom - 30] );

var xAxisLine = d3.svg.axis()
                    .scale(xScaleLine)
                  .orient("bottom")
                  .ticks(7)
                  .tickFormat(function(d) {
                    return dateFormat(d);
                  });

var yAxisLine = d3.svg.axis()
                  .scale(yScaleLine)
                  .orient("left");

var secondchart = d3.select("#chart")
          .append("svg")
          .attr("width", wi)
          .attr("height", hei);

var line = d3.svg.line()
    .x(function(d) { return xScaleLine(dateFormat.parse(d.year));
    })
    .y(function(d) { return yScaleLine(d.population); 
    });

d3.csv("Population_for_US_States_2010-2017.csv", function(data) {

  datsetLine = [];
  metrics = d3.nest()
  .key(function(d) { return d.Year; })
  .rollup(function(v) { return {
  avg: Math.ceil(d3.mean(v, function(d) { return d.Population/1000; }))
  }; })
  .entries(data);

  var populationArr1 = [];

  for (var i=0; i < metrics.length; i++) {
    populationArr1.push(metrics[i].values.avg)
    datsetLine[i] = { year : metrics[i].key, population : metrics[i].values.avg};
  }

  var years = [];
  for (var i=0; i < datsetLine.length; i++) {
    years.push(datsetLine[i].year);
  }

  var min = d3.min(populationArr1)
  var max = d3.max(populationArr1)


   xScaleLine.domain([
      d3.min(years, function(d) {
        return dateFormat.parse(d);
      }),
      d3.max(years, function(d) {
        return dateFormat.parse(d);
      })
    ]);

     yScaleLine.domain([max, min]);

     secondchart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(" + (0) + "," + (hei - marginValues.bottom - 30) + ")")
         .call(xAxisLine);

     secondchart.append("g")
     .attr("class", "y axis")
     .attr("transform", "translate(" + (marginValues.left + 120)  +  ",0)") // Moving the axis to fit in district names
     .call(yAxisLine)
      .attr("x", marginValues.left)
      .attr("y", marginValues.top)
      .style("font-size", "14");

      secondchart.append("text")
        .attr("x", marginValues.left + wi / 2  + 30)
        .attr("y", 5 + (marginValues.top/2))
        .style("text-anchor", "middle")
        .style("font-size", "16px") 
        .style("text-decoration", "underline") 
        .text("Population Growth of United States (in Thousands) from 2010-2017")
        .transition()
        .duration(1000);

      secondchart.append("path")
        .attr("class", "line")
        .attr("d", line(datsetLine));


           secondchart.append("text")
          .attr("x", marginValues.left + wi / 2  + 15)
          .attr("y",  hei - 25 + marginValues.bottom)
          .style("text-anchor", "middle")
          .text("Year");

          secondchart.append("text")
          .attr("y", 50 +  marginValues.left)
          .attr("x",  100 - (hei / 2))
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "end")
          .style("font-size", "16px")
          .text("Population (in thousands)");

   

});