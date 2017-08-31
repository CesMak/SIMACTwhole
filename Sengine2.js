//functions:http://nerdamer.com/functions/dot.html

//global variables:
var speicher = [];  // stores Matrixes A,B,C

//reserved Variables in Nerdamer:
//A,B,C,U,P

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

// Name:   'A'            [String]
// matrix: [12,2],[4,5]'  [String]
function setMatrixNerdamer(name, matrix){
    matrix="matrix("+matrix+")"
    nerdamer.setVar(name, matrix);
}

// matrix: [12,2],[4,5]'  [String]
function getSizeofMatrix(matrix){
    var array = (new Function("return [" + matrix+ "];")());
    return (math.size(array));
}

// matrix: [12,2],[4,5]'  [String]
function characteristicPolynomial(matrix){
    setMatrixNerdamer('U',matrix);
    var size = getSizeofMatrix(matrix);
    var n = (size[0]);
    if(n=2){
        var x = nerdamer('determinant(s*imatrix(2)-U)').expand();
    }
    else{
        var x = nerdamer('determinant(s*imatrix(3)-U)').expand();
    }
    var f = math.parse(x.toString());
    var charPoly = math.simplify(f).toString();
    return (charPoly.toString());
}

function solvePolynom(polynom){
        var y = nerdamer.solveEquations(polynom,'s');
        var solution_fractional =y.toString().split(',');
        var solution_decimal=[];
    for(i=0;i<solution_fractional.length;i++){
        solution_decimal.push(math.simplify(solution_fractional[i]).toString());
    }
        return solution_decimal;
}

// A,B,C: [12,2],[4,5]'  [String]
// n: 2   (size) [int]
//G(s)=C*(zI-A)⁻1*B
function transferefunction(A,B,C,n){

    setMatrixNerdamer('A',A);
    setMatrixNerdamer('B',B);
    setMatrixNerdamer('C',C);

     var a = nerdamer('invert(imatrix(2)*s-A)');
    console.log(a.toString());

    var a = nerdamer('invert(matrix([s,0],[0,s])-matrix([1,2],[3,4]))');
       console.log(a.toString());

   var invertIS_A = nerdamer('invert(imatrix(2)*s-A)').expand().toString();
    console.log(invertIS_A);

    var CinvertIS_A=nerdamer('C*'+invertIS_A).toString();
    console.log(CinvertIS_A);

    var CinvertIS_AB = nerdamer(CinvertIS_A+'*B').toString();
    console.log(CinvertIS_AB);

   var u =  console.log(math.simplify('(-1+s)^(-1)*(1+6*(-1+s)^(-1)*(-4+6*(-1+s)^(-1)+s)^(-1))').toString());
   console.log(math.simplify('(6 / (s - 1) / (6 / (s - 1) - 4 + s) ^ 1 + 1) / (s - 1)').toString());
   console.log(nerdamer('(6 / (s - 1) / (6 / (s - 1) - 4 + s) ^ 1 + 1) / (s - 1)').expand().toString());

    if(n=2){
        console.log("n=2");
        var a = nerdamer('B*invert(imatrix(2)*s-A)*C');
    }
    if(n=3){
        var a = nerdamer('invert(imatrix(3)*s-A)');
    }
    console.log(nerdamer.getVars('text'));

    console.log(a.toString());
}

function teests(){
    var a = Algebrite.run('U=[[s,0],[0,s]]')
    var b = Algebrite.run('A=[[1,2],[3,4]]');
    var c = Algebrite.run('C=inv(U-A)');
    var d = Algebrite.simplify('(C)');
    console.log(a.toString());
    console.log(d.toString());
   console.log(Algebrite.eval('integral(x^2)').toString() );
    console.log(Algebrite.run('invert([[s,0],[0,s]]-[[1,2],[3,4]])'))
}

function main(){
    //clear variables:
    nerdamer.clear('all');

    //read Matrices:
    read_textarea();
    var A=speicher[0];
    var B = speicher[1];
    var C = speicher[2];

   // console.log(A);

   //Get polynom
   var polynom=characteristicPolynomial(A);

   //Get Eigenvalues:
   var eigenValues = solvePolynom(polynom);

   //Get Size:
   var size = getSizeofMatrix(A);
    console.log(polynom);
    console.log(eigenValues[0]);
    console.log(eigenValues[1]);
    console.log(size[0]);

    teests();

   //Calculate Transfere function open loop:
   // transferefunction(A,B,C,size[0]);
}







