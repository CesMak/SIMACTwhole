function myFunction1() {
	var halo = (document.getElementById("text").style.color);
	if(halo =="red"){
		 document.getElementById("text").style.color = "magenta";
	}
	else{
		document.getElementById("text").style.color = "red";
		window.alert("red");
	}
		
}

function myFunction2() {	
	var gewicht = document.getElementById('Feld1').value;
	var groeße = document.getElementById('Feld2').value;
	var ergebnis = Math.round( (Number(gewicht)*100)/(Number(groeße)*Number(groeße)))/100;
	document.getElementById('output1').innerHTML = ergebnis; 
}

function delete1(){
	document.getElementById("Feld1").value = "";
}

function delete2(){
	document.getElementById('Feld2').value = "";
}