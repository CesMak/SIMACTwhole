// Global Things:
// Autoformat: Plugins JS-Tools - format STR+ALT+M


//TODO: Texteingabefeld!
// Chart benennung!
//Alle Werte in den Chart schreiben.
//Chart Werte sollen gerundet sein!
function startValues() {
	showValue1(3);
	showValue2(3);
	showValue3(1.5);
	showValue4(4);
	showValue5(0);
	showValue6(0);
	showValue7(0);
	document.getElementById("chb1").checked = false;
}

//checkbox:
function handleClick(cb) {
	if (cb.checked) {
		document.getElementById("textarea1").disabled = false;
		changeDisabledClass("id", "textarea1", "textareadisabled");
		changeDisabledClass("id", "alleInputSlider", "InputSlider_disabled");
		update(); // nimm jetzt Werte aus textarea zum plotten!
	}
	if (!cb.checked) {
		document.getElementById("textarea1").disabled = true;
		changeDisabledClass("id", "textarea1", "textarea");
		changeDisabledClass("id", "alleInputSlider", "alleInputSlider");
	}
}

//to give in checkbox a different color in disabled mode:
function changeDisabledClass(parameter, id, disabledClass) {
	var myInput = "";
	if (parameter == "class") {
		for (i = 0; i < 4; i++) {
			myInput = document.getElementsByClassName(id)[i];
			myInput.disabled = false; //First make sure it is not disabled
			myInput.className = disabledClass; //change the class
		}
	}
	if (parameter == "id") {
		myInput = document.getElementById(id);
		myInput.disabled = false; //First make sure it is not disabled
		myInput.className = disabledClass; //change the class
	}
}

// updating Slidings
function showValue1(newValue) {
	document.getElementById("range1").innerHTML = newValue;
	range1 = newValue;
	update();
}
function showValue2(newValue) {
	document.getElementById("range2").innerHTML = newValue;
	range2 = newValue;
	update();
}
function showValue3(newValue) {
	document.getElementById("range3").innerHTML = newValue;
	range3 = newValue;
	update();
}
function showValue4(newValue) {
	document.getElementById("range4").innerHTML = newValue;
	range4 = newValue;
	update();
}
function showValue5(newValue) {
	document.getElementById("range5").innerHTML = newValue;
	range5 = newValue;
	update();
}
function showValue6(newValue) {
	document.getElementById("range6").innerHTML = newValue;
	range6 = newValue;
	update();
}
function showValue7(newValue) {
	document.getElementById("range7").innerHTML = newValue;
	range7 = newValue;
	update();
}

//Array in dem das Ergebnis gespeichert wird - Werte der Zu plottenden Kurve liegen hier drinnen!
var erg = Array;

// global variabels:
var Schrittweite_x_Achse = 0.1;
var Startwert_x_Achse = 0;
var Endwert_x_Achse = 10;
var End_t_fuer_ystat = 50; //50s
var e = 2.71828182846;
var Band = 5; //5% // TODO noch ändern!
var Rounding = 2; // TODO noch anpassen.
var InputInfo = "";

