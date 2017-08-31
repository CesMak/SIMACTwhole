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
    for(i=0;i<eigArray.length;i++){
        if(eigArray[i]<0){
            a=1;
        }
    }
    if(a=1){
        console.log("s-System is unstable");
    }
    if(a=0){
        console.log("s-System is stable");
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

function main(){
    read_textarea();

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
        console.log("This is a Single Input Single Output System!");
    }
    else{
        console.log("This is a Multiple Input Multiple Output System");
    }

    var IN = Algebrite.run('IN=unit('+nA+')');

    // sIN-A:
    var sIN_A = Algebrite.run('U=(s*IN-A)');

    //Polynom:
    var charPoly=Algebrite.run('P=det(U)');
    console.log("charact. Polynom: "+Algebrite.eval('P').toString());

    //eigenvalues of A
    var eigA = Algebrite.nroots('P','s');
    var eigArray =  (new Function("return [" + eigA.toString()+ "];")());
    console.log("Eigenvalues of A: "+eigA.toString());

    //check stability:
    check_stability(eigArray,'s');

    //invSIN-A
    var invSIN_A = Algebrite.run('Q=inv(U)');
    invSIN_A = Algebrite.simplify('(Q)');
    console.log("inv(sI-A): "+invSIN_A.toString());

    var transfereOpen = Algebrite.dot('C','Q','B');
    console.log("Transfere function: "+transfereOpen.toString());

    //Kalman Steuerbar beobachtbar:
    //Steuerbar: Q_S = [b Ab A^n-1b]:
    //someTests(A,B,nA);
    //getQ_S(A,B,nA,nA_fest,speicher)
    var Q_S_Kalman=getQ_S(AasString,BasString);
    console.log("(Kalman) Q_S: "+Q_S_Kalman);
    var rankQ_S_Kalman = Algebrite.rank(Q_S_Kalman);
    if(rankQ_S_Kalman==nA){
        console.log("System is (Kalman) controllable");
    }
    else{
        console.log("System is not (Kalman) controllable");
    }

    var Q_B_Kalman=getQ_B(AasString,CasString);
    console.log("(Kalman) Q_B: "+Q_B_Kalman);
    var rankQ_B_Kalman = Algebrite.rank(Q_B_Kalman);
    if(rankQ_B_Kalman==nA){
        console.log("System is (Kalman) observable");
    }
    else{
        console.log("System is not (Kalman) observable");
    }

    //Hautus Steuerbar beobachtbar:

    //Gilbert Steuerbar beobachtbar:

    //Transformation auf Jordan Normalform:

    //Transformation auf SNF:

    //Transformation auf BNF:

    //Ortskurve:

    //PZM - root locus:

    //teests();
}




