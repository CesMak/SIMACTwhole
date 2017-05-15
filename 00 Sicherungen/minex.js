function makeafirstPlot(){
var dataa = 	[[1,2],[4,2]]
	var chart = new Highcharts.Chart({
					chart: {
						renderTo: 'highcharts',
						zoomType: 'x',
						events: {
							load: function (event) {
								//When is chart ready?
								console.log(this); //this refers to the loaded chart.
							}
						}
					},
					xAxis: {},

					series: [{
							name: "Linie Plot",
							id: "Hallo",
							animation: true, // false macht Bild auf ein Schlag, true man sieht wies gemalt wird.
							data: dataa
						}
					]
				});
				addLine(3,3,10,3,chart);
				addLine(5,5,10,5,chart);
				//addLine(4,4,10,4,chart);
}

var currentseries = null;
	var ii=1;
function addLine(startx, endx, starty, endy, chart) {
	//!!!! and a lable beside it!
	///TODO: only draw arrow for chart[i] with two arrows on each side 
	//!!!!!
	var Punkt1 = new Array;
	var Punkt2 = new Array;
	Punkt1[0] = startx;
	Punkt1[1] = starty;
	Punkt2[0] = endx;
	Punkt2[1] = endy;

	currentseries = chart.addSeries({
		name: "Pfeil"+ii,
		id: "Pfeil"+ii,
		data: [Punkt2,Punkt1]
	});
	ii++;
	console.log("current series: "+currentseries);
}

(function(H) {

    var arrowCheck = false,
        pathTag;
	console.log("currentseries in function (H):"+currentseries);
	
	var xx = 0;
	
    H.wrap(H.Series.prototype, 'drawGraph', function(proceed) {
		
	console.log(xx);
	//console.log("ID: ----------->>>>>>",this.chart.get(id));
	console.log("ID: ----------->>>>>>", this.chart.series[0].name);
	if(this.chart.series.length>1){
	console.log("ID: ----------->>>>>>", this.chart.series[1].name);
	}
	if(this.chart.series.length>2){
	console.log("ID: ----------->>>>>>", this.chart.series[2].name);
	}
	
    // Now apply the original function with the original arguments, 
    // which are sliced off this function's arguments

    			// Now apply the original function with the original arguments,
			// which are sliced off this function's arguments
			proceed.apply(this, Array.prototype.slice.call(arguments, 1));
			console.log("This object: in function H"+this);
			console.log("This is the Graph information?!"+H.Series.prototype);
			
						// used a bit of regex to clean up the series name enough to be used as an id
			var arrowName = "arrow" + this.name.replace(/\W/g, "arrowname?").toLowerCase();
			// console.log("----------->arrowName:"+arrowName)
			
	if(currentseries!=null){

	if(this.chart.series[xx].name =="Pfeil"+xx){
		currentseries = this.chart.series[xx];
	}
	
// bei series = this,
    var arrowLength = 15,
        arrowWidth = 9,
        series = currentseries,
        data = series.data,
        len = data.length,
        segments = data,
        lastSeg = segments[segments.length - 1],
        path = [],
        lastPoint = null,
        nextLastPoint = null;
	    console.log("lastSeg: "+lastSeg.y);
	
    if (lastSeg.y == 0) {
		 console.log("Dieser Fall tritt ein AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
       lastPoint = segments[segments.length - 2];
       nextLastPoint = segments[segments.length - 1];
    } else {
	console.log("Else schleife lastSEg.y != 0")
	// mit 0 eins Pfeil ist am Anfang!/unten 
       lastPoint = segments[0]; // lastPoint = segments[segments.length - 1];
       nextLastPoint = segments[1]; //nextLastPoint = segments[segments.length - 2];
    }

    var angle = Math.atan((lastPoint.plotX - nextLastPoint.plotX) /
        (lastPoint.plotY - nextLastPoint.plotY));

    if (angle < 0) angle = Math.PI + angle;

    path.push('M', lastPoint.plotX, lastPoint.plotY); // wenn das weg ist werden keine Pfeile hinzuaddiert!

		console.log("lastPoint.plotX > nextLastPoint.plotX");
       if (arrowCheck === true) {
		// malt nur den arrow an den pathTag "arrow!!!!"
         pathTag = document.getElementById(arrowName);
         if (pathTag != null) {
           pathTag.remove(pathTag);
       }
     }
	 
	        lastPoint = segments[0]; // lastPoint = segments[segments.length - 1];
       nextLastPoint = segments[1]; //nextLastPoint = segments[segments.length - 2];

	// malt pfeil nach unten:
     path.push(
        'L',
        lastPoint.plotX + arrowWidth * Math.cos(angle),
        lastPoint.plotY - arrowWidth * Math.sin(angle)
     );
     path.push(
        lastPoint.plotX + arrowLength * Math.sin(angle),
        lastPoint.plotY + arrowLength * Math.cos(angle)
     );
     path.push(
        lastPoint.plotX - arrowWidth * Math.cos(angle),
        lastPoint.plotY + arrowWidth * Math.sin(angle),
        'Z'
     );
	 lastPoint = segments[segments.length - 1];
	 nextLastPoint = segments[segments.length - 2];
	 
	 
	     var angle = Math.atan((lastPoint.plotX - nextLastPoint.plotX) /
        (lastPoint.plotY - nextLastPoint.plotY));

    if (angle < 0) angle = Math.PI + angle;

    path.push('M', lastPoint.plotX, lastPoint.plotY); // wenn das weg ist werden keine Pfeile hinzuaddiert!

		console.log("lastPoint.plotX > nextLastPoint.plotX");
       if (arrowCheck === true) {
		// malt nur den arrow an den pathTag "arrow!!!!"
         pathTag = document.getElementById(arrowName);
         if (pathTag != null) {
           pathTag.remove(pathTag);
       }
     }
		// malt Pfeil nach oben: 
       path.push(
         'L',
         lastPoint.plotX - arrowWidth * Math.cos(angle),
         lastPoint.plotY + arrowWidth * Math.sin(angle)
       );
       path.push(
         lastPoint.plotX - arrowLength * Math.sin(angle),
         lastPoint.plotY - arrowLength * Math.cos(angle)
       );
       path.push(
         lastPoint.plotX + arrowWidth * Math.cos(angle),
         lastPoint.plotY - arrowWidth * Math.sin(angle),
         'Z'
       );


    series.chart.renderer.path(path)
    .attr({
       fill: series.color,
       id: arrowName
    })
    .add(series.group);

    arrowCheck = true;

	xx++; 
} // currentseries != null
	});
}(Highcharts));