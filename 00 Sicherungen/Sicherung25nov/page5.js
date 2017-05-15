function myFunction1(){
		var dataset = [ 5, 10, 15, 20, 25 ];
			
			d3.select("body").selectAll("p")
				.data(dataset)
				.enter()
				.append("p")
				.text(function(d) {
					return "I can count up to " + d;
				})
				.style("color", function(d) {
					if (d > 15) {	//Threshold of 15
						return "red";
					} else {
						return "black";
					}
				});
}

function myFunction2(){
			// Set graph
			var width = 700,
			height = 700,
			padding = 100;
			
			var dataset = [
							[-5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
							[400, 12], [475, 44], [25, 67], [85, 21], [220, 88],
							[40, 150]
						  ];
			
			// create an svg container
			var vis = d3.select("body").select("#graph") //<-- gehört zu Graph das in page1.html festelegt wird!
						.append("svg:svg")
						.attr("width", width)
						.attr("height", height);

		//var xScale = d3.scaleLinear().domain([10, -10]).range([width - padding, padding]);
		//var yScale = d3.scaleLinear().domain([-10, 10]).range([height - padding, padding]);
		
		var xScale = d3.scaleLinear() // scaleLinear ab version 4.2.1
								 .domain([d3.max(dataset, function(d) { return d[0]; }), -d3.max(dataset, function(d) { return d[0]; })     ])
								 .range([width -padding,padding]);
								 
		var yScale = d3.scaleLinear()
								 .domain([-d3.max(dataset, function(d) { return d[1]; }), d3.max(dataset, function(d) { return d[1]; })    ])
								 .range([height-padding, padding]);						 
								 

		// define the y axis
		var yAxis = d3.axisLeft()
			.scale(yScale);
	
		// define the x axis
		var xAxis = d3.axisBottom()
			.scale(xScale);

		var xAxisPlot =vis.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (height)/2 + ")")
				.call(xAxis); 
				
		var yAxisPlot = vis.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + (width)/2 + ",0)")
			.call(yAxis);
			
			
	var svg = vis.append("circle")
				.attr("cx", function(d) {
			   		return width/2;
			   })
			   .attr("cy", function(d) {
			   		return height/2;
			   })
			   .attr("r", function(d) {
			   		return 30;
			   })
			    .style("stroke-width", 5)    // set the stroke width
				.style("stroke", "green")      // set the line colour
				.style("fill", "orange");      // set the fill colour
console.log(vis);

			
			var i = 1;
(function loop(){
    if(i++ > 200) return;
    setTimeout(function(){
        drawPoint(vis,i,i); 
        loop()
    }, 10)
})();

			/* d3.select("circle")
			.transition()
			.delay(1000)
			.duration(2000)
			.attr("cx", "40%");
	 */
			
			
			
			//Fun:
			/* d3.select("circle")
			.transition()
			.delay(1000)
			.duration(3000)
			.attr("cy", "50%")
			.attr("cx", "20%")
			.attr("r", "5%"); */

						
			
		/* 	
			d3.select("body")
			 .transition()
			.duration(3000)
			.style("background-color", "green"); */
			
	/*    for (i = 0; i < 50; i++) {
			drawPoint(vis,100+i,200-i)
		} */
			
			
			
			
			/* svg.selectAll("circle")
			   .data(dataset)
			   .enter()
			   .append("circle")
			   .attr("cx", function(d) {
			   		return (d[0]);
			   })
			   .attr("cy", function(d) {
			   		return (d[1]);
			   })
			   .attr("r", function(d) {
			   		return 10;
			   });svg.selectAll("circle")
			   .data(dataset)
			   .enter()
			   .append("circle")
			   .attr("cx", function(d) {
			   		return (d[0]);
			   })
			   .attr("cy", function(d) {
			   		return (d[1]);
			   })
			   .attr("r", function(d) {
			   		return 10;
			   }); */
			   
			//show grid -> wird in eine methode gepackt.
		/* var xAxisPlot = vis.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + (height/2) + ")")
			.call(xAxis.tickSize(-height, 0, 0)); */
			

/* 
		var yAxisPlot = vis.append("g")
			.attr("class", "axis axis--y")
			.attr("transform", "translate("+ (width/2) +",0)")
			.call(yAxis.tickSize(-width, 0, 0)); */


		/* xAxisPlot.selectAll(".tick line")
			.attr("y1", (width - (2*padding))/2 * -1)
			.attr("y2", (width - (2*padding))/2 * 1);

		yAxisPlot.selectAll(".tick line")
			.attr("x1", (width - (2*padding))/2 * -1)
			.attr("x2", (width - (2*padding))/2 * 1); */
			

					  
}

function drawPoint(vis,x,y,xScale,yScale){						 
    var svg = vis.append("circle")
				.attr("cx", function(d) {
					return xScale(x);
			   })
			   .attr("cy", function(d) {
			   		return yScale(y);
			   })
			   .attr("r", function(d) {
				return 3;
			   })
			     .style("stroke-width", 1)    // set the stroke width
				.style("stroke", "green")      // set the line colour
				.style("fill", "orange");      // set the fill colour;
}

function Beschreib(){ //use math.js !!!
	//Initialize datapoints: Nx2 xvalue, y value
	points = 201;
	
	// create an array:
	var datapoints = new Array(points);
 
 // create a marix:
for (var i = 0; i < datapoints.length; ++i) {
  datapoints[i] = new Array(1);
}

//initialize:
startwert = 100;
for (var j = -startwert; j < datapoints.length-startwert; ++j) {
	z = j+startwert;
  datapoints[z][0] = j;
  datapoints[z][1] = 0;
}
//print(datapoints);

for(var z =0;z<datapoints.length;++z){
	value  =datapoints[z][0];
	datapoints[z][1] = Math.sin(value*(180/Math.PI));
}

// show datapoints!
figure = drawKS();

for(p=0;p<datapoints.length;++p){
	x=datapoints[p][0];
	y=datapoints[p][1];
drawPoint(figure,x,y);
}
print(datapoints);
}


