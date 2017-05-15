function plot_Gleichung(){
	
	var aap = nerdamer('matrix([x, y], [a, b])'); //this has index 1
	var aab = nerdamer('matrix([1,2], [3,4])'); //this has index 2
	console.log(aap.text());
	console.log(aab.text());
	
	console.log("Testing Nerdamer Multiply")
	var M = multiplyStoredMatrices(1, 2);
	console.log(M.text());
	//output: matrix([3*y+x,2*x+4*y],[3*b+a,2*a+4*b])
	console.log(getElement(M, 0, 1).text()+"\n \n");
	//output: 2*x+4*y

	
	
	// Aufruf wenn Button gedrückt:
	var e = nerdamer('x^2+2*(cos(x)+x*x)');
	console.log("Hallo");
	console.log(e.text());
	
	var d = nerdamer('matrix([x,la],[la,x])*matrix([1,0],[0,0])')
	console.log(d.text());
	
	var h = Rot_x(3.14159);
	console.log(h.text());
	
	var f = Rot_x('qqqq');
	console.log(f.text());
	
	var l = Trans_x('la');
	console.log(l.text());
	
	var x = Trans_x(5);
	console.log(x.text());
	
	
	var a = 'matrix([x,la],[la,x])';
	var b = 'matrix([x,la],[la,x])';
	console.log("\n Einfache Matrix Multiplikation: \n"+a+"*\n"+b);
	var y =nerdamer('a*b',{a:a},{b:b}); 
	console.log(y.text());
	console.log("richtige Lösung: "+nerdamer("matrix([x,la],[la,x])*matrix([x,la],[la,x])").text());
	
	console.log('Multiplication von h*f:'+'\n'+h.text()+'  \n * \n'+f.text()); 
	var c = Ausgabe_Matrix_Text_zuEingabeMatrixText(h.text());
	var d = Ausgabe_Matrix_Text_zuEingabeMatrixText(f.text());
	console.log("Type of h  "+typeof c+" Variable h: \n"+c);
	console.log("Type of f  "+typeof d+" Variable f: \n"+d);
	//var q = nerdamer('c*d',{c:c},{d:d});
	//console.log(q.text());
/* 	
	console.log("\n Rotationsmatrix f zu T_Rot: f: \n"+f.text());
	var j = Rot_in_T(f);
	//console.log(j.text());
	
	console.log("\n Translations vektor x in T  \n"+x.text());
    var jji = Trans_in_T(x);
	console.log(jji.text());
	
	console.log("Testing more: ")
	var trans =Trans_in_T(Trans_z("ddd"));
	console.log(trans.text());
	
	console.log("\n 0T_1 = Rot(z,thetai)*Trans(0,0,di)*Trans(ai,0,0)*Rot(x,alphai) \n ")
	console.log("\n Berechne Rot(z,theta)*Trans(0,0,di)=rot*trans ")
	var rot = Rot_in_T(Rot_z("theta")); 
	var trans =Trans_in_T(Trans_z("di")); 
	console.log(rot.text()+" \n * \n"+trans.text());
	var ccc = Ausgabe_Matrix_Text_zuEingabeMatrixText(rot.text());
	var ddd =Ausgabe_Matrix_Text_zuEingabeMatrixText(trans.text());
	console.log(ccc);
	console.log(ddd);
	console.log("\n richtige Lösung: ");
	console.log(nerdamer('matrix([1,0,0,0],[0,1,0,0],[0,0,1,di],[0,0,0,1])*matrix([cos(theta),-sin(theta),0,0],[sin(theta),cos(theta),0,0],[0,0,1,0],[0,0,0,1])').text()); 
	console.log("\n meine richtige Lösung: ")
	var zusammen =ccc+"*"+ddd;
	var yyyy = nerdamer(zusammen);
	console.log(yyyy.text());
	
	
	
	
	console.log("\n Lies Textfeld ein und verarbeite daten")
	
	var textArea = document.getElementById("Gleichung");
    var lines = textArea.value.split("\n");
	
	var theta = [];
	var d = [];
	var a = [];
	var alpha = [];
	
	//TODO: Hier noch -1 evtl. ändern!
	for(var j = 2;j<(lines.length);j++){
	var zeile_T = lines[j];
	// i | theta_i | d_i | a_i | alpha_i |
	// Lies aus Zeile T folgendes aus: theta_i, di, ai, alphai
    
	var indices = [];
		for(var i=0; i<zeile_T.length;i++) {
			if (zeile_T[i] === "|") indices.push(i);
		}
		
	var theta_i = zeile_T.substring(indices[0]+1,indices[1]);
	theta_i = theta_i.replace(/ /g,"");
	theta.push(theta_i);
	
	var d_i = zeile_T.substring(indices[1]+1,indices[2]);
	d_i = d_i.replace(/ /g,"");
	d.push(d_i);
	
	var a_i = zeile_T.substring(indices[2]+1,indices[3]);
	a_i = a_i.replace(/ /g,"");
	a.push(a_i);
	
	var alpha_i = zeile_T.substring(indices[3]+1,indices[4]);
	alpha_i = alpha_i.replace(/ /g,"");
	alpha.push(alpha_i);
	
	console.log(theta_i+" "+d_i+" "+a_i+" "+alpha_i);
	}
	
	
	console.log("\n Theta: "+theta[0]+" "+theta[1]+" "+theta[2]+"  "+theta[3]+" "+theta.length);
	console.log("vorsicht wenn theta[3] nicht undefined lösche entsprechend leerzeilen in obigem TextArea feld!");
	
	console.log("\n Berechne Rotationen mit theta, d, a, alpha arrays:");
	var T = [];
	for(var z=0;z<theta.length;z++){
		T[z] = berechne__n_minus_1_T_i(theta[z],d[z],a[z],alpha[z]);
		console.log( (z)+"T"+(z+1)+": \n"+T[z].text());
	}
	
	// 
	console.log("Wenn ein Problem weiter als hier dann leerzeilen in EINGABE FELD LÖSCHEN!!!")
	console.log("Test: 0T2: \n"+berechne_null_T_i(T,T[0],2,2,0).text());
	console.log("Test: 0T3: \n"+berechne_null_T_i(T,T[0],3,3,0).text());
	
	//console.log(berechne_null_T_i(T,T[0],3,3,0).text());
	console.log(Ausgabe_Matrix_Text_zuEingabeMatrixText(berechne_null_T_i(T,T[0],3,3,0).text()));
	
	
	
	var abc = nerdamer('matrix([cos(q2),0,sin(q2),cos(q2)*la],[0,1,0,q3],[-sin(q2),0,cos(q2),-la*sin(q2)+q1],[0,0,0,1])').toTeX();
	console.log(abc);
	//console.log(nerdamer(Ausgabe_Matrix_Text_zuEingabeMatrixText(berechne_null_T_i(T,T[0],3,3,0).text())).toTeX());
	 */
	// nerdamer zu latex funktioniert nicht für matrizen!!! -> CODE anpassen!
	var LaTeX = nerdamer('matrix([1,0],[0,1])').toTeX();
	console.log(LaTeX);
	
	return LaTeX;
}	

