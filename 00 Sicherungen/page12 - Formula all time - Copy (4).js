// Global Things:
// Autoformat: Plugins JS-Tools - format STR+ALT+M

var data = [];          //hier stehen die daten drinnen mit denen die Website gebaut wird
var datalength = 0;     //anzahl der containerboxen
var formelnummer = 0;   //wir zum builden und numeriern der id von den formeln benutzt beim builden des contents.

// erster Schritt: lade alle Daten des Local storage in data
// baue mit den Daten in data die komplette Website!

// Sobald Basis Website aufgebaut (DOM Elements loaded) wird diese Methode ausgführt:
document.addEventListener('DOMContentLoaded', function () {

	//0. when Document reloaded basic fill in fields:
	standardFillAddFields();

	//1. Speichere  in data: alle Objekte des LocalStorage
	if (localStorage.tblData) {
		data = JSON.parse(localStorage.tblData);
		datalength = data.length;
		console.log(data);
		console.log("\nObjekt Anzahl: " + datalength);
	}
	buildWebsiteContent();

}, false);

function buildWebsiteContent() {
	// Diese Funktion erstellt alle DOM elemente mit den Daten aus dem local storage.
	//TODO

	var index = 36;

	console.log(data[index]);

	console.log(data[index]["id"]);

	build_Head(data[index]["id"], data[index]["ue"], data[index]["kat1"], data[index]["kat2"]);

	build_Content(data[index]["id"], data[index]["Content1"]);

	myRenderer();
}

function build_Content(id, content) {
	var divcontent = document.createElement("DIV");
	divcontent.setAttribute("id", "divcontent" + id);
	document.getElementById("Containerboxneue").appendChild(divcontent);

	// parse the content:
	// Bsp - wenn: Text $\alpha$ Text
	// Text      <div id ="eqadd-i" class="equation-inline" data-expr="">    <script>katex.render("c =\\alpha", eqadd-i, {displayMode: false });</script> </div>      Text
	// ersetze jedes \ -> \\ und lösche jedes $ am Anfang und am Ende.

	parse(id, content) // TODO!!!
}

function create(htmlStr) {
	var frag = document.createDocumentFragment(),
	temp = document.createElement('div');
	temp.innerHTML = htmlStr;
	while (temp.firstChild) {
		frag.appendChild(temp.firstChild);
	}
	return frag;
}


function parse(id, content) {

	console.log("Input Text of id "+id+" \n"+content);

	// innerhalb von <p> ersezte:
	content = ersetze_alles_zwischen(content,"$$","$$"); // zwei formeln liefern kein substring problem
	
	content = ersetze_alles_zwischen(content,"$","$");
	
	content = ersetze_alles_zwischen(content,"-b(",")"); // zwei formeln liefern substring problem!
	
	content = ersetze_alles_zwischen(content,"-i(",")");
	
	content = ersetze_alles_zwischen(content,"-g(",")");

	content = ersetze_alles_zwischen(content,"-r(",")"); 
	
	content = ersetze_alles_zwischen(content,"-img(",")");
	
	content = ersetze_alles_zwischen(content,"-link(",")");
	
	content = ersetze_direkt(content,"-n");
	
	console.log("Parsed Text of id "+id+" \n"+content);

	var fragment = create(`<p id="p` + id + `" >` + content + "</p>");

	var position = document.getElementById("divcontent"+id); 	//var tex = document.getElementById("eqadddd"); 	//document.getElementById("eqadddd").setAttribute("dd", "hallo");
	position.insertBefore(fragment, position.childNodes[0]);    	//	katex.render(String.raw `${formel}`, tex);
	
	// testing:
	/* var test ="-r(das ist ein -b(Nachteil) in ROT)";
	var result = getFromBetween.get(test,"-r(",")");
	console.log(result); // rückgabe: "das ist ein -b(Nachteil"
	console.log(getLastKlammerzu("das ist ein -b(Nachteil) in ROT)"));
 */
	return content;
}

