//global variables:
var speicher = [];  // stores Matrixes A,B,C

function read_textarea() {
    //Input: Textarea
    //Output: speicher
    //     speicher[i]=m,b,k,k_p,k_d,x(0),dx(0),
   // console.log("Read in Textarea line by line do not change line order!");

    var textArea = document.getElementById("textarea1");
    var lines = textArea.value.split("\n");

    for (var j = 0; j < (lines.length); j++) {
        var zeile_j = lines[j];

        if (zeile_j[0] == "A" || zeile_j[0] == "B" || zeile_j[0] == "C") {
            speicher[j]=((zeile_j.substring(zeile_j.lastIndexOf("=") + 1, zeile_j.lastIndexOf(";"))));
        }
    }
//    console.log("Values of textarea: ")
//    console.log(speicher[0]); //A
//    console.log(speicher[1]); //B
//    console.log(speicher[2]); //C
    return speicher;
}


// eigArray: [-0.464102,6.4641]
// system: 's' or 'z'
// TODO only works for s not for z also check only real part!
function check_stability(eigArray,system){
    var a = 0;
    if(system.toString()=='s'){
    for(var i=0;i<eigArray.length;i++){
        if(eigArray[i]<0){
            a=1;
        }
    }
    if(a==1){
        console.log("s-System is unstable");
        return "unstable";
    }
    if(a==0){
        console.log("s-System is stable");
        return "stable";
    }
    }
}

//calculate the SteuerbarkeitsMatrix:
// A =  Algebrite.run('A='+speicher[0]);
function someTests(A,B,nA){
//Q_S = [b Ab A^n-1b]
    var Q_S;
   var Q_S= Algebrite.run('Q_S=unit('+nA+','+nA+')');
    console.log(Algebrite.eval('Q_S').toString());
    var h=Algebrite.cofactor('Q_S',1,1);
    console.log(h.toString());
    var u = Algebrite.cofactor('A',1,1);
    var am = (new Function("return " +"[[1,2,3],[4,5,6],[7,8,9]]"+ ";")());
    console.log(am);
    console.log(arrayToString(am));

     console.log(setMatValue("[[1,2,3],[4,5,6],[7,8,9]]",0,1,100));
     console.log(setMatValue("[[1,2,3],[4,5,6],[7,8,9]]",2,0,200));

     console.log(setColumnVectorOfMatrix("[[1,2,3],[4,5,6],[7,8,9]]",0,"[100,200,300]"));
    console.log(setRowVectorOfMatrix("[[1,2,3],[4,5,6],[7,8,9]]",0,"[100,200,300]"));

    //die folgenden 6 gehen auch alle:
    console.log(getColumnVectorOfMatrix("[[1,2,3],[4,5,6],[7,8,9]]",3,0).toString());
    console.log(getColumnVectorOfMatrix("[[1,2,3],[4,5,6],[7,8,9]]",3,1).toString());
    console.log(getColumnVectorOfMatrix("[[1,2,3],[4,5,6],[7,8,9]]",3,2).toString());

    console.log(getRowVectorOfMatrix("[[1,2,3],[4,5,6],[7,8,9]]",3,0).toString());
    console.log(getRowVectorOfMatrix("[[1,2,3],[4,5,6],[7,8,9]]",3,1).toString());
    console.log(getRowVectorOfMatrix("[[1,2,3],[4,5,6],[7,8,9]]",3,2).toString());
}

//all matrices as speicher=Algebrite.run('Q_S=unit('+nA+','+nA+')'); values!
function getQ_S(A,B,nA,nA_fest,speicher){
    if(typeof nA=='undefined'){
        var sizeA = (new Function("return " + Algebrite.shape('A')+ ";")());
        var speicher=Algebrite.run('Q_S=unit('+sizeA[0]+','+sizeA[0]+')');
        speicher=Algebrite.eval('Q_S').toString();
        //console.log(Algebrite.eval('Q_S').toString());
      return  getQ_S(A,B,sizeA[0],sizeA[0],speicher);
    }
    else{
    var pos = nA_fest-nA;
    if(nA>0){
       //console.log(pos);
        if(pos==0){
            speicher=setColumnVectorOfMatrix(speicher,0,B);
          //  console.log(speicher);
            return getQ_S(A,B,nA-1,nA_fest,speicher);
        }
        else{

            var newcolumn = Algebrite.dot(A,getColumnVectorOfMatrix(speicher,nA_fest,pos-1)).toString();
          // console.log(newcolumn);
            speicher=setColumnVectorOfMatrix(speicher,pos,newcolumn);
          // console.log(speicher);
            return getQ_S(A,B,nA-1,nA_fest,speicher);
        }
    }
    }
        return speicher;
}