function berechne_null_T_i(T,null_T_i,i,z,d){
	// rekursive Funktion Übergabe Parameter:
	// T       : T vektor als nerdamer objekt das i-1T_i für i=0 bis i=n enthält
	// null_T_i: enthält am anfang einfach T[0] bzw. 0T1
	// i       : gibt den Index an bis zu dem man die Matrix berechnen möchte
	// z       : Gibt an wie lange die Schleife durchlaufen wird. Am Anfang ist i=z
	// d       : Parameter der hochzählt ist am Anfang immer 0!
	
	// ges: 0_T_i -> diese Methode gibt 0_T_i als nerdamer zurück.
	// Eingabe: Matrix von i-1_T_i von i = 1 bis i=n	
	if(i==1)
		return T[0];
	if(i==0)
		return 0; //0T0 ist immer eig. eine 0 Matrix!
	
	if(i>T.length){
		alert("Error!!!!! \n 0T"+i+" kann nicht berechnet werden");
		return 0; 
	}
	
	while(z>1){
		null_T_i= produkt_zweier_Matrizen(null_T_i,T[d+1]);
		return berechne_null_T_i(T,null_T_i,i,(z-1),(d+1));
	}
	return null_T_i;
}

function produkt_zweier_Matrizen(M1,M2){
	//Input zwei matrizen als nerdamer objekte
	// output Ergebnismatrix als nerdamer objekt
	var a = Ausgabe_Matrix_Text_zuEingabeMatrixText(M1.text());
	var b = Ausgabe_Matrix_Text_zuEingabeMatrixText(M2.text());
	
	var zusammen =a+"*"+b;
	var yyyy = nerdamer(zusammen);
	return yyyy;
}

// Rotationen:
function Rot_x(theta){
	if (isNaN(parseFloat(theta))){
		// theta ist symbolisch:
		var d = nerdamer('matrix([1,0,0],[0,cos(theta),-sin(theta)],[0,sin(theta),cos(theta)])',{theta:theta});
	}
	
	else {
	var a = Math.round(Math.cos(theta)*100)/100;
	var b = Math.round((Math.sin (theta))*100)/100;
	var str = 'matrix([1,0,0],[0,aaa,-b],[0,b,aaa])';
	str = str.replace(/aaa/g,a);
	str = str.replace(/b/g,b);
	var d = nerdamer(str);
	}
	
	return d;
}

function Rot_z(theta){
	if (isNaN(parseFloat(theta))){
		// theta ist symbolisch:
		var d = nerdamer('matrix([cos(theta),-sin(theta),0],[sin(theta),cos(theta),0],[0,0,1])',{theta:theta});
	}
	
	else {
	var a = Math.round(Math.cos(theta)*100)/100;
	var b = Math.round((Math.sin (theta))*100)/100;
	var str = 'matrix([aaa,-b,0],[b,aaa,0],[0,0,1])';
	str = str.replace(/aaa/g,a);
	str = str.replace(/b/g,b);
	var d = nerdamer(str);
	}
	
	return d;
}