function update() {
	console.log("Update Data");

	// alle Werte müssen definiert sein:
	var obj_n_defined = "[object HTMLParagraphElement]";
	if (range1 != obj_n_defined && range2 != obj_n_defined && range3 != obj_n_defined && range4 != obj_n_defined && range5 != obj_n_defined && range6 != obj_n_defined && range7 != obj_n_defined) {

		if (document.getElementById("chb1").checked) {
			// lies werte von Textarea ein!
			var text_area_values = read_textarea();
			var m = text_area_values[0];
			var b = text_area_values[1];
			var k = text_area_values[2];
			var k_p = text_area_values[3];
			var k_d = text_area_values[4];
			var x_0 = text_area_values[5];
			var dx_0 = text_area_values[6];
			Endwert_x_Achse = text_area_values[7];
			Schrittweite_x_Achse = text_area_values[8];
			Band = text_area_values[9];
			Rounding = text_area_values[10];
			End_t_fuer_ystat = 50 * Endwert_x_Achse;
		} else {
			console.log("Values of sliders are used!")
			// nimm Werte der sliders:
			// nimm Werte der sliders:
			//Output Equation (according to input parameters:)
			var m = parseFloat(range1); // parse float damit kein string mehr!
			var b = parseFloat(range2);
			var k = parseFloat(range3);
			var k_p = parseFloat(range4);
			var k_d = parseFloat(range5);
			var x_0 = parseFloat(range6);
			var dx_0 = parseFloat(range7);

			Schrittweite_x_Achse = 0.1;
			Startwert_x_Achse = 0;
			Endwert_x_Achse = 10;
			End_t_fuer_ystat = 50; //50s
			Band = 5; //5%
			Rounding = 2; // TODO noch anpassen.
		}

		InputInfo = "  m=" + m + " b=" + b + " k=" + k + " k_p=" + k_p + " k_d=" + k_d;
		console.log(InputInfo + "\n Parameters: Schrittweite_x_Achse=0.1, Startwert_x_Achse: 0s; Endwerte x_Achse: 10s, End_t_fuer_ystat=50s, Band=5%, Rounding=2")

		// male die Ortskurve:
		ortskurve(m, b, k, k_p, k_d);

		var all_data = new Array(2);
		// all_data[0] enthält die zu plottenden daten (erg)
		// all_data[1] enthält output Werte Daten notwendig zum plotten von überschwigen etc. Infos

		if (m > 0) { //muss größer null sein sonst gibts bei /2m einen Fehler!

			//1. Schritt: Determinante:
			//2. Schritt Fälle und Eigenwert
			var D = roundd((b + k_d) * (b + k_d) - 4 * m * (k + k_p), Rounding);
			var vorfaktor = roundd( - (b + k_d) / (2 * m), Rounding);
			var endwert1 = roundd(Math.sqrt(D) / (2 * m), Rounding);
			var endwert2 = roundd(Math.sqrt(-D) / (2 * m), Rounding);
			var seriesname = "Step response -  ";

			var ueb1 = document.getElementById("ueb1");
			if (D > 0) {
				var eqleft1 = "D=(b+k_d)^2-4m(k+k_p)=" + D + " >^! 0 \\quad \\text{ überkritisch gedämpft}";
				ueb1.innerHTML = "Fall 1: überkritisch gedämpft (D>0)";
				var eqleft2 = "\\lambda_{1,2} =-\\frac{b+k_d}{2m} \\pm \\frac{\\sqrt{(b+k_d)^2-4m(k+k_p)}}{2m} \\quad = " + vorfaktor + "\\pm j*" + endwert1;
				var lambda1 = roundd(vorfaktor + endwert1, Rounding + 2);
				var lambda2 = roundd(vorfaktor - endwert1, Rounding + 2);
				var xpat = roundd(k_p / (k + k_p), Rounding + 2);
				var C1 = roundd((x_0 * lambda2 + dx_0 - xpat * lambda2) / (lambda1 + lambda2), Rounding + 2);
				var C2 = roundd((dx_0 - lambda1 * C1) / lambda2, Rounding + 2);
				var eqleft5 = "x_g(t) = x_h(t)+x_p(t)=" + C1 + "e^{" + lambda1 + "*t}+" + C2 + "e^{" + lambda2 + "*t}+" + xpat;
				all_data = berechneWerte1(C1, C2, lambda1, lambda2, xpat);
				seriesname = seriesname + "überkritisch gedämpft D>0";
			}
			if (D == 0) {
				var eqleft1 = "D=(b+k_d)^2-4m(k+k_p)=" + D + " =^! 0 \\quad \\text{ kritisch gedämpft}";
				ueb1.innerHTML = "Fall 2: kritisch gedämpft (D=0)";
				var eqleft2 = "\\lambda_{1,2} =-\\frac{b+k_d}{2m} \\quad =" + vorfaktor;
				var lambda1 = roundd(vorfaktor, Rounding + 2);
				var xpat = roundd(k_p / (k + k_p), Rounding + 2);
				var C1 = roundd(x_0 - xpat, Rounding + 2);
				var C2 = roundd(dx_0 - C1 * lambda1, Rounding + 2);
				var eqleft5 = "x_g(t) = x_h(t)+x_p(t)=" + C1 + "e^{" + lambda1 + "*t}+t*" + C2 + "e^{" + lambda1 + "*t}+" + xpat;
				all_data = berechneWerte2(C1, C2, lambda1, xpat);
				seriesname = seriesname + "kritisch gedämpft D=0";
			}
			if (D < 0) {
				var eqleft1 = "D=(b+k_d)^2-4m(k+k_p)=" + D + "  <^! 0 \\text{ unterkritisch gedämpft}";
				ueb1.innerHTML = "Fall 3: unterkritisch gedämpft (D<0)";
				var eqleft2 = "\\lambda_{1,2} =-\\frac{b+k_d}{2m} \\pm j*\\frac{\\sqrt{-(b+k_d)^2+4m(k+k_p)}}{2m} \\quad = " + vorfaktor + "\\pm j*" + endwert2;
				var xpat = roundd(k_p / (k + k_p), Rounding + 2);
				var C1 = roundd(x_0 - xpat, Rounding + 2);
				var lambdar = roundd(vorfaktor, Rounding + 2);
				var lambdai = roundd(endwert2, Rounding + 2);
				var C2 = roundd((dx_0 - C1 * vorfaktor) / endwert2, Rounding + 2);
				var eqleft5 = "x_g(t) = x_h(t)+x_p(t)=" + C1 + "e^{" + vorfaktor + "*t} cos(" + endwert2 + "*t)+" + C2 + "e^{" + vorfaktor + "*t} sin(" + endwert2 + "*t)+" + xpat;
				all_data = berechneWerte3(C1, C2, lambdar, lambdai, xpat);
				seriesname = seriesname + "unterkritisch gedämpft D<0";
			}

			// Load other data wichtig zum plotten von zusätlichen Eigenschaften:
			var output = new Array(5);
			output = all_data[1];
			var ystat = output[0];
			var maxY = output[1];
			var x_of_maxY = output[2];
			var ueberschw = output[3];
			var start_t = output[4];
			var end_t = output[5];
			var t_rise = output[6];
			var t_settling = output[7];

			document.getElementById("eqleft1").setAttribute("data-expr", String.raw `${eqleft1}`);
			var tex = document.getElementById("eqleft1");
			katex.render(String.raw `${eqleft1}`, tex);

			eqleft2 = "\\text{Eigenwerte: }\\qquad" + eqleft2;
			document.getElementById("eqleft2").setAttribute("data-expr", String.raw `${eqleft2}`);
			var tex = document.getElementById("eqleft2");
			katex.render(String.raw `${eqleft2}`, tex);

			var eqleft3 = "\\text{umgestellte DGL:} \\qquad" + m + "\\ddot{x}(t)+" + (b + k_d) + "\\dot{x}(t)+" + (k + k_p) + "x(t)=" + k_p + "x_d(t) + " + k_d + "\\dot{x}_d(t)";
			document.getElementById("eqleft3").setAttribute("data-expr", String.raw `${eqleft3}`);
			var tex = document.getElementById("eqleft3");
			katex.render(String.raw `${eqleft3}`, tex);

			var eqleft4 = String.raw `\small{\text{Annahme: } x_d \text{ sei der Einheitssprung:}}\quad x_d(t) = \begin{cases} 0, & t=0 \\ 1, & t>0 \end{cases} \qquad \dot{x}_d(t)=0, t>0`;
			document.getElementById("eqleft4").setAttribute("data-expr", String.raw `${eqleft4}`);
			var tex = document.getElementById("eqleft4");
			katex.render(String.raw `${eqleft4}`, tex);

			document.getElementById("eqleft5").setAttribute("data-expr", String.raw `${eqleft5}`);
			var tex = document.getElementById("eqleft5");
			katex.render(String.raw `\small ${eqleft5}`, tex); //hier steht ein small drinnen!

			//plotte jedes mal neu:
			// create the chart
			console.log(all_data[0]);
			console.log("zu plottenden Werte: " + all_data[0]); /// erg entält die zu plottenden Werte erst x1,y1,x2,y2,....
			var chart = new Highcharts.Chart({
					chart: {
						renderTo: 'highcharts',
						zoomType: 'x',
						events: {
							load: function (event) {
								//When is chart ready?
								console.log("Loaded chart: " + this); //this refers to the loaded chart.
							}
						}
					},
					title: {
						text: seriesname
					},
					subtitle: {
						text: "x_g(t)=y(t)" + eqleft5.substring(22) + InputInfo,
					},
					xAxis: {
						title: {
							text: 'time t in seconds'
						},
					},
					yAxis: {
						//	categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
						labels: {
							formatter: function () {
								if (0 === this.value) {
									return '<span style="fill: magenta;">' + this.value + '</span>';
								} else {
									return this.value;
								}
							}
						},
						title: {
							text: 'x in meter, y = x(t)',
						},
					},

					series: [{
							name: "x_g(t)=y(t)",
							id: "Step_resonse",
							animation: true, // false macht Bild auf ein Schlag, true man sieht wies gemalt wird.
							data: all_data[0]// enthält erg die zu plottenden Daten
						}
					]
				});

			//adde Überschwingpfeil:
			var StartPunkt = [x_of_maxY, ystat]; //erst x dann y Wert.
			var EndPunkt = [x_of_maxY, maxY];
			var uebschw_name = "ü=" + ueberschw + "%";
			addLine(StartPunkt, EndPunkt, chart, uebschw_name, ' #f4c42e ', false);

			//Linie ystat:
			var ystat_name = "ystat=" + ystat;
			addLine([start_t, ystat], [end_t, ystat], chart, ystat_name, '#afa7a6', false);

			//5% Band:
			var band_name = Band + " % Band";
			addLine([start_t, ystat - Band / 100 * ystat], [end_t, ystat - Band / 100 * ystat], chart, band_name, '#d4d4aa', true);
			addLine([start_t, ystat + Band / 100 * ystat], [end_t, ystat + Band / 100 * ystat], chart, band_name, '#d4d4aa', true);

			//t_rise
			var t_rise_name = "t_rise: " + t_rise + " s";
			addLine([t_rise, ystat - Band / 100 * ystat], [t_rise, 0], chart, t_rise_name, '#4ed445 ', false);

			//t_settling
			var t_settling_name = "t_settling: " + t_settling + " s";
			addLine([t_settling, ystat - Band / 100 * ystat], [t_settling, 0], chart, t_settling_name, ' #44a43e ', false);

			//estat:
			var t_settling_name = "e_stat= " + roundd(((1 - ystat) / (ystat)) * 100, Rounding + 2) + "%";
			addLine([end_t - 1, ystat], [end_t - 1, 1], chart, t_settling_name, '  #b62514  ', false);

		}
	}

}

