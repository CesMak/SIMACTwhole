

// y/x = 5/(s+1) ydot +y = 5 -> y(x)=c1 e^-x + 5 siehe auch: https://de.wikipedia.org/wiki/PT1-Glied 
function berechneWerte(){
	var xWerte = new Array;
	var Schrittweite_x_Achse = 0.1;
	var Startwert_x_Achse =0;
	var Endwert_x_Achse = 10;
	
	var yWerte = new Array;
	
	var a = new Array;
	
	var i = Startwert_x_Achse;
for(var z=Startwert_x_Achse;z<Endwert_x_Achse/Schrittweite_x_Achse;z++){
		xWerte[z] =i;
		yWerte[z] = -5*Math.exp(-1*i)+5;
		a[z]=[xWerte[z],yWerte[z]];
	 i=i+Schrittweite_x_Achse;
	}
	console.log(a);
	return a;
}
	

$(function () { 
var x = new Array;
var y = new Array;
    var myChart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
});

$(function () {
    Highcharts.chart('container2', {
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
			min: 0,
			title: {
                text: 'x Achse'
            },
			//hier die xWerte rein: -- Werte müssen aufsteigend sein...?!
            //categories: [7.0, 10,30,9,10,12,15]
			
			//for linear scale:
			// type: 'linear'
			//tickInterval: 0.5
        },
        yAxis: {
			min:0,
            title: {
                text: 'y Achse'
            },
/*             plotLines: [{
                value: 5,	// x-Achse - Linie
                width: 1,   // x-Achse Breite
                color: '#003399' //x-Achse Farbe
            }] */
        },
        tooltip: {
            valueSuffix: '  Einheit des Wertes'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Linie1',
			// hier die y werte rein:
            data: [7.0, 10,30,9,10,12,15]
        }]
    });
});

$(function () {
	a=berechneWerte();
	
/* var mySeries = []; // enthält abwechselnd den x und y Werte ein Array of arrays!
    for (var i = 0; i < a.length; i++) {
        mySeries.push([a[i], a[i + 1]]);
        i++
    } */
	console.log(a);
	
    Highcharts.chart('container3', {
		 title: {
            text: 'Plot: -5*Math.exp(-1*i)+5'
        },
		
        xAxis: {
            minPadding: 0.05,
            maxPadding: 0.05,
			min:0
        },
		yAxis: {
			min:0
		},
		series:[{
    data: a
}]
    });
});