function ersetze_direkt(content,das_wird_ersetzt){
	if(das_wird_ersetzt=="-n"){
		content=content.replaceAll("-n","<br>");
		console.log(content);
	}
	return content;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function ersetze_alles_zwischen(content,zwischen1,zwischen2){
		// anfang loop
	var result = getFromBetween.get(content, zwischen1, zwischen2);
	for (var zz = 0; zz < result.length; zz++) {
		/* if(zz>0){
		result = getFromBetween.get(content, zwischen1, zwischen2);
		} */
		
		if (result[zz][0].length > 1) { // das 0 0 muss hier bleiben, da pro suchlauf result um eines kleiner wird! da ja die $$ ersetzt werden!
			var dazwischen = result[zz][0];

			//1. ersetze alle: String.fromCharCode(92) mit String.fromCharCode(92,92): -> Schritt nicht nötig.
			//var inhalt = ersetzealleCharacter(formel, String.fromCharCode(92), String.fromCharCode(92, 92)); // $$
			
			if(zwischen1=="$$"){
			var div_of_formel = `<div id ="eqadddd` + formelnummer + `" class="equation-middle" data-expr="` + dazwischen + `"> </div>`;
			}
			if(zwischen1=="$"){
				var div_of_formel = `<div id ="eqadddd` + formelnummer + `" class="equation-inline" data-expr="` + dazwischen + `"> </div>`;
			}
			if(zwischen1=="-b("&&zwischen2==")"){
				var div_of_formel = `<b>` + dazwischen + `</b>`;
			}
			if(zwischen1=="-i("){
				var div_of_formel = `<i>` + dazwischen + `</i>`;
			}
			if(zwischen1=="-g("){ //<font color="#ff9999">This is some text! in #ff9999 </font>   #cc3300
				var div_of_formel = `<font color="#33cc33">` + dazwischen + `</font>`;
			}
			if(zwischen1=="-r("&&zwischen2==")"){ //<font color="#ff9999">This is some text! in #ff9999 </font>   
				var div_of_formel = `<font color="#cc3300">` + dazwischen + `</font>`;
			}
			if(zwischen1=="-img("&&zwischen2==")"){ //<img id="img2" src="img/DH1.png"> 
				var div_of_formel = `<img id="img`+formelnummer+`" src="` + dazwischen + `">`;	
			}
			if(zwischen1=="-link("&&zwischen2==")"){ //<a href="https://www.w3schools.com/" target="_blank">linktext</a> 
				if(dazwischen[0]=="w"){ //+https://.www....
				var div_of_formel = `<a id="link`+formelnummer+`" href="https://` + dazwischen + `">`+dazwischen+`</a>`;	
				}
				if(dazwischen[0]=="h"){
				var div_of_formel = `<a id="link`+formelnummer+`" href="` + dazwischen + `">`+dazwischen+`</a>`;
				}
			}
			if(zwischen1=="-n"&&zwischen2==""){ //<img id="img2" src="img/DH1.png"> 
				var div_of_formel = `<br>`;	
			}

			content=content.replace(zwischen1+dazwischen+zwischen2,div_of_formel);
			formelnummer++;
		}
	} 
	return content;
}

function ersetzealleCharacter(str, str1, str2) {
	for (i = 0; i < str.length; i++) {
		//console.log(str[i]);
		//console.log(str[i]==str1);
		if (str[i] == str1) {
			str = setCharAt(str, i, str2)
				i++;
		}
	}
	return str;
}

function setCharAt(str, index, chr) {
	if (index > str.length - 1)
		return str;
	return str.substr(0, index) + chr + str.substr(index + 1);
}

var getFromBetween = {
	results: [],
	string: "",
	getFromBetween: function (sub1, sub2) {
		if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
			return false;
		var SP = this.string.indexOf(sub1) + sub1.length; //console.log(SP); //3
		var string1 = this.string.substr(0, SP);          //console.log(string1); //-r(
		var string2 = this.string.substr(SP);             //console.log(string2); //das ist ein -b(Nachteil) in ROT)
		var TP = string1.length + string2.indexOf(sub2);//geändet: var TP = string1.length + string2.indexOf(sub2);   console.log(TP);//26
		if(sub2==")"){
			TP=string1.length + getLastKlammerzu(string2);
		}
		//console.log(string2.indexOf(sub2)); // string2 ist vom startpunkt bis zum endpunkt.
		//console.log(sub2);
		return this.string.substring(SP, TP);
	},
	removeFromBetween: function (sub1, sub2) {
		if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
			return false;
		var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2; 
		//console.log(removal);
		//console.log(removal);//-r(das ist ein -b(Nachteil)
		//console.log(this.getFromBetween(sub1, sub2)); //das ist ein -b(Nachteil
		// removal sollte eigentlich sein: -r(das ist ein -b(Nachteil) in Rot)
		this.string = this.string.replace(removal, "");
	},
	getAllResults: function (sub1, sub2) {
		// first check to see if we do have both substrings
		if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
			return;
		
		//var result = [this.getFromBetween(sub1, sub2), this.string.indexOf(sub1),string1.length + getLastKlammerzu(string2)+sub2.length]; 
		var result = [this.getFromBetween(sub1, sub2), this.string.indexOf(sub1), this.string.indexOf(sub1) + this.getFromBetween(sub1, sub2).length + sub2.length + sub1.length]; 
		//var result = [this.getFromBetween(sub1,sub2),this.string.indexOf(sub1)+sub1.length,this.string.indexOf(sub2)];

		// push it to the results array
		this.results.push(result);
		// remove the most recently found one from the string
		this.removeFromBetween(sub1, sub2);

		// if there's more substrings
		if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
			//console.log(this.string.indexOf(sub1));
			//console.log(this.string.indexOf(sub2));
			
			
			this.getAllResults(sub1, sub2);
			//console.log("more substrings");
		} else
			//console.log("Fall ist eingetreten!"+sub1);
			return;
	},
	get: function (string, sub1, sub2) {
		this.results = [];
		this.string = string;
		this.getAllResults(sub1, sub2);
		return this.results; // Ergebnis: das ist ein -b(Nachteil
	}
};