function ortskurve(m, b, k, k_p, k_d) {
	var data = ortskurvedata(m, b, k, k_p, k_d);
	console.log(data[0]);
	console.log(data[0][0]);
	console.log(data[0][0][0]);
	//TODO: write specific labels on points for w=0, w->infinity schnittpunkte mit achsen!
	//TODO: draw dottet IM line, RE line und ein label neben dran!
	//setze die 0,0 in die Mitte!
	var ort_chart = new Highcharts.Chart({
			chart: {
				renderTo: 'ortskurve',
				zoomType: 'y',
			},
			title: {
				text: "G(s)- Nyquist diagramm for w>0; omega>0"
			},
			//subtitle: {text: "subtitle....!",},
			xAxis: {
				title: {
					text: 'Real-RE(G(jw))'
				},
			},
			yAxis: {
				labels: {
					format: '{value} jw'
				},
				title: {
					text: 'Imag-IM(G(jw))',
				},
			},
			//labels: {
			//	items: [{html: "My custom label",
			//			style: {left: "100px",top: "100px"}}]
			//},
			/*  tooltip: {
			formatter: function () {
			//var point = this.points[0];
			return '<b>' + this.points[0].series.name + '</b>  w=' +this.points[0].config1+
			'<br/>' + this.points[0].x+ '<br/>'+ this.points[0].y + ' jw';
			},
			shared: true //geht mit false nicht!
			},  */
			tooltip: {
				formatter: function () {
					return ' ' +
					'RE: ' + this.point.x + '<br />' +
					'IM: ' + this.point.y + '<br />' +
					'w: ' + this.point.config1;
				}
			},
			series: [{
					name: "G(jw),w>0",
					id: "ortskurve",
					animation: true, // false macht Bild auf ein Schlag, true man sieht wies gemalt wird.
					//data: data[0]// enthält erg die zu plottenden Daten
					data: (function () { // dieser Act ist nötig, damit noch 3 Wert also w angezeit werden soll im tooltip!
						// generate an array of random data
						var singledata = [],
						time = (new Date()).getTime(),
						i;

						for (i = 0; i < data[0].length; i += 1) {
							singledata.push({
								x: data[0][i][0],
								y: data[0][i][1],
								config1: data[0][i][2]
							});
						}
						return singledata;
					}
						())
				}
			]
		});

	// add lines / additional data:
	var real_axis_series = addLine([data[3], 0], [data[4], 0], ort_chart, "Real Axis", '#d4d4aa ', true, 'dot');
	var imag_axis_series = addLine([0, data[5]], [0, data[6] + (1 + data[6]) * 0.3], ort_chart, "Imag Axis", '#d4d4aa ', true, 'dot');

	//add labels:
	addLabel_onChart(ort_chart, real_axis_series.data[1], "RE", "rechts");
	addLabel_onChart(ort_chart, imag_axis_series.data[1], "IM");

	// add Points:
	var special_Points = data[7];
	var re_points = special_Points[0];
	var im_points = special_Points[1]; // bei den im_points ist der imaginäre Anteil 0

	//add Cross Points with axis:
	if (im_points.length >= 1) {
		for (var z = 0; z < im_points.length; z++) {
			var one_crossPoint = im_points[z];
			addPoint_onCart(ort_chart, [one_crossPoint[1], 0], "RE=" + one_crossPoint[1]+", IM=0" + "; w=" + one_crossPoint[0] + ";", "#009933", true, 'square');
		}
	}
	if (re_points.length >= 1) { // Schnittpunkt mit Imaginärer Achse hier ist der Realteil =0
		for (var z = 0; z < re_points.length; z++) {
			var one_crossPoint = re_points[z];
			addPoint_onCart(ort_chart, [0, one_crossPoint[1]], "RE=0, IM=" + one_crossPoint[1] + "; w=" + one_crossPoint[0] + ";", "#00ff55", true, 'square'); //hellgrüne Punkte
		}
	}

	// w=1, w=0 Punkte:
	var omegaeins_series=addPoint_onCart(ort_chart, data[8], "RE=" + data[8][0] + " IM=" + data[8][1] + " w=1", "#000066", true, 'circle'); //add w=1 // wichtig z.B. für Popov Ortskurve
	addPoint_onCart(ort_chart, [0, 0], "origin", "#b62514", true, 'circle'); //add origin.
	
	// add Durchlaufrichtung:
	var m_klein = addPoint_onCart(ort_chart,[data[9][1],data[9][2]],"Pfeil","white",false);
	var pointtt = m_klein.data[0];
    durchlaufrichtung(ort_chart,pointtt.plotX+ort_chart.plotLeft ,pointtt.plotY+ort_chart.plotTop);
}

function durchlaufrichtung(ort_chart,startx,starty){
	//TODO: Pfeilposition noch anpssen soll nicht genau auf w=1 sein und 
	// der pfeil sollte passend gedreht werden und es sollte genauer die Richtung untersucht werden!
ort_chart.renderer.path([
			// Line: -----
			//'M', 10, 0, 10, 10, //linie von unten nach oben!

			//  up < arrow
			'M', 0, 0,
			0, 10,
			-10, 0,
			0, -10,
			'Z'
		])
	.attr({
		fill: '#7cb5ec',
		'stroke-width': 1,
		stroke: 'black',
		zIndex: 13,
		transform: "translate(" + startx+ort_chart.plotLeft + "," + starty +ort_chart.plotTop+ ")" // hier STart position
	})
	.add();
	
	//ist die richtige position:
	//ort_chart.renderer.circle(startx+ort_chart.plotLeft,   starty+ort_chart.plotTop,  10).add();
}

function addPoint_onCart(chart, point, name, color, marker, symbol) {
	var series = chart.addSeries({
			data: [point],
			name: name,
			color: color,
			marker: {
				enabled: marker,
				symbol: symbol //'square'
			}
		});
	return series;
}

