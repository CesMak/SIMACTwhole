
//Global variables:
//Array das Linienzüge und Koordinatensysteme Speichert:
// Graphs
// -> Array mit scale_Arrays (vis,xScale,yScale,width,height,padding,res[0],res[1])
var Graphs = Array(10); // max. 10 verschiedene Graphen.

// Lines
// -> Array mit LinienZug (enthält einzelne Kreise! + Eigenschaften eines Kreises)+nummer des KS in dem
// dieser Linienzug ist!
var Lines = Array(20); //max. 20 verschiedene Linienzüge.

var scale_Array;


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
return [vis,xScale,yScale,width,height,padding,res[0],res[1]];
}

function plot_Gleichung(){
	var Gleichung = document.getElementById('Gleichung').value;
	var scalingText = document.getElementById('scale').value;
	var res = scalingText.split(" ");  // res ist ein Array

	//Get Elements:
	if(Graphs[0] == null){
		scale_Array = create_scale();
	}
	Graphs[0] = scale_Array;
	//unterscheide nochmals die Fälle:
	//wenn die skalierung gleich bleibt und wenn
	//sie sich ändert!
	//speichere alle scale_Array wiederum in ein Array!
	
	vis = scale_Array[0];
	xScale = scale_Array[1];
	yScale = scale_Array[2];
	var startXValue = res[0];
	var endXValue = res[1];
	
	//Initialize:
	var stepsize = 20;
    var laenge = (Math.abs(startXValue)+Number(endXValue))*stepsize+1;
	var xValues = Array(laenge);
	var yValues = Array(laenge);
	
	console.log(startXValue);
	console.log(endXValue);
	console.log("Länge: "+Number(laenge));
	
	// Fill xValues from startXValue to endXValue with Step: 1
	for(var i = 0;i<laenge;i++){
		xValues[i] = Number(startXValue)+i/stepsize;
	}

	//Fallunterscheidung - untersuche Gleichungstext!
	// Operationen auf xWErte anwenden um y Werte zu errechnen!.
	for(i=0;i<laenge;i++){
		yWert = 8*Math.sin(xValues[i]);
		if((yWert)>5){
			yValues[i] = 5;
		}
		else if(yWert<-5){
		yValues[i]=-5;
		}
		else{
			yValues[i]=yWert;
		}
	}
	loop(vis,xValues,yValues,xScale,yScale,xValues.length,0,8)
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