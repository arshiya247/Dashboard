$(document).ready(function() {
	var dates = [];
	var countries = [];
	var ctdata = {};
	
	// Specify data, options, and element in which to create the chart
  let data = {
    dataValues: [[4, 4, 4], [2, 4, 6], [8, 2], [3, 1]], // for a normal bar chart use multiple arrays with 1 value in each array
    legend: ["EL", "CA", "IND"], // for stacked bar charts
    legendColors: ["#ab060e", "#667c09", "#3ff80e"], // bar colors
    barLabels: ["2020-04-20", "2020-04-21", "2020-04-22", "2020-04-23"], // x-axis labels
    labelColors: ["red", "blue", "orange", "purple"] // x-axis label colors
  };

  let options = {
    chartWidth: "90%", // use valid css sizing
    chartHeight: "90%", // use valid css sizing
    chartTitle: "Country wise data", // enter chart title
    chartTitleColor: "black", // enter any valid css color
    chartTitleFontSize: "1rem", // enter a valid css font size
    yAxisTitle: "Perc_lt_30ms per Country", // enter title for y-axis
    xAxisTitle: "Days", // enter title for x-axis
    barValuePosition: "center", // "flex-start" (top), "center", or "flex-end" (bottom)
    barSpacing: "1%" // "1%" (small), "3%" (medium), "5%" (large)
  };

  let element = "#testDiv"; // Use a jQuery selector to select the element to put the chart into
	
	$.getJSON("testdata.json", function(jdata){
		
		$.each( jdata.hits.hits, function( index, item ) {
			//arr.push( value );    
			//console.log("key => "+index+":"+ item._id);//will output: 04c85ccab52880 and all such
	   
			var source = item._source;
			//console.log(source.Country+":"+countries.includes(source.Country));
			if(!countries.includes(source.Country)) countries.push(source.Country);
			if(!dates.includes(source.Date)){				
				dates.push(source.Date);
				
				//console.log(source.Date+":"+source.Perc_lt_30ms);
				var ctdata1 = [];
				ctdata1[countries.indexOf(source.Country)] = source.Perc_lt_30ms;
				ctdata[source.Date] = ctdata1;
			}else{
				//console.log(ctdata);
				var ctdata1 = ctdata[source.Date];
				//console.log(source.Date+" :data: "+ctdata1 +":"+countries.indexOf(source.Country));
				ctdata1[countries.indexOf(source.Country)] = source.Perc_lt_30ms;
			}

			
			var perc = source.Perc_lt_30ms;
			
			//console.log("date: "+dates.indexOf(source.Date));
			//console.log("country: "+countries.indexOf(source.Country));
			
			//ctdata[dates.indexOf(source.Date)][countries.indexOf(source.Country)] = source.Perc_lt_30ms;
			
			//console.log(ctdata);
		    /*$.each( ctdata, function( ky, val ) {
				console.log('ky => '+ky);//will output: name, firstname, societe
				console.log('val => '+val);//will output: name1, fname1, soc1
				
			})*/
		});
		
		console.log("Dates: "+dates);
		console.log("countries: "+countries);
		//console.log(ctdata);
		
		
		/*$.each( ctdata, function( ky, val ) {
			console.log('ky => '+ky);//will output: name, firstname, societe
			console.log('val => '+val);//will output: name1, fname1, soc1
			
		});*/
		var finalData = [];
		for (let i = 0; i < dates.length; i++) {
			console.log(ctdata[dates[i]]);
			finalData.push(ctdata[dates[i]]);
		}
		//console.log("finalData: "+finalData);
		data["legend"] = countries;
		data["barLabels"] = dates;
		data["dataValues"]= finalData;
		// Generate chart
		drawBarChart(data, options, element);
  
	}).fail(function(){
		console.log("An error has occurred.");
	});
	

	




  // Draws individual chart components
  function drawBarChart(data, options, element) {
	assignColors(data);
    drawChartContainer(element);
    drawChartTitle(options);
    drawYAxisTitle(options);
    drawYAxis(data);
    drawChartGrid(data, options);
    drawXAxis(data, options);
    drawXAxisTitle(options);
	drawChartLegend(data);
  }

  function assignColors(data){
	  var legColors = [];
	  for (let i = 0; i < countries.length; i++) {
		const randomColor = Math.floor(Math.random()*16777215).toString(16);
		legColors[i] = "#" + randomColor;
	  }
	  data.legendColors = legColors;
  }
  
  // Adds chart container to selected element
  function drawChartContainer(element) {
    $(element).prepend("<div class='chartContainer'></div>");
    $(element).css("height", "100%");
  }

  // Draws chart title
  function drawChartTitle(options) {
    $(".chartContainer").append("<div class='chartTitle'>" + options.chartTitle + "</div>");
    //$(".chartContainer").append("<input type='text' placeholder='Chart Title...' name='chartTitle' class='chartTitle' ></input>");
    $(".chartTitle").css("color", options.chartTitleColor);
    $(".chartTitle").css("font-size", options.chartTitleFontSize);
  }

  // Draws chart legend
  function drawChartLegend(data) {
    $(".chartContainer").append("<div class='chartLegend'></div>");
    for (let i = 0; i < data.legend.length; i++) {
      $(".chartLegend").append("<div class='legendKey legendKey" + i + "'></div>");
      $(".legendKey" + i).css("background-color", data.legendColors[i]);
      $(".chartLegend").append("<span>" + data.legend[i] + "</span>");
    }
  }

  // Draws y-axis title
  function drawYAxisTitle(options) {
    $(".chartContainer").append("<div class='yAxisTitle'>" + options.yAxisTitle + "</div>");
  }

  // Draws y-axis labels that are properly scaled to the data and have an
  // appropriate number of decimal places
  function drawYAxis(data) {
    $(".chartContainer").append("<div class='yAxis'></div>");
    let maximum = maxScale(tallestBar(data));
    let order = Math.floor(Math.log(maximum) / Math.LN10
                       + 0.000000001);
    for (let i = 1; i > 0; i = i - 0.2) {
      if (order < 0) {
        $(".yAxis").append("<div class='yAxisLabel'>" + (maximum * i).toFixed(Math.abs(order-1)) + "</div>");
      } else {
        $(".yAxis").append("<div class='yAxisLabel'>" + (maximum * i).toFixed(0) + "</div>");
      }
    }
  }

  // Finds the array with the largest sum and returns the sum of that array
  function tallestBar(data) {
    let sum = 0;
    for (let i = 0; i < data.dataValues.length; i++) {
      let sumArray = data.dataValues[i].reduce((a, b) => a + b, 0);
      if (sumArray > sum) {
        sum = sumArray;
      }
    return sum;
    }
  }

  // Calculates a maximum value for the y-axis scale that is slightly larger
  // than the largest value in the dataset and is rounded suitably
  function maxScale(n) {
    let order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001);
    let multiple = Math.pow(10,order);
    let result = Math.ceil(n * 1.1 / multiple) * multiple;
    if (order > 0) {
      return result;
    } else if (order == 0) {
      return result.toFixed(1);
    } else {
      return result.toFixed(Math.abs(order));
    }
  }

  // Draws chart grid and all data bars
  function drawChartGrid(data, options) {
    // Add container for data
    $(".chartContainer").append("<div class='chartGrid'></div>");

    // Calculate maximum y-axis label value
    let maximum = maxScale(tallestBar(data));

    // Calculate bar width
    let barWidth = 100 / (data.dataValues.length + 2);

    // Add data bars to grid
    for (let i = 0; i < data.dataValues.length; i++) {
      $(".chartGrid").append("<div class='bar bar" + i + "'></div>");
      $(".bar" + i).css("height", "100%");
      $(".bar" + i).css("width", barWidth + "%");
      // Add inner bars
      for (let j = 0; j < data.dataValues[i].length; j++) {

        // Create an inner bar if the value is non-zero
        if (data.dataValues[i][j]) {
          $(".bar" + i).prepend("<div class='innerBar innerBar" + i + j + "'></div");

          // Calculate height of the bar, set color, and show data value inside the bar
          let height = data.dataValues[i][j] / maximum * 100;
          $(".innerBar" + i + j).css("height", height + "%");
          $(".innerBar" + i + j).css("background-color", data.legendColors[j]);
		  //$(".innerBar" + i + j).append("<span class='tooltiptext'>" + data.dataValues[i][j] + "</span>");
          //$(".innerBar" + i + j).append("<p class='barValue'>" + data.dataValues[i][j] + "</p>");
          $(".barValue").css("align-self", options.barValuePosition);
          $(".barValue").css("margin", "0");
        }
      }
    }
    // Set spacing of data bars
    $(".bar").css("margin", "0 " + options.barSpacing);
  }

  // Draws x-axis labels
  function drawXAxis(data, options) {
    $(".chartContainer").append("<div class='emptyBox'></div>");
    $(".chartContainer").append("<div class='xAxis'></div>");

    // Calculate width of the x-axis label to be the same as the bar width
    let barWidth = 100 / (data.barLabels.length + 2);

    for (let i = 0; i < data.barLabels.length; i++) {
      $(".xAxis").append("<div class='xAxisLabel xAxisLabel" + i + "'>" + data.barLabels[i] + "</div>");
      $(".xAxisLabel").css("width", barWidth + "%");
      $(".xAxisLabel" + i).css("color", "Black");//data.labelColors[i]
    }

    // Set spacing of x-axis labels
    $(".xAxisLabel").css("margin", "0 " + options.barSpacing);
  }

  // Draws x-axis title
  function drawXAxisTitle(options) {
    $(".chartContainer").append("<div class='xAxisTitle'>" + options.xAxisTitle + "</div>");
  }

  
  
});