//old stuff:
//// Name:   'A'            [String]
//// matrix: '[12,2],[4,5]'  [String]
//// size of Matrix n:  2   [int]
//function polynom_ofMatrix(name,matrix,n){
//    setupMatrices(name,matrix);
//   // var polynom=nerdamer('determinant(imatrix(2)*l-M)',name:name});
//    var polynom=nerdamer('expand(determinant(imatrix(2)*l-M))');
//    console.log("expended: "+polynom.text());

//    var polynom2=nerdamer('(determinant(imatrix(2)*l-M))');
//    console.log(polynom2.text());

//    nerdamer.setVar('PP','((imatrix(2)*l-M))');
//  var x=  nerdamer('determinant(PP)');

//    var sol = nerdamer.solveEquations('l^2-5*l-2=0','l');
//    console.log(sol.toString());

//    var y = nerdamer.solveEquations('determinant((imatrix(2)*l-M))=0','l')
//    console.log(y.toString());

//    console.log(math.eval('12 / (2.3 + 0.7)'));
//    console.log(math.eval('det([1, 2; 3, 1])'));



// console.log(math.simplify('-5*l+l^2-6*(-1+l)^(-1)+4+6*(-1+l)^(-1)*l').toString());
//}

//function testfinal(){
//    //ges: det(sI-A)

//    nerdamer.setVar('A', 'matrix([1, 2], [3, 4])');
//    var x = nerdamer('determinant(s*imatrix(2)-A)').expand();
//    var charPoly = math.simplify(x.toString()).toString();
//     console.log(charPoly.toString());
//    var y = nerdamer.solveEquations(charPoly,'s');
//    console.log(y.toString());
//    var solution_expaneded =y.toString().split(',');
//    var sol1 = math.simplify(solution_expaneded[0]);
//    var sol2 = math.simplify(solution_expaneded[1]);
//    console.log(sol1.toString());
//    console.log(sol2.toString());
//}

//function tests(){
//    testfinal();

//    speicher=  read_textarea();

//    setupMatrices('A',speicher[0]);
//    setupMatrices('B',speicher[1]);
//    setupMatrices('C',speicher[2]);


//    nerdamer.setVar('M', 'matrix([1, 2], [3, 4])');
//    var x = nerdamer('determinant(M)');
//    console.log(x.toString());

//    polynom_ofMatrix('U','[12,2],[4,5]')

//    var x = nerdamer('invert(A)');
//    console.log(x.toString());

//    var e = nerdamer('x^2+2*(cos(x)+x*x)');
//    console.log(e.text());

//    var sol = nerdamer.solveEquations('x^3+8=x^2+6','x');
//    console.log(sol.toString());

//    var h = nerdamer('5*x+25');
//    console.log(h.toString());

//    nerdamer.setVar('M', 'matrix([1, 2], [2, 3])');
//    var x = nerdamer('invert(M)');
//    console.log(x.toString());

//    nerdamer.register({
//        parent: 'Algebra',
//        name: 'abc',
//        visible: true,
//        numargs: 3,
//        build: function(){
//            var core = this; //get the core
//            return function(a, b, c) {
//                //apply algorithm (-b+sqrt(b^2-4ac))/2a
//                var exp = core.Utils.format('(-{1}+sqrt({1}^2-4*{0}*{2}))/2*{0}', a, b, c);
//                return core.PARSER.parse(exp);
//            };
//        }
//    });

//    var e = nerdamer('abc(1,2,-1)');
//    console.log(e.text());

//    nerdamer.register({
//        parent: 'Algebra',
//        name: 'det2',
//        visible: true,
//        numargs: 4,
//        build: function(){
//            var core = this;
//            return function(a,b,c,d) {
//                //apply algorithm //[a,b;c,d] Matrix
//                var exp = core.Utils.format('{0}*{3}-{2}*{1}', a, b, c, d);
//                return core.PARSER.parse(exp);
//            };
//        }
//    });

//    var ee = nerdamer('det2(1,2,3,4)');
//    console.log(ee.text());

//    nerdamer.setVar('P', 'matrix([1, 2], [2, 3])');
//  var u=  nerdamer('determinant(P)');
//    console.log(u.toString());

//    nerdamer.setFunction('f', ['n'], 'l*imatrix(n)-P');
//    var xs = nerdamer('f(2)').toString();
//    console.log(xs.toString());


//}