function getLastKlammerzu(string2){
	// Beispiel eines String zwei: das ist ein -b(Nachteil) in ROT) 
	//hier ist die erste klammer nicht mehr enthalten!
	var anzahl_klammer_auf=1;
	for(var j=0;j<string2.length;j++){
		if(string2[j]=="("){
			anzahl_klammer_auf++;
		}
		if(string2[j]==")"){
			anzahl_klammer_auf--;
		}
		if(anzahl_klammer_auf==0){
			return j;
		}
	}
}

function build_Head(id, ue, kat1, kat2) {

	//1. Add Überschrift: //(style wird automatisch durch h2 festgelegt!)
	var ueberschrift = document.createElement("H2");
	var ueberschrift_content = document.createTextNode(ue);
	ueberschrift.setAttribute("id", "ueberschrift" + id);
	ueberschrift.appendChild(ueberschrift_content);
	document.getElementById("Containerboxneue").appendChild(ueberschrift); //TODO Containerboxneue noch verallgemeinern damit immer hinten angehängt? oder alphabetisch!?

	//2. Add Bearbeiten etc. neben Überschrift
	var ueberschrift_unten = document.createElement("H3");
	var ueberschrift_unten_content = document.createTextNode("[Bearbeiten, Ausblenden, Bewegen, Markieren, Löschen]"); //TODO how to insert href in Ausblenden?
	ueberschrift_unten.setAttribute("id", "ueberschrift_unten" + id);
	ueberschrift_unten.appendChild(ueberschrift_unten_content);
	document.getElementById("Containerboxneue").appendChild(ueberschrift_unten); //TODO Containerboxneue noch verallgemeinern damit immer hinten angehängt? oder alphabetisch!?

	//3. Add Kategorie 1 und Kategorie 2:
	var kategorie2 = document.createElement("H4");
	var kategorie2_content = document.createTextNode(kat2);
	kategorie2.setAttribute("id", "kategorie2-" + id);
	kategorie2.appendChild(kategorie2_content);
	document.getElementById("Containerboxneue").appendChild(kategorie2);

	var strich = document.createElement("H4");
	var strichcont = document.createTextNode("_|_");
	strich.appendChild(strichcont);
	document.getElementById("Containerboxneue").appendChild(strich);

	var kategorie1 = document.createElement("H4");
	var kategorie1_content = document.createTextNode(kat1);
	kategorie1.setAttribute("id", "kategorie1-" + id);
	kategorie1.appendChild(kategorie1_content);
	document.getElementById("Containerboxneue").appendChild(kategorie1);

	//4. Add linie:
	var linie = document.createElement("HR");
	linie.setAttribute("class", "liniebox");
	document.getElementById("Containerboxneue").appendChild(linie);

}