function addLabel_onChart(chart, data, name, parameter) {
	var xValue = 0;
	var yValue = 0;
	if (parameter == "rechts") {
		xValue = -15;
		yValue = -25;
	} else {
		xValue = 10;
		yValue = -15;
	}

	var point = data;
	text = chart.renderer.text(
			name,
			point.plotX + chart.plotLeft + xValue,
			point.plotY + chart.plotTop + yValue).attr({
			zIndex: 5
		}).add(),
	box = text.getBBox();

	chart.renderer.rect(box.x - 5, box.y - 5, box.width + 10, box.height + 10, 5)
	.attr({
		fill: '#FFFFEF',
		stroke: 'gray',
		'stroke-width': 1,
		zIndex: 4
	})
	.add();
}

function ortskurvedata(m, b, k, p, d) {
	// // p=k_p, d = k_d //−m∗ω​2​​+(k+k​d​​)∗jω+(k+k​p​​) / k_p+k_d*jw;

	var special_Points = []; //3D Array: special_points -> im Points, re points -> w, anderer wert
	var re_points = [];
	var im_points = [];
	special_Points.push(re_points);
	special_Points.push(im_points);

	var omegaeins = [];
	var steigung_m = [];// speichert ort der geringsten Steiung hier wird der Durchlaufrichtungspfeil angebracht:
						// m, re, im, w
	steigung_m.push([10,0,0,0]);

	var Schrittweite_w = 0.05; // wenn man das größer macht vorsicht!!!
	var Start = 0;
	var Ende = 10;

	var transfer_function_real = Array(((Math.abs(Start - Ende)) / Schrittweite_w) + 1); // +1 für den Endpunkt.
	var transfer_function_imag = Array(((Math.abs(Start - Ende)) / Schrittweite_w) + 1);
	var data = new Array(((Math.abs(Start - Ende)) / Schrittweite_w) + 1);

	console.log(m + " " + b + " " + k + " " + d + " " + p);
	var eq_str = "((p-(d*i*w))/(-m*w^2+(b+d)*i*w+(k+p)))";
	eq_str = eq_str.replace(/m/g, m);
	eq_str = eq_str.replace(/k/g, k);
	eq_str = eq_str.replace(/p/g, p);
	eq_str = eq_str.replace(/d/g, d);
	eq_str = eq_str.replace(/b/g, b);

	var vorher = eq_str;
	var w = 0.0;

	var transfer_function_real_sorted = Array(((Math.abs(Start - Ende)) / Schrittweite_w));

	for (var j = 0; j < (Math.abs(Start - Ende)) / Schrittweite_w; j++) {
		eq_str = eq_str.replace(/w/g, w);
		//console.log(math.eval(eq_str));		console.log(eq_str);

		transfer_function_real[j] = roundd(math.re(math.eval(eq_str)), 5);
		transfer_function_imag[j] = roundd(math.im(math.eval(eq_str)), 5);
		data[j] = [transfer_function_real[j], transfer_function_imag[j], w];
		
		transfer_function_real_sorted[j] = [Math.abs(transfer_function_real[j]), transfer_function_imag[j], w, j];

		//add special Points:
		//1. Fall dass Punkt genau auf Achse liegt dann ists einfach:
		if (transfer_function_real[j] == 0) {
			re_points.push([w, roundd(transfer_function_imag[j], 2)]); //Schnittpunkt mit Imaginärer Achse!
		}
		if (transfer_function_imag[j] == 0) {
			im_points.push([w, roundd(transfer_function_real[j], 2)]); //Schnittpunkt mit Reeller Achse!
		}
		
		//steigung:
		if(j>5 && steigung_m[length][0]>(Math.abs(transfer_function_imag[j-5]-transfer_function_imag[j]))/(Math.abs(transfer_function_real[j-5]-transfer_function_real[j])) ){
			steigung_m.splice(0,steigung_m.length-1);
			steigung_m.push([(Math.abs(transfer_function_imag[j-5]-transfer_function_imag[j]))/(Math.abs(transfer_function_real[j-5]-transfer_function_real[j])),transfer_function_real[j],transfer_function_imag[j],w]);
		}

		eq_str = vorher;
		w = roundd(w + Schrittweite_w, 5);
	}
	console.log(steigung_m);

	//special Points: Schnittpunkt mit Reeller Achse,
	//2. Fall: Punkte nahe der Schnittpunkte mit Im Achse etc. finden:
	//TODO noch anpassen dass das auch klappt mit mehreren Schnittpunkten der IM Achse!
	transfer_function_real_sorted = transfer_function_real_sorted.sort(); //sort
	var ww = transfer_function_real_sorted[0][2];
	var jj = transfer_function_real_sorted[0][3];
	console.log(transfer_function_real_sorted[0][2]);
	console.log(transfer_function_imag[jj]);

	re_points.push([ww, roundd(transfer_function_imag[jj], 2)]); // benutze nicht transfer_function_real_sorted denn das enthält nur positive Werte!

	//Adde enpunkt für w -> unendlich:
	w = 100000;
	eq_str = eq_str.replace(/w/g, w);
	transfer_function_real[transfer_function_real.length - 1] = roundd(math.re(math.eval(eq_str)), 5);
	transfer_function_imag[transfer_function_imag.length - 1] = roundd(math.im(math.eval(eq_str)), 5);
	data[data.length - 1] = [transfer_function_real[transfer_function_real.length - 1], transfer_function_imag[transfer_function_imag.length - 1]];

	//Adde Punkt: w=1:
	eq_str = vorher;
	w = 1;
	eq_str = eq_str.replace(/w/g, w);
	omegaeins.push(roundd(math.re(math.eval(eq_str)), 2));
	omegaeins.push(roundd(math.im(math.eval(eq_str)), 2));

	console.log(transfer_function_real);
	console.log(transfer_function_imag);
	console.log(data);

	//Bestimme Maximal werte zum zeichnen der grau gepunkteten IM, RE Achse.
	var max_Real = Math.max(...transfer_function_real);
	var min_Real = Math.min(...transfer_function_real);
	var max_Imag = Math.max(...transfer_function_imag);
	var min_Imag = Math.min(...transfer_function_imag);

	console.log(special_Points);
	console.log(data);
	return [data, transfer_function_real, transfer_function_imag, min_Real, max_Real, min_Imag, max_Imag, special_Points, omegaeins,steigung_m[0]];
}

function addLine(StartPunkt, EndPunkt, chart, name, color, marker, style) {

	// highcharts 15 error weil ich meine Daten nicht sortiere!
	var series = chart.addSeries({
			data: [StartPunkt, EndPunkt],
			name: name,
			dashStyle: style,
			color: color,
			marker: {
				enabled: marker
			}
		});
	return series;
	//ArrowUp(chart, EndPunkt, 0.9);
	//ArrowDown(chart, StartPunkt, 0.9);
}