function getQ_B(A,C,nA,nA_fest,speicher){
    if(typeof nA=='undefined'){
        var sizeA = (new Function("return " + Algebrite.shape('A')+ ";")());
        var speicher=Algebrite.run('Q_B=unit('+sizeA[0]+','+sizeA[0]+')');
        speicher=Algebrite.eval('Q_B').toString();
      return  getQ_B(A,C,sizeA[0],sizeA[0],speicher);
    }
    else{
    var pos = nA_fest-nA;
    if(nA>0){
       //console.log(pos);
        if(pos==0){
           // console.log(speicher);
            speicher=setRowVectorOfMatrix(speicher,0,C);
           // console.log(speicher);
            return getQ_B(A,C,nA-1,nA_fest,speicher);
        }
        else{
            //speicher[pos]=A*speicher[pos-1];
            var newcolumn = Algebrite.dot(getRowVectorOfMatrix(speicher,nA_fest,pos-1),A).toString();
          // console.log(newcolumn);
            speicher=setRowVectorOfMatrix(speicher,pos,newcolumn);
          // console.log(speicher);
            return getQ_B(A,C,nA-1,nA_fest,speicher);
        }
    }
    }
        return speicher;
}

function getColumnVectorOfMatrix(matrixasString,sizeofMatrix,pos){
    var a = "["; //ligender Vektor!
    for(var i=0;i<sizeofMatrix;i++){
        if(i!=sizeofMatrix-1){
        if(i!=pos){
              a=a+"0,";
          }
          if(i==pos){
              a=a+"1,";
          }
        }
        else{
            if(i!=pos){
                  a=a+"0";
              }
              if(i==pos){
                  a=a+"1";
              }
        }
    }
    a=a+"]"
  //  console.log(a); // immer liegend!
   return Algebrite.dot(a,Algebrite.transpose(matrixasString));
}

function getRowVectorOfMatrix(matrixasString,sizeofMatrix,pos){
    var a = "["; //ligender Vektor!
    for(var i=0;i<sizeofMatrix;i++){
        if(i!=sizeofMatrix-1){
        if(i!=pos){
              a=a+"0,";
          }
          if(i==pos){
              a=a+"1,";
          }
        }
        else{
            if(i!=pos){
                  a=a+"0";
              }
              if(i==pos){
                  a=a+"1";
              }
        }
    }
    a=a+"]"
  //  console.log(a); // immer liegend!
   return Algebrite.dot(a,matrixasString);
}

//matrix: "[[1,0,0],[0,1,0],[0,0,1]]"
//returns: string representation!
//i:zeile
//j:spalte!
function setMatValue(matrix,i,j,value){
    var matrixasarray = (new Function("return " +matrix+ ";")());
    matrixasarray[i][j]=value;
   // console.log(matrixasarray);
   return arrayToString(matrixasarray);
}