function standardFillAddFields() {
	var ue = document.getElementById("addUe").value;
	var K1 = document.getElementById("addK1").value;
	var K2 = document.getElementById("addK2").value;

	if (ue == "") {
		document.getElementById("addUe").style.color = "#94b8b8";
		document.getElementById("addUe").value = "Überschrift";
	}

	if (K1 == "") {
		document.getElementById("addK1").style.color = "#94b8b8";
		document.getElementById("addK1").value = "Kategorie 1";
	}

	if (K2 == "") {
		document.getElementById("addK2").style.color = "#94b8b8";
		document.getElementById("addK2").value = "Kategorie 2";
	}

	document.getElementById("selectTable").value = "Table(1x1)";
	selectChange();
}

function addUe() {
	document.getElementById("addUe").value = "";
	document.getElementById("addUe").style.color = "black";
}

function addK2() {
	document.getElementById("addK2").value = "";
	document.getElementById("addK2").style.color = "black";
}

function addK1() {
	document.getElementById("addK1").value = "";
	document.getElementById("addK1").style.color = "black";
}

function selectChange() {
	var tablevalue = document.getElementById("selectTable").value;
	createTableDoms(parseInt(tablevalue[6]), parseInt(tablevalue[8]));
}

function createTableDoms(zeilen, spalten) {

	// Delete all doms within addContent
	var node = document.getElementById("addContent");
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}

	//Create rows:
	for (j = 1; j < (spalten + 1); j++) {

		console.log("wird ausgeführt!!!")
		var div = document.createElement("DIV");
		div.setAttribute("id", "adddiv" + j)
		document.getElementById("addContent").appendChild(div);

		//style new created div:
		var divstyle = document.createElement("STYLE");
		var t = document.createTextNode("#adddiv" + j + "{display:inline-block;}"); // {width: "+1000/(spalten)+"px;
		divstyle.appendChild(t);
		document.getElementById("adddiv" + j).appendChild(divstyle);

		// create Textarea:
		var x = document.createElement("TEXTAREA");
		var t = document.createTextNode("At w3schools.com you will learn how to make a website.");
		x.setAttribute("id", "addTextArea" + j);
		x.appendChild(t);
		document.getElementById("adddiv" + j).appendChild(x);

		//textarea style:
		var areastyle = document.createElement("STYLE");
		var t = document.createTextNode("#addTextArea" + j + "{ width: " + (1200 - spalten * 10) / spalten + "px; height: 50px; font-size: 15px; line-height: 150%; margin: 10px 0px 0px 10px; }");
		divstyle.appendChild(t);
		document.getElementById("addTextArea" + j).appendChild(areastyle);
	}

	return spalten;
}

function save() {
	// Kopf Werte:
	var ue = document.getElementById("addUe").value;
	var kat1 = document.getElementById("addK1").value;
	var kat2 = document.getElementById("addK2").value;

	// Inhalt of Textbox'es:
	var content1 = document.getElementById("addTextArea1").value;

	// dieser kleine Code scheint schon zu funktionieren:
	if (localStorage.tblData) {
		data = JSON.parse(localStorage.tblData);
		console.log(data);
	}

	var obj = {
		"id": datalength,
		"ue": ue,
		"kat1": kat1,
		"kat2": kat2,
		"Table Selection:": document.getElementById("selectTable").value,
		"Content1": content1
	};
	data.push(obj);
	console.log(data);
	localStorage.tblData = JSON.stringify(data);
	console.log(localStorage.tblData)

	if (localStorage.tblData) {
		data = JSON.parse(localStorage.tblData);
		console.log(data);
	}
}

// Sehr sehr wichtig! diese Klasse rendert alle Formeln!
function myRenderer() {
	var x = document.getElementsByClassName('equation-middle');

	// go through each of them in turn
	for (var i = 0; i < x.length; i++) {
		try {
			var aa = x[i].getAttribute("data-expr");
			if (x[i].tagName == "DIV") {
				t = katex.render(String.raw `${aa}`, x[i], {
						displayMode: true
					});
			}
			/* else {
			t= katex.render(x[i].textContent,x[i]);
			} */
		} catch (err) {
			x[i].style.color = 'red';
			x[i].textContent = err;
		}
	}

	var y = document.getElementsByClassName('equation-inline');

	// go through each of them in turn
	for (var j = 0; j < y.length; j++) {
		try {
			var aa = y[j].getAttribute("data-expr");
			if (y[j].tagName == "DIV") {
				t = katex.render(String.raw `${aa}`, y[j], {
						displayMode: false
					});
			}
			/* else {
			t= katex.render(x[i].textContent,x[i]);
			} */
		} catch (err) {
			y[j].style.color = 'red';
			y[j].textContent = err;
		}
	}
}

