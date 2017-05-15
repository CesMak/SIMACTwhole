/* 
	//additional things:
	/* chart.series[1].addPoint({ x: 2,y: 5,id: "Hallo"});
	var p = chart.series[1].points[9];
	p.update({
	marker: {
	symbol: 'square',
	fillColor: "#A0F",
	lineColor: "A0F0",
	radius: 5
	}
	}); 
	
	
	
		chart.addSeries({
		data: [StartPunkt, EndPunkt],
		marker: {
			fillColor: 'red',
			lineWidth: 1,
			radius: 6,
			symbol: 'circle',
		},
	});

	
	
	/*  area: {
			pointStart: -10, // hack!  den punkt gibts nähmlich nicht
			marker: {
			enabled: false,
			symbol: 'circle',
			radius: 2,
			states: {
			hover: {
			enabled: true
			}
			}
			}
			}, 
			
			
			
			
			
		var chart = new Highcharts.Chart({
			chart: {
				//type: "area",
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
			plotOptions: {
				series: {
					marker: {
						fillColor: '#FFFFFF',
						lineWidth: 10,
						lineColor: null // inherit from series
					}
				}
			},
			

			series: [{
					name: "Linie Plot",
					id: "Hallo",
					animation: true, // false macht Bild auf ein Schlag, true man sieht wies gemalt wird.
					data: dataa
				}
			]
		});
 */


function makeafirstPlot() {
	var dataa = [[1, 2], [4, 2]]
	var chart = new Highcharts.Chart({
			chart: {
				type: "area",
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
			plotOptions: {
				series: {
					marker: {
						fillColor: '#FFFFFF',
						lineWidth: 10,
						lineColor: null // inherit from series
					}
				}
			},
			/*  area: {
            pointStart: -10, // hack!  den punkt gibts nähmlich nicht
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
			 }, */

			series: [{
					name: "Linie Plot",
					id: "Hallo",
					animation: true, // false macht Bild auf ein Schlag, true man sieht wies gemalt wird.
					data: dataa
				}
			]
		});
	addLine2(chart);
	//	addLine(5,5,10,5,chart);
	//addLine(4,4,10,4,chart);
}

function addLine2(chart) {

		
	//addSeries (Object options, [Boolean redraw], [Mixed animation])
	//options: Object
	// The series options, as documented under plotOptions.series and under the plotOptions for each series type.
	//redraw: BooleanDefaults to true. Whether to redraw the chart after the series is added. See the redraw() method below.
	//animation: Mixed
//chart.xAxis[0].setCategories([1,2,3], false);

/* 	var arrow = chart.addSeries( {
		series: [{
			name: "Pfeil",
			data: [[1, 2], [4, 2]]
		}],
		plotOptions: {
			series: {
				marker: {
					fillColor: '#FFFFFF',
					lineWidth: 10,
					lineColor: null // inherit from series
				}
			}
		}
	},
	false);
	chart.series[1].setData([[1, 2], [99, 2]],true);
 */
chart.addSeries({
            data: [[2, 2], [2, 4],[1.8,4],[2.2,4],[2,5.5]],
            marker: {
              fillColor: 'red',
			  lineWidth: 1,
			  radius: 6,
			  symbol: 'circle',
            },
        });
	//only redraws the data nothing else....
	//chart.redraw();
	//chart.series[1].redraw();
	//arrow.redraw();
}

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

	// currentseries.addPoint([5, 15]);
	// added Linie:
	//#2f7ed8' ist die farbe blau!
	var currentseries = chart.addSeries({
			name: "Pfeilz",
			id: "Pfeizl",
			data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

		});

	console.log("current series: " + currentseries);

	console.log(chart.series[1]);

	chart.series[1].update({
		/* chart: {
		type: 'area'
		}, */

		dataLabels: {
			enabled: true
		},

		// funktioniert nicht:
		//TODO - plot options im chart?!
		plotOptions: {
			/*  series: {
			fillColor: {
			linearGradient: [0, 0, 0, 300],
			stops: [
			[0, Highcharts.getOptions().colors[0]],
			[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
			]
			}
			}, */
			series: {
				marker: {
					fillColor: '#FFFFFF',
					lineWidth: 1,
					lineColor: null // inherit from series
				}
			}
		},

	});
	chart.series[1].redraw();
	chart.series[0].redraw();

	chart.xAxis[0].setCategories([2, 4, 5, 6, 7], false);

	chart.addSeries({
		name: "acx",
		data: [4, 5, 6, 7, 8]
	}, false);

	chart.redraw();

	// läuft ändert aber alles:
	/* chart.update({
	chart: {
	inverted: true,
	polar: false
	},
	subtitle: {
	text: 'Inverted'
	},
	series: [{
	name: "Linie Plot",
	id: "Hallo",
	animation: true, // false macht Bild auf ein Schlag, true man sieht wies gemalt wird.
	data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

	}
	],


	series: {
	marker: {
	fillColor: '#FFFFFF',
	lineWidth: 20,
	lineColor: null // inherit from series
	}
	}

	}); */

}

(function (H) {}
	(Highcharts));