//Matrix as string like: [[1,0],[0,1]]
//Column like 0
//columnvalue like : [2,1]
function setColumnVectorOfMatrix(matrix,column,columnvalue){
  //handle column inputs like: [[2,1]]
   // or [[2],[1]]
    var columnvaluesize = (new Function("return " + Algebrite.shape(columnvalue)+ ";")()); //dimension
    var ncolumnvaluesize= (columnvaluesize[0]);
    if(ncolumnvaluesize!=1){ //e.g: [[2],[1]] ncolumnvaluesize=2
        columnvalue=Algebrite.transpose(columnvalue).toString();
       // console.log(columnvalue);
    }
    if(columnvalue[0]="["&&columnvalue[1]=="["){
        columnvalue=columnvalue.substring(1);
        columnvalue=columnvalue.substring(0,columnvalue.length-1);
    }
    //console.log(columnvalue);

  //eigentliche logik:
  var columnvaluesasarray =  (new Function("return " +columnvalue+ ";")());
  //  console.log(columnvaluesasarray);
    var tmp = "";
   for(var i=0;i<columnvaluesasarray.length;i=i+1){
     tmp=setMatValue(matrix,i,column,columnvaluesasarray[i]);
       matrix=tmp;
    }
   return matrix;
}


//Matrix as string like: [[1,0],[0,1]]
//Column(Spalte) as String like:
function setRowVectorOfMatrix(matrix,row,rowvalue){
    if(rowvalue[0]="["&&rowvalue[1]=="["){
        rowvalue=rowvalue.substring(1);
        rowvalue=rowvalue.substring(0,rowvalue.length-1);
    }

    var rowvaluesasarray =  (new Function("return " +rowvalue+ ";")());
     //console.log(rowvaluesasarray);
    var tmp = "";
   for(var i=0;i<rowvaluesasarray.length;i=i+1){
     tmp=setMatValue(matrix,row,i,rowvaluesasarray[i]);
       matrix=tmp;
    }
   return matrix;
}

// input: am = (new Function("return " +"[[1,2,3],[4,5,6],[7,8,9]]"+ ";")());
// returns:[[1,2,3],[4,5,6],[7,8,9]]
function arrayToString(array){
    var arrasString ="";
    for(var j=0;j<array.length;j++){
        for(var i=0;i<array[j].length;i=i+1){
            if(i==0){
                arrasString =arrasString+"["+array[j][i].toString();

            }
            else if(i==array[j].length-1){
                arrasString=arrasString+","+array[j][i].toString()+"]";

            }
            else{
                arrasString=arrasString+","+array[j][i].toString();

            }
        }
        if(j!=array.length -1){
        arrasString=arrasString+",";
        }
    }
    //console.log("["+arrasString+"]");
   return "["+arrasString+"]";
}

function matrix2Latex(matrix){
    var matrixwithbackslash = math.parse(matrix).toTex();
    //gives:  //\begin{bmatrix}1&2\\4&5\\\end{bmatrix}
  return matrixwithbackslash.replace("\\\\end{bmatrix}","\end{bmatrix}");
}

//A =  Algebrite.run('A='+speicher[0]);
function fill_matrices_latex(A,B,C,nA,mA,nB,mB,nC,mC,isSISO,charPolyString,eigArray,isStable,
                             transfereOpenString,Q_S_Kalman,isControllable,Q_B_Kalman,isObservable,
                             invQ_S_Kalman,invQ_B_Kalman){
    var systemgleichung_werte1 = "{   \\underbrace{\\dot{{x}}(t)}_{"+nA+" \\times 1}=\\underbrace{{"+matrix2Latex(A)+"}}_{"+nA+" \\times "+nB+"} {x}(t) +\\underbrace{{"+matrix2Latex(B)+"}}_{"+nB+" \\times "+mB+"}  {u}(t) }";
    document.getElementById("systemgleichung_werte1").setAttribute("data-expr", String.raw`${systemgleichung_werte1}`);

    var systemgleichung_werte2 =" {   \\underbrace{{y}(t)}_{"+nC+" \\times 1}=\\underbrace{{"+matrix2Latex(C)+"}}_{"+nC+" \\times "+nA+"} {x}(t) \\textbf{ "+isSISO+" SYSTEM} }";
    document.getElementById("systemgleichung_werte2").setAttribute("data-expr", String.raw`${systemgleichung_werte2}`);

    var stablility1 ="\\text{char. Poly.:}\\; \\; P(s)="+math.parse(charPolyString).toTex()+"";
    document.getElementById("stablility1").setAttribute("data-expr", String.raw`${stablility1}`);

    var stablility2 ="\\text{Eigenvalues:}\\; \\; \\lambda_i="+eigArray+"";
    document.getElementById("stablility2").setAttribute("data-expr", String.raw`${stablility2}`);

    var stablility3 ="\\text{s-Sys is:}\\; \\; \\;"+isStable+"";
    document.getElementById("stablility3").setAttribute("data-expr", String.raw`${stablility3}`);

    var controlability ="\\text{Controllability:}\\; \\; Q_S="+matrix2Latex(Q_S_Kalman)+"\\; Q_S^{-1}="+matrix2Latex(invQ_S_Kalman)+"\\text{Sys is} \\;"+isControllable+"";
    document.getElementById("controlability").setAttribute("data-expr", String.raw`${controlability}`);

    var observability ="\\text{Observability:}\\; \\; \\; Q_B="+matrix2Latex(Q_B_Kalman)+"\\; Q_B^{-1}="+matrix2Latex(invQ_B_Kalman)+"\\text{Sys is} \\;"+isObservable+"";
    document.getElementById("observability").setAttribute("data-expr", String.raw`${observability}`);

    var transfereopen1 ="G_O(s)="+math.parse(transfereOpenString).toTex();
    document.getElementById("transfereopen1").setAttribute("data-expr", String.raw`${transfereopen1}`);
}