function read_textarea() {
	//Input: Textarea
	//Output: speicher
	//     speicher[i]=m,b,k,k_p,k_d,x(0),dx(0),
	console.log("Read in Textarea line by line do not change line order!");

	var speicher = [];
	var textArea = document.getElementById("textarea1");
	var lines = textArea.value.split("\n");

	for (var j = 2; j < (lines.length); j++) {
		var zeile_j = lines[j];

		if (zeile_j[0] == "m" || zeile_j[0] == "b" || zeile_j[0] == "k" || zeile_j[0] == "x" || zeile_j[0] == "d" || zeile_j[0] == "t" || zeile_j[0] == "B" || zeile_j[0] == "x" || zeile_j[0] == "D" || zeile_j[0] == "R") {
			speicher.push(parseFloat(zeile_j.substring(zeile_j.lastIndexOf("=") + 1, zeile_j.lastIndexOf(";"))));
		}
	}
	console.log("Values of textarea: " + speicher)
	return speicher;
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
		//	connectNulls: true, (klappt irwie nicht)
		enableMouseTracking: false,
		showInLegend: false,
		//grouping: true klappt ebenfalls nicht....
	});
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
		//grouping: true
	});
}

function analyse_erg(erg, ystat) {
	// Diese funktion analysiert erg denn erg enhätlt die zu plottenden werte und zwar so: [[x1,y1],[x2,y2],....]
	//input array of array erg
	// output array:
	//ouput[0]=ystat

	var xWerte = new Array(erg.length);
	var yWerte = new Array(erg.length);
	var e_von_ystat = new Array(erg.length); // e ist die Abweichung vom ystat!
	var output = new Array(8);
	var t_rise_s_array = new Array(erg.length); // an stelle 1 steht erster Schnittpunkt = trise, an stelle 2 dieses Arrays steht tsettling time!
	var parameter = 0; // nur ein zählparameter!

	var maxY = 0;
	var x_of_maxY = 0;

	for (i = 0; i < erg.length; i++) {
		var a = erg[i];
		xWerte[i] = a[0];
		yWerte[i] = a[1];
		e_von_ystat[i] = Math.abs(ystat - yWerte[i]);

		if (yWerte[i] > maxY) {
			maxY = yWerte[i];
			x_of_maxY = xWerte[i];
		}

		//trise: //Wert 0.02 muss je nach Diskretisierung der x Achse angepasstwerden TODO!

		// Wert ist nah an untererer Grenze des Bandes dran!
		if (Math.abs(e_von_ystat[i] - 0.05 * ystat) <= 0.02) {

			//Wert liegt in oder auf dem 5% Band:
			if (yWerte[i] >= ystat - ystat * 0.05 && yWerte[i] <= ystat + ystat * 0.05) {
				t_rise_s_array[parameter] = xWerte[i];
				parameter++;
			}
		}

		//kommt danach noch ein Wert der außerhalb des Bandes liegt?:
		if (yWerte[i] < ystat - ystat * 0.05 || yWerte[i] > ystat + ystat * 0.05) {
			if (parameter > 1) {
				parameter--;
			}
		}

	}

	var ueberschw = roundd(((Math.abs(maxY - ystat)) / ystat) * 100, Rounding + 2); // Angabe in %, Wert immer positiv
	console.log("ü= " + ueberschw + "%");
	//var maxY = Math.max(...yWerte);

	console.log("maxY:  " + maxY);
	console.log("t of maxY: " + x_of_maxY);

	// berechne Abweichung e:
	console.log("e_von_ystat: " + e_von_ystat);

	//trise:
	console.log("t_rise: " + t_rise_s_array[0]);
	console.log("t_settling: " + t_rise_s_array[1]);

	output[0] = ystat;
	output[1] = maxY;
	output[2] = x_of_maxY;
	output[3] = ueberschw;
	output[4] = xWerte[0];
	output[5] = xWerte[xWerte.length - 1];
	output[6] = t_rise_s_array[0];
	output[7] = t_rise_s_array[1];

	return output;
}

function roundd(value, nachkommastellen) {
	var multiplier = Math.pow(10, nachkommastellen);
	return (Math.round(value * multiplier) / multiplier);
}

function berechneWerte1(C1, C2, lambda1, lambda2, xpat) {
	//D>0:
	//var eqleft5 = "x_g(t) = x_h(t)+x_p(t)="+C1+"e^{"+lambda1+"*t}+"+C2+"e^{"+lambda2+"*t}+"+xpat;
	var xWerte = new Array;
	var yWerte = new Array;

	var a = new Array;

	var t = Startwert_x_Achse;
	for (var z = Startwert_x_Achse; z < Endwert_x_Achse / Schrittweite_x_Achse; z++) {
		xWerte[z] = roundd(t, Rounding);
		yWerte[z] = roundd(C1 * Math.pow(e, lambda1 * t) + C2 * Math.pow(e, lambda2 * t) + xpat, Rounding + 2);
		a[z] = [xWerte[z], yWerte[z]];
		t = t + Schrittweite_x_Achse;
	}

	var ystat = roundd(C1 * Math.pow(e, lambda1 * End_t_fuer_ystat) + C2 * Math.pow(e, lambda2 * End_t_fuer_ystat) + xpat, Rounding + 8);
	console.log("ystat nach 50s: " + ystat);
	var output = new Array(5);
	output = analyse_erg(a, ystat);
	console.log(a);

	var all_data = new Array(2);
	all_data[0] = a;
	all_data[1] = output;

	return all_data;
}

function berechneWerte2(C1, C2, lambda1, xpat) {
	//eft5 = "x_g(t) = x_h(t)+x_p(t)=" + C1 + "e^{" + lambda1 + "*t}+t*" + C2 + "e^{" + lambda1 + "*t}+" + xpat;
	var xWerte = new Array;
	var yWerte = new Array;

	var a = new Array;

	var t = Startwert_x_Achse;
	for (var z = Startwert_x_Achse; z < Endwert_x_Achse / Schrittweite_x_Achse; z++) {
		xWerte[z] = roundd(t, Rounding);
		yWerte[z] = roundd(C1 * Math.pow(e, lambda1 * t) + C2 * Math.pow(e, lambda1 * t) + xpat, Rounding + 2);
		a[z] = [xWerte[z], yWerte[z]];
		t = t + Schrittweite_x_Achse;
	}

	console.log(a);

	console.log("Fall D=0 berechne Werte man hat dann kein Überschwingen! oder?")
	var ystat = roundd(C1 * Math.pow(e, lambda1 * End_t_fuer_ystat) + C2 * Math.pow(e, lambda1 * End_t_fuer_ystat) + xpat, Rounding + 8);
	console.log("ystat nach 50s: " + ystat);
	var output = new Array(5);
	output = analyse_erg(a, ystat);

	var all_data = new Array(2);
	all_data[0] = a;
	all_data[1] = output;

	return all_data;
}

