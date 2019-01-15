class fractGen{
	constructor(startPos,nrIt,angleS,angleI,axiom,rules){
		this.startPos=startPos;
		this.nrIt=nrIt;
		this.angleS=angleS;
		this.angleI=angleI;
		this.axiom=axiom;
		this.rules=rules;
		this.signs="-+[]";
	}

	expand(){
		var aux="";

		for(var letter=0;letter<this.axiom.length;letter++){
			if(!this.signs.includes(this.axiom[letter]) && Object.keys(this.rules).includes(this.axiom[letter])){
				aux+=this.rules[this.axiom[letter]];
			}else{
				aux+=this.axiom[letter];
			}
		}
		this.axiom=aux;
		console.log(this.axiom);
	}

	displayOnCanvas(){
		var angle=this.angleS;
		var currentPoint={};
		currentPoint["x"]=this.startPos.x.valueOf();
		currentPoint["y"]=this.startPos.y.valueOf();
		var nextPoint={};
		nextPoint["x"]=currentPoint.x.valueOf();
		nextPoint["y"]=currentPoint.y.valueOf();
		var canvas=document.getElementById("fractalCanvas");
		canvas.innerHTML="";
		var svgline="";
		var xstack=[],ystack=[],astack=[];
		var doStuff=0;
		var batch="";
		for(var letter=0;letter<this.axiom.length;letter++){
			switch(this.axiom[letter]){
				case '-':
					angle-=this.angleI;
					break;
				case '+':
				angle+=this.angleI;
					break;
				case '[':
					xstack.push(currentPoint.x.valueOf());
					ystack.push(currentPoint.y.valueOf());
					astack.push(angle.valueOf());
					break;
				case ']':
					currentPoint.x=xstack.pop();
					currentPoint.y=ystack.pop();
					angle=astack.pop();
					break;
				default:
					console.log(doStuff++);
					nextPoint.x=currentPoint.x + 4*Math.cos(Math.PI * angle / 180.0);
					nextPoint.y=currentPoint.y + 4*Math.sin(Math.PI * angle / 180.0);
					svgline="";
					svgline+='<line x1="'+currentPoint.x+'" y1="'+currentPoint.y+'" ';
					svgline+='x2="'+nextPoint.x+'" y2="'+nextPoint.y+'"  style="stroke:#000000;"/>';
					batch+=svgline;
					currentPoint.x=nextPoint.x.valueOf();
					currentPoint.y=nextPoint.y.valueOf();
			}
		}
		canvas.innerHTML+=batch;
	}

	generateFractal(){
		for(var contor=1;contor<=this.nrIt;contor++){
			this.expand();
		}
		this.displayOnCanvas();
	}


}

var x=0,y=0;

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

	var fracty=new fractGen({x,y},iterations,starting,incrementing,axiom,rules);
	fracty.generateFractal();
});


var canvas=document.getElementById("fractalCanvas");
canvas.addEventListener("click",function(evt){
	var e = evt.target;
	var dim = e.getBoundingClientRect();
	x = Math.floor(evt.clientX - dim.left);
	y = Math.floor(evt.clientY - dim.top);
	document.getElementById("startPos").innerHTML=""+x+","+y;
});

	