// Translationen:
function Trans_x(d){
	var str = 'matrix([d],[0],[0])';
	str = str.replace("d",d);
	var p = nerdamer(str);
	return p;
}

function Trans_z(d){
	var str = 'matrix([0],[0],[d])';
	str = str.replace("d",d);
	var p = nerdamer(str);
	return p;
}

function Rot_in_T(Rot){
	// liest Rot als nerdamer variable ein
	// gibt Rot als nerdamer variable zurück.
	
	var str_Rot = Rot.text();
	var res = str_Rot.replace(/\r?\n|\r/g, "") ;
	var res = res.replace(/],/g, ",0],"); 
	res = res.replace(/]$/, ",0],[0,0,0,1]") ;
	 

	var erg = Ausgabe_Matrix_Text_zuEingabeMatrixText(res);
	var alsnerd = nerdamer('erg',{erg:erg});
	return alsnerd;
}

function Trans_in_T(trans){
	//liest trans als nerdamer variable ein
	//gibt trans als nerdamer variable zurück.
	
	var res= trans.text();
	res=res.replace(/\r?\n|\r/g, "") ;
	
	//get x y z aus trans:
	var indices_Klammer_auf = [];
		for(var i=0; i<res.length;i++) {
			if (res[i] === "[") indices_Klammer_auf.push(i);
		}
	
	var indices_Klammer_zu = [];
		for(var i=0; i<res.length;i++) {
			if (res[i] === "]") indices_Klammer_zu.push(i);
		}
	
	var trans_x = res.substring(indices_Klammer_auf[0]+1,indices_Klammer_zu[0]);
	var trans_y = res.substring(indices_Klammer_auf[1]+1,indices_Klammer_zu[1]);
	var trans_z = res.substring(indices_Klammer_auf[2]+1,indices_Klammer_zu[2]);	
	
	var erg = "[1,0,0,trans_x],[0,1,0,trans_y],[0,0,1,trans_z],[0,0,0,1]"
	erg = erg.replace("trans_x",trans_x);
	erg = erg.replace("trans_y",trans_y);
	erg = erg.replace("trans_z",trans_z);
	
	//Umformen und zurückgeben.
	erg = Ausgabe_Matrix_Text_zuEingabeMatrixText(erg);
	var alsnerd = nerdamer('erg',{erg:erg});
	return alsnerd;
}

function replaceIndex(string, at, repl) {
   return string.replace(/\S/g, function(match, i) {
        if( i === at ) return repl;

        return match;
    });
}

function Ausgabe_Matrix_Text_zuEingabeMatrixText(inputMatrixString){
	// Forme soetwas: 
	//[1,0,0],
    //[0,-1,-b],
    //[0,b,-1] 
	// um zu: 'matrix([x,la],[la,x])'
	
	//1. Lösche alle /N raus!
	var res = inputMatrixString.replace(/\r?\n|\r/g, "");	
	// 2. Hänge hinten eine Klammer zu an.
	var res = res.replace(/]$/, "])") ;
	//3. ändere erstes Vorkommen von [
	var res = res.replace('[','matrix([');
	return res;
}

function berechne__n_minus_1_T_i(theta_i,di,ai,alpha_i){
	// Eingabeparameter sind strings!
	
	// console.log("\n 0T_1 = Rot(z,thetai)*Trans(0,0,di)*Trans(ai,0,0)*Rot(x,alphai) \n ")
	var trans_z =Trans_in_T(Trans_z(di)); 
	var rot_z = Rot_in_T(Rot_z(theta_i)); 

	var trans_x = Trans_in_T(Trans_x(ai)); 
	var rot_x =Rot_in_T(Rot_x(alpha_i)); 

	var a = Ausgabe_Matrix_Text_zuEingabeMatrixText(rot_z.text());
	var b =Ausgabe_Matrix_Text_zuEingabeMatrixText(trans_z.text());
	
	var c =Ausgabe_Matrix_Text_zuEingabeMatrixText(rot_x.text());
	var d =Ausgabe_Matrix_Text_zuEingabeMatrixText(trans_x.text());
	
	
	var zusammen =a+"*"+b+"*"+d+"*"+c;
	var erg = nerdamer(zusammen);
	
	//console.log(rot_z.text());console.log(trans_z.text());
	//console.log(trans_x.text()); console.log(rot_x.text());
	return erg; 
}

function multiplyStoredMatrices(index1, index2) {
    var a = nerdamer.getExpression(index1).symbol;
    var b = nerdamer.getExpression(index2).symbol;
    var core = nerdamer.getCore();
    return core.PARSER.multiply(a, b);
}

function getElement(matrix, i, j) {
    return matrix.elements[i][j];
}