function berechneWerte3(C1, C2, lambdar, lambdai, xpat) {
	//(C1, C2, lambdar, lambdai, lambdar);
	//var eqleft5 = "x_g(t) = x_h(t)+x_p(t)=" + C1 + "e^{" + vorfaktor + "*t} cos(" + endwert2 + "*t)
	//+" + C2 + "e^{" + vorfaktor + "*t} sin(" + endwert2 + "*t)+" + xpat;
	var xWerte = new Array;
	var yWerte = new Array;

	var a = new Array;

	var t = Startwert_x_Achse;
	for (var z = Startwert_x_Achse; z < Endwert_x_Achse / Schrittweite_x_Achse; z++) {
		xWerte[z] = roundd(t, Rounding + 2);
		yWerte[z] = roundd(C1 * Math.pow(e, lambdar * t) * Math.cos(lambdai * t) + C2 * Math.pow(e, lambdar * t) * Math.sin(lambdai * t) + xpat, Rounding + 2);
		a[z] = [xWerte[z], yWerte[z]];
		t = t + Schrittweite_x_Achse;
	}

	//Berechne Werte:
	var ystat = roundd(C1 * Math.pow(e, lambdar * End_t_fuer_ystat) * Math.cos(lambdai * End_t_fuer_ystat) + C2 * Math.pow(e, lambdar * End_t_fuer_ystat) * Math.sin(lambdai * End_t_fuer_ystat) + xpat, Rounding + 8);
	console.log("ystat nach 50s: " + ystat);
	var output = new Array(5);
	output = analyse_erg(a, ystat);

	var all_data = new Array(2);
	all_data[0] = a;
	all_data[1] = output;
	return all_data;
}

// Highcharts stuff:
(function (H) {}
	(Highcharts));

// Rendering: Blockschaltbild rechts:
//Infos: http://api.highcharts.com/highcharts/Renderer.image
// http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/renderer-rect/
//http://jsfiddle.net/Sly_cardinal/jm9moswu/1/
$(function () {
	var renderer = new Highcharts.Renderer(
			$('#block-diagramm')[0],
			600,
			150);
	addFigures(renderer);
});

function addFigures(renderer) {

	//addArrow(renderer);
	rectangle(renderer, 5, 5, 590, 140);
	var rect1 = addRect_and_Text(renderer, 200, 50, 2, "white", 1, "Regler", "15px");
	var rect2 = addRect_and_Text(renderer, 350, 50, 2, "white", 1, "Strecke", "15px");
	connect2Rects(renderer, rect1, rect2, "u(t)");

	var circle = addCircle(renderer, 100, 38, 10, "+-");
	connect2Rects(renderer, circle, rect1, "e(t)");

	connectCircleRect(renderer, circle, rect2, "y(t)");
}

function addRect_and_Text(renderer, posx, posy, cornerRadius, fillcolor, strokewidth, name, textsize) {
	//Adde Rechteck das mind. so lange ist wie der Name der drinnen stehen soll!
	//width height wird automatisch angepasst!

	var texttt = renderer.text(name, posx, posy)
		.css({
			fontSize: textsize
		})
		.attr({
			zIndex: 2
		}).add(),
	box = texttt.getBBox();

	var rect = renderer.rect(box.x - 5, box.y - 5, box.width + 10, box.height + 10, cornerRadius) //	rect (Number x, Number y, Number width, Number height, Number cornerRadius)
		.attr({
			'stroke-width': strokewidth,
			stroke: 'black',
			fill: fillcolor,
			zIndex: 1
		})
		.add();
	return rect;
}

function connectCircleRect(renderer, circle, rect, name) {
	var x1 = circle.getBBox().x;
	var y1 = circle.getBBox().y;
	var height1 = circle.getBBox().height;
	var width1 = circle.getBBox().width;
	var x2 = rect.getBBox().x;
	var y2 = rect.getBBox().y;
	var height2 = rect.getBBox().height;
	var width2 = rect.getBBox().width;

	//arrow von unten nach oben:
	addArrowUp(renderer, x1, y1 + 15, 80, 10);
	addText(renderer, x1 + 15, y1 + 60, "y(t)", "15px");

	addArrowRight(renderer, x2 + width2 - 10, y2 + height2 / 2 - 10, 150, 10);
	addText(renderer, x2 + width2 + 80, y2 + height2 / 2 - 5, "y(t)", "15px");

	//add Path:
	renderer.path([
			// Line: -----
			'M', x1 + 10, y1 + 15 + 70, x2 + width2 + 50, y1 + 15 + 70,
			'M', x2 + width2 + 50, y1 + 15 + 70, x2 + width2 + 50, y2 + height2 / 2,
		])
	.attr({
		fill: 'black',
		'stroke-width': 1,
		stroke: 'black',
		zIndex: 13,
	})
	.add();
}

function connect2Rects(renderer, rect1, rect2, name) {
	// connecte beide rects mit Pfeil von rect1->rect2
	// und schreibe einen Namen auf den Pfeil

	//vorgehen: wenn y wert gleich ist dann einfach pfeil von rect1 nach rect2
	var x1 = rect1.getBBox().x;
	var y1 = rect1.getBBox().y;
	var height1 = rect1.getBBox().height;
	var width1 = rect1.getBBox().width;
	var x2 = rect2.getBBox().x;
	var y2 = rect2.getBBox().y;
	console.log(x1 + " " + y1 + " " + height1 + " " + width1 + "  Rechteck " + x2 + " " + y2);

	addArrowRight(renderer, x1 - 10 + width1, y1 - 10 + height1 / 2, x2 - (x1 - 8 + width1), 10);
	addText(renderer, x1 - 10 + width1 + (x2 - (x1 - 8 + width1)) / 2, y1 - 5 + height1 / 2, name, "15px");
}

function addText(renderer, posx, posy, name, textsize) {
	renderer.text(name, posx, posy)
	.css({
		fontSize: textsize
	})
	.attr({
		zIndex: 2
	}).add();
}

function addCircle(renderer, posx, posy, radius, parameter) {
	//(Number centerX, Number centerY, Number radius)
	var circle = renderer.circle(posx, posy, radius)
		.attr({
			'stroke-width': 1,
			stroke: 'black',
			fill: 'white',
			zIndex: 3 // das heißt die Form ist ganz unten!
		})
		.add(),
	box = circle.getBBox();

	if (parameter == "+-") {
		addText(renderer, box.x - 25, box.y + 10, "+", "20px");
		addText(renderer, box.x + 18, box.y + 30, "-", "20px");

		addArrowRight(renderer, box.x - 80, box.y, 80, 8);
		addText(renderer, box.x - 60, box.y + 5, "w(t)", "15px");
	}

	return circle;
}

function rectangle(renderer, posx, posy, width, height) {
	renderer.rect(posx, posy, width, height, 1)
	.attr({
		'stroke-width': 3,
		stroke: 'black',
		fill: 'white',
		zIndex: 0 // das heißt die Form ist ganz unten!
	})
	.add();
}