function drawKS(){
			// Set graph
			var width = 700,
			height = 700,
			padding = 100;
						  
			// create an svg container
			var vis = d3.select("body").select("#graph") //<-- gehört zu Graph das in page1.html festelegt wird!
						.append("svg:svg")
						.attr("width", width)
						.attr("height", height);

		var xScale = d3.scaleLinear() // scaleLinear ab version 4.2.1
								 .domain([10, -10 ])
								 .range([width -padding,padding]);
								 
		var yScale = d3.scaleLinear()
								 .domain([-10, 10])
								 .range([height-padding, padding]);						 

		// define the y axis
		var yAxis = d3.axisLeft()
			.scale(yScale);
	
		// define the x axis
		var xAxis = d3.axisBottom()
			.scale(xScale);

		var xAxisPlot =vis.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (height)/2 + ")")
				.call(xAxis); 
				
		var yAxisPlot = vis.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + (width)/2 + ",0)")
			.call(yAxis);
			
			//gib Achsenelement system zurück
			return vis;
}

function print (Matrix) {
  //Anzahl zeilen:
  Zeilen = Matrix.length;
  Spalten = Matrix[0].length;
  
  for(i=0;i<Zeilen;i++){
	  var a = "";
	  for(j=0;j<Spalten;j++){
		  a = a+" "+(Matrix[i][j]);
		}
		console.log("["+a+"]");
	}	
}

function create_scale(){
	
	// get the scaling number:
	var scalingText = document.getElementById('scale').value;
	var res = scalingText.split(" ");  // res ist ein Array
	console.log(res[0]);
	console.log(res[1]);
	
	//Entscheidung: was je nach res passiert!
	
	
	// Set graph
	var width = 500,
	height = 500,
	padding = 100; //"Polsterung"
	
	console.log("In diesem Beispiel sollten die Länge und Höhe des Koordinatensystems annähernd gleich sein!")
	console.log(width+" x "+height)
						  
		// create an svg container
		var vis = d3.select("body").select("#graph") //<-- gehört zu Graph das in page1.html festelegt wird!
						.append("svg:svg")
						.attr("width", width)
						.attr("height", height);
		
		//scaling!!!
		//takes an Interval and transforms it to a new interval!
		var xScale = d3.scaleLinear() // scaleLinear ab version 4.2.1
								 .domain([res[1], res[0] ]) // initial interval (domain) e.g.: is 0 to 10,000
								 .range([width -padding,padding]); // new interval (range) should be 0 to 100. 
								 
		var yScale = d3.scaleLinear()
								 .domain([res[0], res[1]])
								 .range([height-padding, padding]);						 

		//Beispiel: var linearScale = d3.scale.linear()
                           //.domain([0,10000])
                         //  .range([0,100]);
							//->linearScale(10)=0.1;
							
		//console.log(xScale(350)); --> ???!
		
		// define the y axis
		var yAxis = d3.axisLeft()
			.scale(yScale);
	
		// define the x axis
		var xAxis = d3.axisBottom()
			.scale(xScale);

		var yvaluee = yScale(0);
		console.log(yvaluee);
		var xAxisPlot =vis.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + yvaluee + ")")
				.call(xAxis); 
		
		var xvaluee = xScale(0);
		console.log(xvaluee);
		var yAxisPlot = vis.append("g") // je kleiner der Wert width/3 etc. desto weiter links ist diese Achse!
			.attr("class", "axis")
			.attr("transform", "translate(" + xvaluee + ",0)")
			.call(yAxis);
			
			//gib Achsenelement system zurück
return [vis,xScale,yScale,width,height,padding];
}

function plot_Gleichung(){
	var Gleichung = document.getElementById('Gleichung').value;
	var scalingText = document.getElementById('scale').value;
	var res = scalingText.split(" ");  // res ist ein Array
	
	//Get Elements:
	var scale_Array = create_scale();
	vis = scale_Array[0];
	xScale = scale_Array[1];
	yScale = scale_Array[2];
	var startXValue = res[0];
	var endXValue = res[1];
	
	//Initialize:
    var laenge = Math.abs(startXValue)+Number(endXValue)+1;
	var xValues = Array(laenge);
	
	console.log(startXValue);
	console.log(endXValue);
	console.log(laenge);
	
	// Fill xValues from startXValue to endXValue with Step: 1
	for(var i = 0;i<laenge;i++){
		xValues[i] = Number(startXValue)+i;
		//console.log(xValues[i]);
	}
	console.log(xValues[0]);
	console.log(xValues[1]);
	
	//Fallunterscheidung - untersuche Gleichungstext!
	yValues = xValues;
	
	loop(vis,xValues,yValues,xScale,yScale,xValues.length,0,80)
}	

function plot(vis,xValues,yValues,xScale,yScale){
	for(var i = 0;i<xValues.length;i++){
		drawPoint(vis,xValues[i],yValues[i],xScale,yScale);
	}
}

function loop(vis,xValues,yValues,xScale,yScale,laenge,i,intervalTime){
    if(laenge-- < 1) return;
    setTimeout(function(){
        drawPoint(vis,xValues[i],yValues[i],xScale,yScale);
		i++;
		loop(vis,xValues,yValues,xScale,yScale,laenge,i,intervalTime);
    }, intervalTime)
}