// Global Things:
// Autoformat: Plugins JS-Tools - format STR+ALT+M


function berechneDH() {

	// sobald ein Test fehlschlägt dann nicht neuen nerdamer code benutzen!!!
	//Tests();

	//1. Lies TextArea ein:
	theta_d_a_alpha = einlesen();
	console.log(theta_d_a_alpha);

	theta = theta_d_a_alpha[0];
	d = theta_d_a_alpha[1];
	a = theta_d_a_alpha[2];
	alpha = theta_d_a_alpha[3];

	console.log("\n Berechne Rotationen mit theta, d, a, alpha arrays:");

	var T = [];
	var zw = [];
	var erg = "";
	var erg2 = "";
	var b = 0;
	var aaa = "";
	for (var z = 0; z < theta.length; z++) {
		T[z] = berechne_n_minus_1_T_i(theta[z], d[z], a[z], alpha[z]);
		console.log((z) + "^T_" + (z + 1) + ": \n" + T[z].text());
		erg = erg + "{}^{" + z + "}T_{" + (z + 1) + "}" + "=" + T[z].toTeX() + "";

		if (b == 0) {
			aaa = "{}^{" + z + "}T_{" + (z + 1) + "}" + "=" + T[z].toTeX() + "\\qquad";
		} else {
			aaa = aaa + "{}^{" + z + "}T_{" + (z + 1) + "}" + "=" + T[z].toTeX() + "";
			var aa = String.raw `${aaa}`;

			var diveq_i = document.createElement("div");
			//diveq_i.innerHTML = String.raw` data-expr="" `;
			diveq_i.setAttribute('class', 'equation');
			//diveq_i.setAttribute("data-expr", "");
			diveq_i.id = "eq" + z;
			document.getElementById("eq").appendChild(diveq_i); // füge es an der richtigen Stelle ein!


			document.getElementById("eq" + z).setAttribute("data-expr", aa);
			//console.log(document.getElementById("eq" + z));
			var tex = document.getElementById("eq" + z);

			katex.render(aa, tex);
			b = 0;
			aaa = "";
		}

		b++;
	}
	zw = T;

	// T enthält 0T1,0T2,0T3
	b = 0;
	for (var i = 1; i < T.length; i++) {
		T[i] = nerdamer('aaaa*bbbb', {
				aaaa: T[i - 1].text(),
				bbbb: T[i].text()
			});

		if (b == 0) {
			erg2 = "{}^{0}T_{" + (i + 1) + "}" + "=" + T[i].toTeX() + "  \\quad"; //wichtig \\ da ein \ irwie eh gelöscht wird
		} else {
			erg2 = erg2 + "{}^{0}T_{" + (i + 1) + "}" + "=" + T[i].toTeX() + "  \\quad"; //wichtig \\ da ein \ irwie eh gelöscht wird
			var aa = String.raw `${erg2}`;

			var diveq_i = document.createElement("div");
			//diveq_i.innerHTML = String.raw` data-expr="" `;
			diveq_i.setAttribute('class', 'equation');
			//diveq_i.setAttribute("data-expr", "");
			diveq_i.id = "eq" + z;
			document.getElementById("eq").appendChild(diveq_i); // füge es an der richtigen Stelle ein!


			document.getElementById("eq" + z).setAttribute("data-expr", aa);
			//	console.log(document.getElementById("eq" + z));
			var tex = document.getElementById("eq" + z);

			katex.render(aa, tex);
			b = 0;
			erg2 = "";
		}

		b++;

		//console.log(T[i].text());
	}
}

function Tests() {
	console.log("Some tests:");

	console.log(berechne_n_minus_1_T_i("0", "d", "0", "0").text());

	console.log('Test1: in 4x4 einheitsmatrix vekor 3,4,w als Spaltenvektor an Stelle 4 einfügen:')
	console.log(set_spalten_vector_of_mat(nerdamer('imatrix(4)'), nerdamer('matrix([3],[4],[w])'), 3).text());

	console.log("Immer stehende matrizen und liegende vektoren als mat eingeben:")
	console.log(nerdamer('matrix([1,0,0])').text());
	//TODO: als matrix stehende und liegende Vektoren behandeln?!
	// ligende Vektoren als matrix machen und stehende auch als matrix machen!
	console.log(nerdamer('matrix([1],[0],[0])').text());

	// TODO: geht noch nicht:
	console.log('[1,0,0,0,0]'); // liegende vektoren als matrizen implementieren?!
	console.log(get_anzahl_zeilen_of_mat(nerdamer('matrix([1,0,0,0,0])'))); //-> geht nicht müssen 2 sein!
	console.log(get_anzahl_spalten_of_mat(nerdamer('[1,0,0,0,0]')));

	// TODO: stehender Vector gibt es nicht?!
	console.log('([1],[2],[3])');
	console.log(get_anzahl_zeilen_of_mat(nerdamer('matrix([1],[2],[3])')));
	console.log(get_anzahl_spalten_of_mat(nerdamer('matrix([1],[2],[3])')));

	console.log(get_anzahl_zeilen_of_mat(nerdamer('matrix([1,0],[1,0],[2,0],[8,9])')));
	console.log(get_anzahl_spalten_of_mat(nerdamer('matrix([1,0],[1,0],[2,0],[8,9])')));

	console.log('matrix([1,0],[1,0],[2,0],[8,9])');
	console.log(get_zeilen_vektor_of_mat(nerdamer('matrix([1,0],[1,0],[2,0],[8,9])'), 2).text());
	console.log(get_spalten_vektor_of_mat(nerdamer('matrix([1,0],[1,0],[2,0],[8,9])'), 1).text());

	console.log("\n all tests successfull!")
}

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

