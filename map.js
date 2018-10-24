var w = 700;
var h = 500;
var marginLeft = 30;
var marginRight = 10;
var marginTop = 40;
var marginBottom = 20;

var mapSVG = d3.select("#map")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

var div = d3.select("#map")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);


var projection = d3.geo.albersUsa().translate([w/3+100, h/3+100]).scale([800]);
        
var path = d3.geo.path().projection(projection);
var statesMap = {};

var mapLegendText = ["70,000+", "[70 -60],000", "[60 - 40],000", "< 40,000"];

statesMap['01'] = 'Alabama';
statesMap['02'] = 'Alaska';
statesMap['04'] = 'Arizona';
statesMap['05'] = 'Arkansas';
statesMap['06'] = 'California';
statesMap['08'] = 'Colorado';
statesMap['09'] = 'Connecticut';
statesMap['10'] = 'Delaware';
statesMap['12'] = 'Florida';
statesMap['13'] = 'Georgia';
statesMap['15'] = 'Hawaii';
statesMap['16'] = 'Idaho';
statesMap['17'] = 'Illinois';
statesMap['18'] = 'Indiana';
statesMap['19'] = 'Iowa';
statesMap['20'] = 'Kansas';
statesMap['21'] = 'Kentucky';
statesMap['22'] = 'Louisiana';
statesMap['23'] = 'Maine';
statesMap['56'] = 'Wyoming';
statesMap['24'] = 'Maryland';
statesMap['25'] = 'Massachusetts';
statesMap['26'] = 'Michigan';
statesMap['27'] = 'Minnesota';
statesMap['28'] = 'Mississippi';
statesMap['29'] = 'Missouri';
statesMap['30'] = 'Montana';
statesMap['31'] = 'Nebraska';
statesMap['32'] = 'Nevada';
statesMap['33'] = 'New Hampshire';
statesMap['34'] = 'New Jersey';
statesMap['35'] = 'New Mexico';
statesMap['36'] = 'New York';
statesMap['37'] = 'North Carolina';
statesMap['38'] = 'North Dakota';
statesMap['39'] = 'Ohio';
statesMap['40'] = 'Oklahoma';
statesMap['41'] = 'Oregon';
statesMap['42'] = 'Pennsylvania';
statesMap['44'] = 'Rhode Island';
statesMap['45'] = 'South Carolina';
statesMap['46'] = 'South Dakota';
statesMap['47'] = 'Tennessee';
statesMap['48'] = 'Texas';
statesMap['49'] = 'Utah';
statesMap['50'] = 'Vermont';
statesMap['51'] = 'Virginia';
statesMap['53'] = 'Washington';
statesMap['54'] = 'West Virginia';
statesMap['55'] = 'Wisconsin';

var states = [
        ['01', 'Alabama'],['02', 'Alaska'],['04', 'Arizona'],['05', 'Arkansas'],['06', 'California'],
        ['08', 'Colorado'],['09', 'Connecticut'],['10', 'Delaware'],['12', 'Florida'],['13', 'Georgia'],
  		['15', 'Hawaii'],['16', 'Idaho'],['17', 'Illinois'],['18', 'Indiana'],['19', 'Iowa'],
  		['20', 'Kansas'],['21', 'Kentucky'],['22', 'Louisiana'],['23', 'Maine'],['56', 'Wyoming'],
        ['24', 'Maryland'],['25', 'Massachusetts'],['26', 'Michigan'],['27', 'Minnesota'],['28', 'Mississippi'],
        ['29', 'Missouri'],['30', 'Montana'],['31', 'Nebraska'],['32', 'Nevada'],['33', 'New Hampshire'],
        ['34', 'New Jersey'],['35', 'New Mexico'],['36', 'New York'],['37', 'North Carolina'],['38', 'North Dakota'],
        ['39', 'Ohio'],['40', 'Oklahoma'],['41', 'Oregon'],['42', 'Pennsylvania'],['44', 'Rhode Island'],
        ['45', 'South Carolina'],['46', 'South Dakota'],['47', 'Tennessee'],['48', 'Texas'],['49', 'Utah'],
        ['50', 'Vermont'],['51', 'Virginia'],['53', 'Washington'],['54', 'West Virginia'],['55', 'Wisconsin']
    ];

var low = '#F8E0E0'
var high = '#8A0808'