function myRenderer() {
    var x = document.getElementsByClassName('equation');

    // go through each of them in turn
    for (var i = 0; i < x.length; i++) {
        try {
            var aa = x[i].getAttribute("data-expr");
            if (x[i].tagName == "DIV") {
                t = katex.render(String.raw `${aa}`, x[i], {
                                     displayMode: false
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

    var y = document.getElementsByClassName('equation_small');

    // go through each of them in turn
    for (var i = 0; i < y.length; i++) {
        try {
            var aa = y[i].getAttribute("data-expr");
            if (y[i].tagName == "DIV") {
                t = katex.render(String.raw `${aa}`, y[i], {
                                     displayMode: false
                                 });
            }
            /* else {
t= katex.render(x[i].textContent,x[i]);
} */
        } catch (err) {
            y[i].style.color = 'red';
            y[i].textContent = err;
        }
    }
}

function main(){
    read_textarea();
    var isSISO="SISO";
    var isStable="unstable";
    var isControllable="not contrllable";
    var isObservable="not observable";

    var A =  Algebrite.run('A='+speicher[0]);
    var AasString = Algebrite.eval('A').toString();
    var B =  Algebrite.run('B='+speicher[1]);
    var BasString = Algebrite.eval('B').toString();
    var C =  Algebrite.run('C='+speicher[2]);
    var CasString = Algebrite.eval('C').toString();

    var sizeA = (new Function("return [" + Algebrite.shape('A')+ "];")()); //dimension
    var nA= (sizeA[0][0]);
    var mA= (sizeA[0][1]);

    var sizeB = (new Function("return [" + Algebrite.shape('B')+ "];")());
    var nB = (sizeB[0][0]);
    var mB = (sizeB[0][1]);

    var sizeC = (new Function("return [" + Algebrite.shape('C')+ "];")());
    var nC = (sizeC[0][0]);
    var mC = (sizeC[0][1]);

    //check if A is square:
    if(nA.toString()!=nB.toString()){
        console.log("Make sure A is a square Matrix! A:="+nA+"x"+mA);
        return;
    }

    //Systemordnung:
    console.log("Systemordnung n="+nA);

    //Stellgrößen q:
    console.log("Stellgrößen p="+mB);

    //Ausgänge (Messgrößen) q:
    console.log("Ausgänge q="+nC);

    //check SISO:
    if(mB==nC && mB==1){
        isSISO="SISO";
        console.log("This is a Single Input Single Output System!");
    }
    else{
        isSISO="MIMO";
        console.log("This is a Multiple Input Multiple Output System");
    }

    var IN = Algebrite.run('IN=unit('+nA+')');

    // sIN-A:
    var sIN_A = Algebrite.run('U=(s*IN-A)');

    //Polynom:
    var charPoly=Algebrite.run('P=det(U)');
    var charPolyString = Algebrite.eval('P').toString();
    console.log("charact. Polynom: "+charPolyString);

    //eigenvalues of A
    var eigA = Algebrite.nroots('P','s');
    var eigArray =  (new Function("return [" + eigA.toString()+ "];")());
    console.log("Eigenvalues of A: "+eigA.toString());

    //check stability:
    isStable=check_stability(eigArray,'s');

    //invSIN-A
    var invSIN_A = Algebrite.run('Q=inv(U)');
    invSIN_A = Algebrite.simplify('(Q)');
    console.log("inv(sI-A): "+invSIN_A.toString());

    var transfereOpen = Algebrite.dot('C','Q','B');
    var transfereOpenString = transfereOpen.toString().substring(2,transfereOpen.toString().length-2);
    console.log("Transfere function: "+transfereOpenString);

    //Kalman Steuerbar beobachtbar:
    //Steuerbar: Q_S = [b Ab A^n-1b]:
    //someTests(A,B,nA);
    //getQ_S(A,B,nA,nA_fest,speicher)
    var Q_S_Kalman=getQ_S(AasString,BasString);
    var invQ_S_Kalman=Algebrite.inv(Q_S_Kalman).toString();
    console.log("(Kalman) Q_S: "+Q_S_Kalman);
    var rankQ_S_Kalman = Algebrite.rank(Q_S_Kalman);
    if(rankQ_S_Kalman==nA){
        isControllable="controllable";
        console.log("System is (Kalman) controllable");
    }
    else{
        isControllable="not controllable";
        console.log("System is not (Kalman) controllable");
    }

    var Q_B_Kalman=getQ_B(AasString,CasString);
    var invQ_B_Kalman=Algebrite.inv(Q_B_Kalman).toString();
    console.log("(Kalman) Q_B: "+Q_B_Kalman);
    var rankQ_B_Kalman = Algebrite.rank(Q_B_Kalman);
    if(rankQ_B_Kalman==nA){
        isObservable="observable";
        console.log("System is (Kalman) observable");
    }
    else{
        isObservable="not observalbe";
        console.log("System is not (Kalman) observable");
    }

    //Hautus Steuerbar beobachtbar:

    //Gilbert Steuerbar beobachtbar:

    //Pole Placement:

    //Transformation auf Jordan Normalform: T_JNF
     // no idea how to use eigen function?!
     //-> use numeric js!
    //Transformation auf SNF:

    //Transformation auf BNF:

    //Ortskurve:

    //PZM - root locus:

    //teests();


    fill_matrices_latex(AasString,BasString,CasString,nA,mA,nB,mB,nC,mC,isSISO,
                        charPolyString,eigArray,isStable,transfereOpenString,Q_S_Kalman,isControllable,Q_B_Kalman,isObservable,
                        invQ_S_Kalman,invQ_B_Kalman);

    myRenderer();

    //TODO:
//    myimg = document.getElementById('img');
//    myimg.style.height = "50%";
//    myimg.style.width = "50%";
}



// Highcharts Stuff:
//1. Draw block schlaltbilder: (not used)

// Rendering: Blockschaltbild rechts:
//Infos: http://api.highcharts.com/highcharts/Renderer.image
// http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/members/renderer-rect/
//http://jsfiddle.net/Sly_cardinal/jm9moswu/1/

//$(function () {
//    var renderer = new Highcharts.Renderer(
//            $('#block-diagramm')[0],
//            600,
//            150);
//    addFigures2(renderer);
//});

function addFigures2(renderer) {

    //addArrow(renderer);
    rectangle(renderer, 5, 5, 590, 140);
    var rect1 = addRect_and_Text(renderer, 250, 50, 2, "white", 1, "1/s * I", "15px");
    var rect2 = addRect_and_Text(renderer, 350, 50, 2, "white", 1, "C", "15px");
    connect2Rects(renderer, rect1, rect2, "x(t)");

    var circle = addCircle(renderer, 100, 38, 10, "+-");
    connect2Rects(renderer, circle, rect1, "x_dot(t)");

    connectCircleRect(renderer, circle, rect1, "y(t)");
}

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

//end of library for drawing block-schaltbilder.