function einlesen() {
	console.log("\n Lies Textfeld ein und verarbeite daten")

	var textArea = document.getElementById("Gleichung");
	var lines = textArea.value.split("\n");

	var theta = [];
	var d = [];
	var a = [];
	var alpha = [];

	for (var j = 2; j < (lines.length); j++) {
		//lösche leere Zeile
		if (hasWhiteSpace(lines[j]) == 1) {
			break;
		}

		var zeile_T = lines[j];
		// i | theta_i | d_i | a_i | alpha_i |
		// Lies aus Zeile T folgendes aus: theta_i, di, ai, alphai

		var indices = [];
		for (var i = 0; i < zeile_T.length; i++) {
			if (zeile_T[i] === "|")
				indices.push(i);
		}

		var theta_i = zeile_T.substring(indices[0] + 1, indices[1]);
		theta_i = theta_i.replace(/ /g, "");
		theta.push(theta_i);

		var d_i = zeile_T.substring(indices[1] + 1, indices[2]);
		d_i = d_i.replace(/ /g, "");
		d.push(d_i);

		var a_i = zeile_T.substring(indices[2] + 1, indices[3]);
		a_i = a_i.replace(/ /g, "");
		a.push(a_i);

		var alpha_i = zeile_T.substring(indices[3] + 1, indices[4]);
		alpha_i = alpha_i.replace(/ /g, "");
		alpha.push(alpha_i);

		console.log(theta_i + " " + d_i + " " + a_i + " " + alpha_i);
	}

	return [theta, d, a, alpha];
}


// Rotationen:
function Rot_x(theta) {
	if (isNaN(parseFloat(theta))) {
		// theta ist symbolisch:
		var d = nerdamer('matrix([1,0,0],[0,cos(theta),-sin(theta)],[0,sin(theta),cos(theta)])', {
				theta: theta
			});
	} else {
		var a = Math.round(Math.cos(theta) * 100) / 100;
		var b = Math.round((Math.sin(theta)) * 100) / 100;
		var str = 'matrix([1,0,0],[0,aaa,-b],[0,b,aaa])';
		str = str.replace(/aaa/g, a);
		str = str.replace(/b/g, b);
		var d = nerdamer(str);
	}

	return d;
}

function Rot_z(theta) {
	if (isNaN(parseFloat(theta))) {
		// theta ist symbolisch:
		var d = nerdamer('matrix([cos(theta),-sin(theta),0],[sin(theta),cos(theta),0],[0,0,1])', {
				theta: theta
			});
	} else {
		var a = Math.round(Math.cos(theta) * 100) / 100;
		var b = Math.round((Math.sin(theta)) * 100) / 100;
		var str = 'matrix([aaa,-b,0],[b,aaa,0],[0,0,1])';
		str = str.replace(/aaa/g, a);
		str = str.replace(/b/g, b);
		var d = nerdamer(str);
	}

	return d;
}

// Translationen:
function Trans_x(xxxxx) {
	var str = 'matrix([xxxxx],[0],[0])';
	str = str.replace("xxxxx", xxxxx);
	var p = nerdamer(str);
	return p;
}

function Trans_z(ddddd) {
	var str = 'matrix([0],[0],[hallo])';
	str = str.replace("hallo", ddddd);
	var p = nerdamer(str);
	return p;
}

function Rot_in_T(Rot) {
	// liest Rot als nerdamer variable ein
	// gibt Rot als nerdamer variable zurück.

	var str_Rot = Rot.text();

	var T = nerdamer('imatrix(4)');
	var rotvec_x = get_spalten_vektor_of_mat(Rot, 0);
	var rotvec_y = get_spalten_vektor_of_mat(Rot, 1);
	var rotvec_z = get_spalten_vektor_of_mat(Rot, 2);
	var m = set_spalten_vector_of_mat(T, rotvec_x, 0);
	var m = set_spalten_vector_of_mat(m, rotvec_y, 1);
	var m = set_spalten_vector_of_mat(m, rotvec_z, 2);
	return m;
}

function Trans_in_T(posvec) {
	// liest Rot als nerdamer variable ein
	// gibt Rot als nerdamer variable zurück.
	// posvec: (liegend) [1,2,3]

	var T = nerdamer('imatrix(4)');
	T = set_spalten_vector_of_mat(T, posvec, 3);
	// console.log(posvec.text());
	// console.log("Aber"+T.text());
	return T;
}

function berechne_n_minus_1_T_i(theta_i, di, ai, alpha_i) {
	// Eingabeparameter sind strings!
	// ausgabe i-1Ti ist vom nerdamer typ.

	var trans_z = Trans_in_T(Trans_z(di));
	var rot_z = Rot_in_T(Rot_z(theta_i));

	var trans_x = Trans_in_T(Trans_x(ai));
	var rot_x = Rot_in_T(Rot_x(alpha_i));

	var erg = nerdamer('a*b*c*d', {
			a: rot_z.text(),
			b: trans_z.text(),
			c: trans_x.text(),
			d: rot_x.text()
		});
	return erg;
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