d3.csv("percapita.csv", function(data) {

	dataset = [];
	metricAggregated = d3.nest()
	.key(function(d) { return d.Area; })
	.rollup(function(v) { return {
	avg: Math.ceil(d3.mean(v, function(d) { return d.year_2017; }))
	}; })
	.entries(data);

	var populationArr = [];

	for (var i=0; i < metricAggregated.length; i++) {
		populationArr.push(metricAggregated[i].values.avg)
		dataset[i] = { state : metricAggregated[i].key, population : metricAggregated[i].values.avg};
	}

	var min = d3.min(populationArr)
	var max = d3.max(populationArr)
	var colorScaling = d3.scale.sqrt().domain([min,max]).range([low, high])
	var colorScaling1 = d3.scale.linear().domain([min, min+50000, min+70000, min+100000]).range(['#F6CECE', '#F5A9A9', '#F78181', '#FA5858'])

	d3.json("us-states.json", function(json) {
	    for (var i = 0; i < dataset.length; i++) {
	      var dataState = dataset[i].state;
	      var dataValue = dataset[i].population;
	      for (var j = 0; j < json.features.length; j++) {
	        var jsonState = json.features[j].properties.name;

	        if (dataState == jsonState) {
	          json.features[j].properties.value = dataValue;
	          break;
	        }
	      }
	    }

	    mapSVG.selectAll("path")
			      .data(json.features)
			      .enter()
			      .append("path")
			      .attr("d", path)
			      .style("stroke", "#fff")
			      .style("stroke-width", "1")
			      .style("fill", function(d) { return colorScaling(d.properties.value) })
			      .on("mouseover", function(d) {      
				    	div.transition()        
				      	   .duration(200)      
				           .style("opacity", .9);      
				           div.text(d.properties.name + " : " + d.properties.value)
				           .style("left", (d3.event.pageX) + "px")     
				           .style("top", (d3.event.pageY - 28) + "px");    
				   })
			      .on("mouseout", function(d) {       
				        div.transition()        
				           .duration(500)      
				           .style("opacity", 0);   
				    })
			      .on("click", funcWinner);

					mapSVG.append("text")
			        .attr("x", marginLeft + w / 2 - 20)
			        .attr("y", 5 + (marginTop/2))
			        .style("text-anchor", "middle")
			        .style("font-size", "16px") 
			        .style("text-decoration", "underline") 
			        .text("Per Capita Income of all states in United States of America")
			        .transition()
			        .duration(1000);

			        var mapLegend = d3.select("#map").append("svg")
	      			.attr("class", "legend")
	     			.attr("width", 140)
	    			.attr("height", 200)
	   				.selectAll("g")
	   				.data(colorScaling1.domain().slice().reverse())
	   				.enter()
	   				.append("g")
	     			.attr("transform", function(d, i) { return "translate(10," + i * 20 + ")"; })
	     			;

	     			var maptext = mapLegend.append("text")
			  		  .data(mapLegendText)
			  
			      	  .attr("x", 24)
			      	  .attr("y", 9)
			      	  .style("font-size", "13px")
			      	  .attr("dy", ".35em")
			      	  .text(function(d) { return d; })
			      	  .attr("id", "text1");

	     			mapLegend.append("rect")
			   		  .attr("width", 18)
			   		  .attr("height", 18)
			   		  .style("fill", colorScaling1);
					});

					
});