//Testing and more information:

/* var key;
for(var key in data[31]) {
var value = data[31][key];
console.log(value);
} */

/*var para = document.createElement("P");                       // Create a <p> element
var t = document.createTextNode(inputtext);      // Create a text node
para.setAttribute("id","p3")
para.appendChild(t);                                          // Append the text to <p>
document.getElementById("content3").appendChild(para);           // Append <p> to <div> with id="myDIV"
hallo.push(inputtext)
console.log(hallo); */

/* content=setCharAt(content,result[0][1],"");
content=setCharAt(content,result[0][1],""); // zweites Dollarzeichen am Anfang

content=setCharAt(content,result[0][2]-3,"");
content=setCharAt(content,result[0][2]-4,""); // zweites Dollarzeichen am Ende */

// \\ zeichen anstatt "\"
/* var inhalt = result[0][0];
var inhaltneu=inhalt.replace(String.fromCharCode(92), String.fromCharCode(92,92));
console.log(inhalt);
console.log(inhaltneu);
content = content.replace(inhalt,inhaltneu); */

/* var fragment = create(`<p id="p200" >`+content+"</p>");

var position = document.getElementById("content1");
position.insertBefore(fragment, position.childNodes[0]);

var eqleft2 = result[0][0];
document.getElementById("eqadddd").setAttribute("data-expr", String.raw `${eqleft2}`);
var tex = document.getElementById("eqadddd");
katex.render(String.raw `${eqleft2}`, tex);
 */

// mit Objekten Arbeiten:
/* var car = new Object();
car.colour = 'red';
car.wheels = 4;
car.hubcaps = 'spinning';
car.age = 4; */

// Save just javascript data to new file:
//http://stackoverflow.com/questions/33047709/save-webpage-data-to-file-locally-how-can-get-data-from-a-webpage-into-json-fil
// JSON can be written into local storage using the JSON.stringify to serialize a JS object. You cannot write to a JSON file using only JS. Only cookies or local storage
//-> serialize data with jason and load that data in javascript at startup!
// ->https://www.copterlabs.com/json-what-it-is-how-it-works-how-to-use-it/
// -nutze node js um in txt datei zu schreiben::
// https://www.youtube.com/watch?v=6hcsrjooU0w
// -node js ist ein interpreter von javascript
// -node js ist eventgesteuert 			callback sind funktionen die im Hintergrund ablaufen!
// -node js hat nonblocking IO Modell implementiert - viele User können parallel Prozesse ausführen.
// -node js ist für serverseitige Netzwerkanwendungen zuständig. (Multiplayer spiel)
// -node js echtzeit Anwendungen möglich z.B. etherpad.
//node js kann ich auf meiner DSM installieren.
// damit node js fehlerfrei auf webpage läuft ist es etwas schwierig.

// WIE SCHREIBE ICH von JAVASCRITP in eine .txt DATEI?
// geht das wirklich nicht mit nur javascript? oder brauche ich wirklich node js dafür?! oder evtl. jason?
//// Textdatei einlesen mit javascript: https://www.youtube.com/watch?v=QI_NClLxnF0,
// save datei on desktop from server: https://www.youtube.com/watch?v=pCdA3YXWRdM

// Javascript storage: https://www.youtube.com/watch?v=klLMeL7I4O0  <-- TODO genau anschauen! und dann den Webstorage benutzen?!

// Javascript local storage use with json: https://www.youtube.com/watch?v=yzpxUB126YE -> http://devsonline.net/content/index/category/html5/topic/jquery_dom_manipulation_and_localstorage (code!)


//localStorage.setItem("username","george");
//sessionStorage.setItem("username,","hallo!");
//document.write("<h1>Hi"+localStorage.username+"</h1>");

//Jason Testing:
//var myObj = { "name":"John", "age":31, "city":"New York" };
//var myJSON = JSON.stringify(myObj);
//window.location = "demo_json.php?x=" + myJSON;


//Testing:
//wenn button click dann speichere Werte in local storage das heißt konkret den inputtext
// Wenn seite laden dann lade alles aus dem local storage!