function addArrowUp(renderer, startx, starty, width, aw) {
	//aw: länge der Pfeilspitze.
	renderer.path([
			//
			// 'L',
			//0, 10,
			//10, 20,
			//'Z',

			// Line: -----
			'M', 10, width - aw, 10, 10, //linie von unten nach oben!

			//  up ^ arrow
			'M', 15, 10,
			10, 5,
			5, 10,
			'Z'
		])
	.attr({
		fill: 'black',
		'stroke-width': 1,
		stroke: 'black',
		zIndex: 13,
		transform: "translate(" + startx + "," + starty + ")" // hier STart position
	})
	.add();

}

function addArrowRight(renderer, startx, starty, width, aw) {
	//aw: länge der Pfeilspitze.
	renderer.path([
			'M', 10, 0,

			// Left arrow: <
			// 'L',
			//0, 10,
			//10, 20,
			//'Z',

			// Line: -----
			'M', 10, 10,
			'L',
			width - aw, 10,

			// Right arrow: >
			'M', width - aw, 0,
			width, 10,
			width - aw, 20,
			'Z'
		])
	.attr({
		fill: 'black',
		'stroke-width': 1,
		stroke: 'black',
		zIndex: 3,
		transform: "translate(" + startx + "," + starty + ")" // hier STart position
	})
	.add();

}

/// Other stuff:
function Tests() {}

function hasWhiteSpace(s) {
	var z = 0;
	for (i = 0; i < s.length; i++) {
		if (s[i] == ' ') {
			z++;
		}
	}
	if (z == s.length) // zeile besteht nur aus leerzeichen -> löschen!
	{
		return 1;
	}
	return 0;
}

function get_zeilen_vektor_of_mat(matrix, indexxxx) {
	// matrix: vom Typ nerdamer
	//indexxxx: zahl die kleiner ist als max anzahl an Zeilen von der Matrix

	var matrixasString = matrix.text();
	var speicher = 'matrix([';

	for (var iiii = 0; iiii < get_anzahl_spalten_of_mat(matrix); iiii++) {
		var zeilenindex_i = nerdamer('matget(matrixasString,indexxxx,iiii)', {
				matrixasString: matrixasString,
				indexxxx: indexxxx,
				iiii: iiii
			}).text();
		speicher = speicher + zeilenindex_i + ',';
	}
	speicher = speicher.substring(0, speicher.length - 1) + '])';
	var ff = nerdamer(speicher);
	return ff;
}

function get_spalten_vektor_of_mat(matrix, indexxxx) {
	// matrix: vom Typ nerdamer
	//indexxxx: zahl die kleiner ist als max anzahl an Zeilen von der Matrix
	// ist ein stehender vektor! -> vom matrix typ!

	var matrixasString = matrix.text();
	var speicher = 'matrix([';

	for (var iiii = 0; iiii < get_anzahl_zeilen_of_mat(matrix); iiii++) {
		var zeilenindex_i = nerdamer('matget(matrixasString,iiii,indexxxx)', {
				matrixasString: matrixasString,
				indexxxx: indexxxx,
				iiii: iiii
			}).text();
		speicher = speicher + zeilenindex_i + '],[';
	}
	speicher = speicher.substring(0, speicher.length - 2) + ')';
	var ff = nerdamer(speicher);
	return ff;
}

function get_anzahl_zeilen_of_mat(matrix) {
	//TODO soll auch für vectoren funktionieren! - liegt oder steht der vector?
	// geht nur für liegende vektoren!!!
	// matrix as nerdamer type
	// return int:
	var matrixxxx = matrix.text();

	for (var zzzzz = 0; zzzzz < 2000; zzzzz++) {
		if (matrixxxx.includes('matrix')) {
			var d = nerdamer('matget(matrixxxx,zzzzz,0)', {
					matrixxxx: matrixxxx,
					zzzzz: zzzzz
				});
		} else {
			var d = nerdamer('vecget(matrixxxx,zzzzz)', {
					matrixxxx: matrixxxx,
					zzzzz: zzzzz
				});
		}
		if (d.text().length == 0) {
			return zzzzz;
		}
	}
}

function get_anzahl_spalten_of_mat(matrix) {
	// matrix as nerdamer type
	// return int:
	var matrixxxx = matrix.text();

	for (var zzzzz = 0; zzzzz < 2000; zzzzz++) {
		if (matrixxxx.includes('matrix')) {
			var d = nerdamer('matget(matrixxxx,0,zzzzz)', {
					matrixxxx: matrixxxx,
					zzzzz: zzzzz
				});
		} else {
			var d = nerdamer('vecget(matrixxxx,zzzzz)', {
					matrixxxx: matrixxxx,
					zzzzz: zzzzz
				});
		}
		if (d.text().length == 0) {
			return zzzzz;
		}
	}
}

// TODO geht nicht für matrizen!!!!
function set_spalten_vector_of_mat(matrix, vector, index) {
	// Bsp:  1 |0|0		5 |0|0
	//		 0 |1|0  -> 3 |1|0
	//		 0 |0|1		1 |0|1
	//matrix: nerdamer matrix variable
	//vector: nerdamer matrix stehend!!! z.B. nerdamer(matrix([1],[2],[3]));
	//index spalte die ersetzt werden soll: integer
	//return: matrix mit neuem vektor

	// Fehler behandlung:
	if (!vector.text().includes("matrix") || (get_anzahl_zeilen_of_mat(vector) > get_anzahl_zeilen_of_mat(matrix)) || index > get_anzahl_spalten_of_mat(matrix) || index < 0) {
		alert("ERROR");
		console.log("ERROR!!!!");
		return null;
	}

	var matrixasString = matrix.text();
	var vectorasString = vector.text();

	for (var zzzz = 0; zzzz < get_anzahl_zeilen_of_mat(vector); zzzz++) {
		var valueee = nerdamer('matget(vectorasString,zzzz,0)', {
				vectorasString: vectorasString,
				zzzz: zzzz
			}).text();
		//console.log(valueee);
		var d = nerdamer('matset(matrixasString,zzzz,index,valueee)', {
				matrixasString: matrixasString,
				zzzz: zzzz,
				index: index,
				valueee: valueee
			});
		matrixasString = d.text();
		//console.log(matrixasString);
	}
	return d;
}