document.getElementById("Dot1").onclick = function() {

d3.csv("percapita.csv", function(data) {

	dataset = [];
	metricAggregated = d3.nest()
	.key(function(d) { return d.Area; })
	.rollup(function(v) { return {
	avg: Math.ceil(d3.mean(v, function(d) { return d.year_2017; }))
	}; })
	.entries(data);

	var populationArr = [];

	for (var i=0; i < metricAggregated.length; i++) {
		populationArr.push(metricAggregated[i].values.avg)
		dataset[i] = { state : metricAggregated[i].key, population : metricAggregated[i].values.avg};
	}

	var min = d3.min(populationArr)
	var max = d3.max(populationArr)
	var colorScaling = d3.scale.sqrt().domain([min,max]).range([low,high])
	var colorScaling1 = d3.scale.linear().domain([min, min+50000, min+70000, min+100000]).range(['#F6CECE', '#F5A9A9', '#F78181', '#FA5858'])

	d3.json("us-states.json", function(json) {
	    for (var i = 0; i < dataset.length; i++) {
	      var dataState = dataset[i].state;
	      var dataValue = dataset[i].population;
	      for (var j = 0; j < json.features.length; j++) {
	        var jsonState = json.features[j].properties.name;

	        if (dataState == jsonState) {
	          json.features[j].properties.value = dataValue;
	          break;
	        }
	      }
	    }

	    mapSVG.selectAll("path").remove();
	    mapSVG.selectAll("text").remove();

	    mapSVG.selectAll("path")
			      .data(json.features)
			      .enter()
			      .append("path")
			      .attr("d", path)
			      .style("stroke", "#fff")
			      .style("stroke-width", "1")
			      .style("fill", function(d) { return colorScaling(d.properties.value) })
			      .on("mouseover", function(d) {      
				    	div.transition()        
				      	   .duration(200)      
				           .style("opacity", .9);      
				           div.text(d.properties.name + " : " + d.properties.value)
				           .style("left", (d3.event.pageX) + "px")     
				           .style("top", (d3.event.pageY - 28) + "px");    
				   })
			      .on("mouseout", function(d) {       
				        div.transition()        
				           .duration(500)      
				           .style("opacity", 0);   
				    })
			      .on("click", funcWinner);

			     mapSVG.append("text")
		        .attr("x", marginLeft + w / 2 - 20)
		        .attr("y", 5 + (marginTop/2))
		        .style("text-anchor", "middle")
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline") 
		        .text("Per Capita Income of all states in United States of America")
		        .transition()
		        .duration(1000);


			        for(var t=0; t<4; t++) {
			        	d3.select("#text1").remove();
			        }

		        var mapLegend = d3.select("#map").append("svg")
	      			.attr("class", "legend")
	     			.attr("width", 140)
	    			.attr("height", 200)
	   				.selectAll("g")
	   				.data(colorScaling1.domain().slice().reverse())
	   				.enter()
	   				.append("g")
	     			.attr("transform", function(d, i) { return "translate(10," + i * 20 + ")"; })
	     			;

	     			mapLegend.append("text")
			  		  .data(mapLegendText)
			  		  .attr("id", "text1")
			      	  .attr("x", 24)
			      	  .attr("y", 9)
			      	  .style("font-size", "13px")
			      	  .attr("dy", ".35em")
			      	  .text(function(d) { return d; });

	     			mapLegend.append("rect")
			   		  .attr("width", 18)
			   		  .attr("height", 18)
			   		  .style("fill", colorScaling1);
					


		
	});
});

}

