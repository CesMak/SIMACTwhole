
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
	padding = 20; //"Polsterung" // Padding ist der Abstand nach oben.
	
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
	var scalingText = document.getElementById('scale').value;
	var res = scalingText.split(" ");  // res ist ein Array

	var xScale = res[1];
	
	var imag, real;
	
	var ortskurve_formula = document.getElementById('Gleichung').value;
	var speicher = ortskurve_formula;
	
	var w_punkte = math.round(2000/(xScale*2)); // Punkte skalierung!, 2000 Anzahl gesampt punkte
	
	console.log("Punkte zw. 0 und 1   "+Number(w_punkte));
	
	var xValues = Array(w_punkte);
	var yValues = Array(w_punkte);
	
	
	//console.log(typeof ortskurve_formula)
	
	// berechne Werte:
	w = 0; // startwert der Ortskurve für w!
	
	//stepsize: (variable)
	var stepsize_w = 0.001;
	
	const certainValues = Array(w_punkte);
	
	for(var c= 0;c<w_punkte;c++){
		
		// ersetze alle w mit 1,2,3,...
		ortskurve_formula = ortskurve_formula.replace(/w/g, w);
		console.log(ortskurve_formula);
		var ortskurve_Werte = math.eval(ortskurve_formula);
		console.log(ortskurve_Werte);
		// Werte auswerten:
		xValues[c]=math.re(ortskurve_Werte);
		yValues[c]=math.im(ortskurve_Werte);
		ortskurve_formula = speicher;
		
		// variable stepsize Regelung Abhängig von ersten Werten.
		if(c>2){
			/// macht diese Abwägung sinn?
			if(math.sqrt( (xValues[c-2]+xValues[c-1])) > math.sqrt( (xValues[c-1]+xValues[c]))){
				stepsize_w = 1.1*stepsize_w; // um 10% größer
			}
			else {
				stepsize_w = 0.9*stepsize_w;
			}
		}
		
		certainValues[c] = math.round(w*100);
		
		w=w+stepsize_w;
	}
	plot_itt(xValues,yValues,certainValues);
}	

function plot_itt(xValues,yValues,certainValues){
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	var scalingText = document.getElementById('scale').value;
	var res = scalingText.split(" ");  // res ist ein Array

	var gibts_die_Skalierung = gibts_die_Skalierung_schon(res[0],res[1]);
	var index = 0;
	
	if(gibts_die_Skalierung ==2000){ // es gibt die Skalierug noch nicht
		// erstelles neues KS und speichere es in Graphs an die erste freie Stelle.
		index = erste_freie_Array_Stelle(Graphs);
		console.log("Index  "+Number(index));
		Graphs[index] = create_scale();
		console.log("Erstelle neuen Graph diese Skalierung gibts noch nicht!")
	}
	else{ // es gibt die skalierung schon und zwar an der Stelle gibts_die_Skalierung
		index = gibts_die_Skalierung;
		console.log("Male Graph in bestehende Skalierung!")
	}
	
	vis = Graphs[index][0];
	xScale = Graphs[index][1];
	yScale = Graphs[index][2];
	var startXValue = Graphs[index][6];
	var endXValue = Graphs[index][7];
	
	//Initialize:
	var stepsize = 10;
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////

	loop(vis,xValues,yValues,xScale,yScale,xValues.length,0,0.1,certainValues)
	
}

function gibts_die_Skalierung_schon(xStartValue, xEndValue){
	for(var i = 0;i<Graphs.length;i++){
		if(Graphs[i] == null){
			console.log("Graphs[i] "+Graphs[i]);
			return 2000;
		}
		if( (Graphs[i][6] == xStartValue) && (Graphs[i][7] == xEndValue) ){
						console.log("HALLOOOOOOOOOO           asfdksöljfdj ");
						console.log(i)
						return i;
		}
	}
	return 2000;
}

function erste_freie_Array_Stelle(input_Array){
	for(i=0;i<input_Array.length;i++){
		if(input_Array[i] != null)
			return i;
	}
	//array is full ersetze ersten Graph?:
	return 0;
}

function plot(vis,xValues,yValues,xScale,yScale){
	for(var i = 0;i<xValues.length;i++){
		drawPoint(vis,xValues[i],yValues[i],xScale,yScale);
	}
}

function loop(vis,xValues,yValues,xScale,yScale,laenge,i,intervalTime,certainValues){
    if(laenge-- < 1) return;
    setTimeout(function(){
        drawPoint(vis,xValues[i],yValues[i],xScale,yScale);
		drawLabel(vis,xValues[i],yValues[i],xScale,yScale,certainValues[i]);
		i++;
		loop(vis,xValues,yValues,xScale,yScale,laenge,i,intervalTime,certainValues);
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

function drawLabel(vis,x,y,xScale,yScale,certainValue){
	//for certain values of x, y:
	var textLabels = vis.append("text")
                 .attr("x", function(d) { return xScale(x); })
                 .attr("y", function(d) { return yScale(y); })
                 .text( function (d) { return certainValue ; })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "10px")
                 .attr("fill", "red");
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

function nichtlin(){
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
}