// Highcharts davor:
/*
$(function () {
console.log("Plotting function wurde aufgerufen:");
console.log(erg);
console.log(erg.length);
if (erg.length > 1) {
a = erg;

console.log(a);

Highcharts.chart('highcharts', {
title: {
text: 'Plot: -5*Math.exp(-1*i)+5'
},
chart: {
defaultSeriesType: 'line',
events: {
load: function () {
erg = this; // `this` is the reference to the chart
}
}
},

xAxis: {
minPadding: 0.05,
maxPadding: 0.05,
min: 0
},
yAxis: {
min: 0
},
series: [{
data: a
}
]
});
}
}

//Function H to make an arrow: - works not that nice right now....
(function (H) {

var arrowCheck = false,
pathTag;

H.wrap(H.Series.prototype, 'drawGraph', function (proceed) {

// Now apply the original function with the original arguments,
// which are sliced off this function's arguments
proceed.apply(this, Array.prototype.slice.call(arguments, 1));
console.log("This object: in function H"+this);
console.log("This is the Graph information?!"+H.Series.prototype);

// used a bit of regex to clean up the series name enough to be used as an id
var arrowName = "arrow" + this.name.replace(/\W/g, "arrowname?").toLowerCase();
// console.log("----------->arrowName:"+arrowName)

var arrowLength = 16, // länge der Spitze
arrowWidth = 7, // Breite der sssspitze
series = this,
data = series.data,
len = data.length,
segments = data,
lastSeg = segments[segments.length - 1],
path = [],
lastPoint = null,
nextLastPoint = null;

// Ort des Pfeils:
if (lastSeg.y == 0) {
lastPoint = segments[segments.length - 2];
nextLastPoint = segments[segments.length - 1];
} else {
lastPoint = segments[segments.length - 1]; // hiermit verschiebt man den Pfeil.
nextLastPoint = segments[segments.length - 2]; // hier 1 und 2 dann ist der Pfeil am anfang!
}

var angle = Math.atan((lastPoint.plotX - nextLastPoint.plotX) /
(lastPoint.plotY - nextLastPoint.plotY));

if (angle < 0)
angle = Math.PI + angle;

path.push('M', lastPoint.plotX, lastPoint.plotY);

if (lastPoint.plotX > nextLastPoint.plotX) {

if (arrowCheck === true) {
//replaced 'arrow' with arrowName
pathTag = document.getElementById(arrowName);
if (pathTag != null) {
pathTag.remove(pathTag);
}
}

path.push(
'L',
lastPoint.plotX + arrowWidth * Math.cos(angle),
lastPoint.plotY - arrowWidth * Math.sin(angle));
path.push(
lastPoint.plotX + arrowLength * Math.sin(angle),
lastPoint.plotY + arrowLength * Math.cos(angle));
path.push(
lastPoint.plotX - arrowWidth * Math.cos(angle),
lastPoint.plotY + arrowWidth * Math.sin(angle),
'Z');
} else {

if (arrowCheck === true) {
//replaced 'arrow' with arrowName
pathTag = document.getElementById(arrowName);
if (pathTag != null) {
pathTag.remove(pathTag);
}
}

path.push(
'L',
lastPoint.plotX - arrowWidth * Math.cos(angle),
lastPoint.plotY + arrowWidth * Math.sin(angle));
path.push(
lastPoint.plotX - arrowLength * Math.sin(angle),
lastPoint.plotY - arrowLength * Math.cos(angle));
path.push(
lastPoint.plotX + arrowWidth * Math.cos(angle),
lastPoint.plotY - arrowWidth * Math.sin(angle),
'Z');
}

series.chart.renderer.path(path)
.attr({
fill: series.color,
id: arrowName //changed from 'arrow' to arrowName to enable more than one series with an arrow
})
.add(series.group);

arrowCheck = true;

});
}
(Highcharts))); */

/*
// Highcharts:
// y/x = 5/(s+1) ydot +y = 5 -> y(x)=c1 e^-x + 5 siehe auch: https://de.wikipedia.org/wiki/PT1-Glied
function berechneWerte() {
var xWerte = new Array;
var Schrittweite_x_Achse = 0.1;
var Startwert_x_Achse = 0;
var Endwert_x_Achse = 10;

var yWerte = new Array;

var a = new Array;

var i = Startwert_x_Achse;
for (var z = Startwert_x_Achse; z < Endwert_x_Achse / Schrittweite_x_Achse; z++) {
xWerte[z] = i;
yWerte[z] = -5 * Math.exp(-1 * i) + 5;
a[z] = [xWerte[z], yWerte[z]];
i = i + Schrittweite_x_Achse;
}
console.log(a);
return a;
}

function berechneWerte1(C1,C2,lambda1,lambda2,xpat) {
//var eqleft5 = "x_g(t) = x_h(t)+x_p(t)="+C1+"e^{"+lambda1+"*t}+"+C2+"e^{"+lambda2+"*t}+"+xpat;
var xWerte = new Array;
var Schrittweite_x_Achse = 0.1;
var Startwert_x_Achse = 0;
var Endwert_x_Achse = 10;
var e= 2.71828182846;
var yWerte = new Array;

var a = new Array;

var t = Startwert_x_Achse;
for (var z = Startwert_x_Achse; z < Endwert_x_Achse / Schrittweite_x_Achse; z++) {
xWerte[z] = t;
yWerte[z] = C1*Math.pow(e,lambda1*t)+C2*Math.pow(e,lambda2*t)+xpat;
a[z] = [xWerte[z], yWerte[z]];
t = t + Schrittweite_x_Achse;
}
console.log(a);
return a;
}

$(function () {
console.log("Hallo Ich wurde aufgerufen!");
console.log(erg1);
console.log(erg1.length);
if(erg1.length>1){
a = erg1;

console.log(a);

Highcharts.chart('highcharts', {
title: {
text: 'Plot: -5*Math.exp(-1*i)+5'
},
chart: {
defaultSeriesType: 'line',
events: {
load : function () {
erg1 = this; // `this` is the reference to the chart
}
}
},

xAxis: {
minPadding: 0.05,
maxPadding: 0.05,
min: 0
},
yAxis: {
min: 0
},
series: [{
data: a
}
]
});
}}); */

//var e = nerdamer('diff(C1*e^(lambdar*t)*cos(t*lambdai)+C2*e^(lambdar*t)*sin(t*lambdai),t)',{lambdar:lambdar,lambdai:lambdai,C1:C1,C2:C2});
//	console.log(e.text()); // a= -0.91602*-e^(-0.5*t)*sin(1.26*t)+0.144*e^(-0.5*t)*sin(1.26*t)+0.36288*-e^(-0.5*t)*cos(1.26*t)+0.3635*cos(1.26*t)*e^(-0.5*t) seems to work ....


//Das ist eigentlich nicht nötig da das überschwingen sich einfach immer auf den maximalen Wert beziehet!
// replace in a each e with 2.71859
//var sol = nerdamer.solveEquations('-0.91602*-2.71859^(-0.5*t)*sin(1.26*t)+0.144*2.71859^(-0.5*t)*sin(1.26*t)+0.36288*-2.71859^(-0.5*t)*cos(1.26*t)+0.3635*cos(1.26*t)*2.71859^(-0.5*t)=0','t');
//console.log("PROBLEM:!!! Funktioniert nicht!:: "+sol.toString());// -49403/106425644,-49403/106425644 which is 0.000464   that is not what I want!
// the solution should actually be: 2.4 at 2.4 seconds there should be a local maxima see graph!


//var dd = nerdamer.solveEquations('x^2+4-y', 'y');
//console.log(dd[0].text());