document.getElementById("Dot").onclick = function() {

	mapSVG.selectAll("path").remove();

	datatsetpop = [];

	d3.csv("Population_for_US_States_2010-2017.csv", function(data) {
		datatsetpop = data.filter(function(d){return d.Year == '2017';});;
	});

	

	d3.csv("percapita.csv", function(data) {

		datasetDot = [];
		finaldatatset = [];
		metricAggregatedDot = d3.nest()
		.key(function(d) { return d.Area; })
		.rollup(function(v) { return {
		avg: Math.ceil(d3.mean(v, function(d) { return d.year_2017; }))
		}; })
		.entries(data);

		var populationArrDot = [];

		for (var i=0; i < metricAggregatedDot.length; i++) {
			datasetDot[i] = { state : metricAggregatedDot[i].key, population : metricAggregatedDot[i].values.avg};
		}

		var cnt = 0;
		for(var i=0; i<datasetDot.length; i++) {
			for(var j=0; j<datatsetpop.length; j++) {
				if(datatsetpop[j].State == datasetDot[i].state) {
					finaldatatset[cnt] = { state : datatsetpop[j].State, population : datasetDot[i].population * (datatsetpop[j].Population/1000)};
					cnt++;
					break;
				}
			}
		}

		var low1 = '#E0E6F8';
		var high1 = '#08088A';

		console.log(finaldatatset.length);

		for (var i=0; i < finaldatatset.length; i++) {
			populationArrDot.push(finaldatatset[i].population);
		}


		var min = d3.min(populationArrDot)
		var max = d3.max(populationArrDot)
		var colorScalingDot = d3.scale.sqrt().domain([min,max]).range([low1,high1])
		var colorScalingDot1 = d3.scale.linear().domain([min, min+50000, min+70000, min+100000]).range(['#A9BCF5', '#5882FA', '#0040FF', '#08088A']) 

		d3.json("us-states.json", function(json) {
		    for (var i = 0; i < finaldatatset.length; i++) {
		      var dataStateDot = finaldatatset[i].state;
		      var dataValueDot = finaldatatset[i].population;
		      for (var j = 0; j < json.features.length; j++) {
		        var jsonStateDot = json.features[j].properties.name;

		        if (dataStateDot == jsonStateDot) {
		          json.features[j].properties.value = dataValueDot;
		          break;
		        }
		      }
		    }

		    mapSVG.selectAll("path").remove();
		    mapSVG.selectAll("text").remove();
			


		    mapSVG.selectAll("path")
			      .data(json.features)
			      .enter()
			      .append("path")
			      .attr("d", path)
			      .style("stroke", "#fff")
			      .style("stroke-width", "1")
			      .style("fill", function(d) { return colorScalingDot(d.properties.value) })
			      .on("mouseover", function(d) {      
				    	div.transition()        
				      	   .duration(200)      
				           .style("opacity", .9);      
				           div.text(d.properties.name + " : " + Math.floor(d.properties.value/1000))
				           .style("left", (d3.event.pageX) + "px")     
				           .style("top", (d3.event.pageY - 28) + "px");    
				   })
			      .on("mouseout", function(d) {       
				        div.transition()        
				           .duration(500)      
				           .style("opacity", 0);   
				    })
			      .on("click", funcWinner);





			      mapSVG.append("text")
			        .attr("x", marginLeft + w / 2 - 20)
			        .attr("y", 5 + (marginTop/2))
			        .style("text-anchor", "middle")
			        .style("font-size", "16px") 
			        .style("text-decoration", "underline") 
			        .text("Total Income of states (in Millions) in United States of America")
			        .transition()
			        .duration(1000);

			         //mapLegend.selectAll("text").remove();

			        //d3.select("svg").remove();

			        for(var t=0; t<4; t++) {
			        	d3.select("#text1").remove();
			        }
			        
			        var mapLegend = d3.select("#map").append("svg")
	      			.attr("class", "legend")
	     			.attr("width", 140)
	    			.attr("height", 200)
	   				.selectAll("g")
	   				.data(colorScalingDot1.domain().slice().reverse())
	   				.enter()
	   				.append("g")
	     			.attr("transform", function(d, i) { return "translate(10," + i * 20 + ")"; })
	     			;

	     			var mapLegendTexting2 = ["2 million +", "[1-2] million", "[500-1000]k", "< 500k"];

	     			mapLegend.append("rect")
			   		  .attr("width", 18)
			   		  .attr("height", 18)
			   		  .style("fill", colorScalingDot1);
 					

	     			mapLegend.append("text")
			  		  .data(mapLegendTexting2)
			      	  .attr("id", "text1")
			      	  .attr("x", 24)
			      	  .attr("y", 9)
			      	  .style("font-size", "13px")
			      	  .attr("dy", ".35em")
			      	  .text(function(d) { return d; })
			      	  ;
			});
	});
}

var lineFiltered = d3.svg.line()
    .x(function(d) { return xScaleLine(dateFormat.parse(d.Year));
    })
    .y(function(d) { return yScaleLine(d.Population); 
    });


function funcWinner(d) {
	var filterState = d.properties.name
	d3.csv("Population_for_US_States_2010-2017.csv", function(data) {
		filteredData = data.filter(function(d){return d.State == filterState;});

		var years1 = [];
		var populations1 = [];
		  for (var i=0; i < filteredData.length; i++) {
		    years1.push(filteredData[i].Year);
		    filteredData[i].Population= filteredData[i].Population/1000;
		    populations1.push(filteredData[i].Population)
		  }

		xScaleLine.domain([
	      d3.min(years1, function(d) {
	        return dateFormat.parse(d);
	      }),
	      d3.max(years1, function(d) {
	        return dateFormat.parse(d);
	      })
	    ]);

		var min = d3.min(populations1);
		var max = d3.max(populations1);


	     yScaleLine.domain([d3.max(populations1), d3.min(populations1)]);

	     secondchart.selectAll("path").remove()
	     secondchart.selectAll("text").remove()
	     secondchart.selectAll("g").remove()

	     //

     	secondchart.append("text")
        .attr("x", wi / 2 )
        .attr("y", 5 + (marginValues.top/2))
        .style("text-anchor", "middle")
        .style("font-size", "16px") 
        .style("text-decoration", "underline") 
        .text("Population Growth of "+filterState +" (in Thousands) from 2010-2017")
        .transition()
        .duration(300);


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


     	secondchart.append("path")
        .attr("class", "line")
        .attr("d", lineFiltered(filteredData));
		});



	
}