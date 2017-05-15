function makeafirstPlot() {
	var step_response_data = [[1, 2], [4, 2]];
	var chart = new Highcharts.Chart({
			chart: {
				//type: "area",
				renderTo: 'highcharts', // ausgabe in diese Div!
				zoomType: 'x', // in x-Richtung zoombar.
				events: {
					load: function (event) {
						//When is chart ready?
						console.log(this); //this refers to the loaded chart.
					}
				}
			},
			xAxis: {},
			series: [{
					name: "Step response",
					id: "Step_resonse",
					animation: true, // false macht Bild auf ein Schlag, true man sieht wies gemalt wird.
					data: step_response_data
				}
			]
		});

	//adde Überschwingpfeil:
	var StartPunkt = [1, 2]; //erst x dann y Wert.
	var EndPunkt = [1, 5];
	addLine(StartPunkt, EndPunkt, chart);
}

function addLine(StartPunkt, EndPunkt, chart) {

	// highcharts 15 error weil ich meine Daten nicht sortiere!
	chart.addSeries({
		data: [StartPunkt, EndPunkt]
	});

	ArrowUp(chart, EndPunkt, 0.9);
	ArrowDown(chart, StartPunkt, 0.9);
}

function ArrowUp(chart, EndPunkt, scaling) {
	// 1. Connect ends series - highcharts -> kA. wie das gehen soll .... ?
	// fasse alle 3 linien zusammen ... 
	// add chart an der Stelle i? -nicht nötig einfach am Ende alle Pfeile adden!
	chart.addSeries({
		data: [[EndPunkt[0] - 0.05 * scaling, EndPunkt[1]], [EndPunkt[0], EndPunkt[1] + 0.2 * scaling],
			[EndPunkt[0] + 0.05 * scaling, EndPunkt[1]], [EndPunkt[0] - 0.05 * scaling, EndPunkt[1]]],
		marker: {
			enabled: false
		},
		states: {
			hover: {
				enabled: false
			}
		},
		//	connectNulls: true,
		enableMouseTracking: false,
		showInLegend: false,
		//grouping: true,
	});
	//Remove series from visible List!
}
function ArrowDown(chart, StartPunkt, scaling) {
	//oben:
	//TODO: ende definieren!
	chart.addSeries({
		data: [[StartPunkt[0] - 0.05 * scaling, StartPunkt[1]], [StartPunkt[0], StartPunkt[1] - 0.2 * scaling],
			[StartPunkt[0] + 0.05 * scaling, StartPunkt[1]], [StartPunkt[0] - 0.05 * scaling, StartPunkt[1]]],
		marker: {
			enabled: false
		},
		states: {
			hover: {
				enabled: false
			}
		},
		//	connectNulls: true,
		enableMouseTracking: false,
		showInLegend: false,
	});
	//Remove series from visible List!
}

(function (H) {}
	(Highcharts));
