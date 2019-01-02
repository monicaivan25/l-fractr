class fractGen{
	constructor(startPos,nrIt,angleS,angleI,axiom,rules){
		this.startPos=startPos;
		this.nrIt=nrIt;
		this.angleS=angleS;
		this.angleI=angleI;
		this.axiom=axiom;
		this.rules=rules;
		this.signs="-+[]";
		console.log(this.axiom);
		console.log(this.rules);
	}

	expand(){
		var aux="";

		for(var letter=0;letter<this.axiom.length;letter++){
			if(!this.signs.includes(this.axiom[letter])){
				aux+=this.rules[this.axiom[letter]];
			}else{
				aux+=this.axiom[letter];
			}
		}
		this.axiom=aux;
	}

	generateFractal(){
		for(var contor=1;contor<=this.nrIt;contor++){
			this.expand();
			console.log(this.axiom);
		}
	}

}

var render=document.getElementById("asit6");
render.addEventListener("click",function(){
	//iterations:
	var iterations=0;
	if(document.getElementById("radio1").checked==true){
		iterations=1;
	}
	if(document.getElementById("radio2").checked==true){
		iterations=2;
	}
	if(document.getElementById("radio3").checked==true){
		iterations=3;
	}
	if(document.getElementById("radio4").checked==true){
		iterations=4;
	}
	if(document.getElementById("radio5").checked==true){
		iterations=5;
	}
	if(document.getElementById("radio6").checked==true){
		iterations=6;
	}
	if(document.getElementById("radio7").checked==true){
		iterations=7;
	}

	//angles:
	var starting=parseInt(document.getElementById("startDegree").value);
	var incrementing=parseInt(document.getElementById("incrDegree").value);

	//axiom:
	var axiom=document.getElementById("axiom").value;

	//rules:
	oForm=document.getElementById("rulesForm");
	var rules={};
	if(oForm.elements["firstLiteral"].value!="")
		rules[oForm.elements["firstLiteral"].value]=oForm.elements["firstRule"].value;
	if(oForm.elements["secondLiteral"].value!="")
		rules[oForm.elements["secondLiteral"].value]=oForm.elements["secondRule"].value;
	if(oForm.elements["thirdLiteral"].value!="")
		rules[oForm.elements["thirdLiteral"].value]=oForm.elements["thirdRule"].value;
	if(oForm.elements["fourthLiteral"].value!="")
		rules[oForm.elements["fourthLiteral"].value]=oForm.elements["fourthRule"].value;

	var fracty=new fractGen(0,iterations,starting,incrementing,axiom,rules);
	fracty.generateFractal();
})