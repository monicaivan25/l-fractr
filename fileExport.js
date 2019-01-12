// Set-up the export buttons
var svg = document.getElementById("fractalCanvas");
var loggedUser;
var num = 0;


const loginForm = document.getElementById("login-form");
const saveForm = document.getElementById("save-form");
// Local save buttons

window.onclick = function(event) {
  if (event.target == loginForm) {
    loginForm.style.display = "none";
  }
  if (event.target == saveForm) {
    saveForm.style.display = "none";
  }
}

var savePngBtn = document.getElementById("save-as-png");
savePngBtn.addEventListener('click', function(){
	var svg = document.getElementById("fractalCanvas");
	svg.removeAttribute("xmlns");

	var svgString = getSVGString(svg);
	svgString2Image( svgString, 500	, 500, 'png', save ); // passes Blob and filesize String to the callback
	function save( dataBlob, filesize ){
		saveAs( dataBlob, 'fractal.png' ); // FileSaver.js function
	}
	saveForm.style.display = 'none';
});

var saveSvgBtn = document.getElementById("save-as-svg");
saveSvgBtn.addEventListener('click', function(){
	var svg = document.getElementById("fractalCanvas");
	svg.removeAttribute("xmlns");
	var svgString = getSVGString(svg);
	var blob = new Blob([svgString], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "fractal.svg");
	saveForm.style.display = 'none';
});

//remote save button
var saveRemoteBtn = document.getElementById("save-remote");
saveRemoteBtn.addEventListener('click', function(){

	var svgString = getSVGString(svg);
	console.log("saving remotely");
	var blob = new Blob([svgString], {type: "text/plain;charset=utf-8"});
	var title = getTitle();
	var storageRef = firebase.storage().ref(loggedUser + '/' + title + '.svg').put(blob);

	var database = firebase.database();
	var folderName = getFolderNameForEmail(loggedUser);

	oForm=document.getElementById("rulesForm");

	firebase.database().ref(folderName + '/' + title).set({
		imgRef: svgString,
		startingPositionX : x,
		startingPositionY : y,
		numberOfIterations: getIterations(),
		startingAngle : parseInt(document.getElementById("startDegree").value),
		incrementingAngle: parseInt(document.getElementById("incrDegree").value),
		axiom: document.getElementById("axiom").value,
		rule1Lit: oForm.elements["firstLiteral"].value,
		rule1Expr: oForm.elements["firstRule"].value,
		rule2Lit: oForm.elements["secondLiteral"].value,
		rule2Exp: oForm.elements["secondRule"].value,
		rule3Lit: oForm.elements["thirdLiteral"].value,
		rule3Exp: oForm.elements["thirdRule"].value,
		rule4Lit: oForm.elements["fourthLiteral"].value,
		rule4Exp: oForm.elements["fourthRule"].value
	});

	saveForm.style.display = 'none';

});


function getTitle(){
	var title = prompt("Save As", "Custom fractal");
	if (title != null) {
		return title;
	} else {
		title = "CustomFractal" + num;
		num ++;
	}
	return title;
}


function getSVGString( svgNode ) {
	//svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

	return svgString;
}

function svgString2Image( svgString, width, height, format, callback ) {
	var format = format ? format : 'png';
	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var image = new Image();
	image.onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image, 0, 0, width, height);

		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
		});

	};
	image.src = imgsrc;
}


function loadFiles(){

	var gallery = document.getElementById("gallery");

	var database = firebase.database();
	var folderName = getFolderNameForEmail(loggedUser);
	firebase.database().ref(folderName).once("value", function(snapshot) {
		snapshot.forEach(function(child) {
			
			var name = child.key;
			var div = document.createElement('div');
			div.className = "row";
			div.innerHTML = folderName + '/' + name;
			div.addEventListener("click", function(){
				downloadChild(child);
				loginForm.style.display = 'none';
			});
			gallery.appendChild(div);

		});
	});
}



function downloadChild(reff){

	var imageLink = reff.child('imgRef').val();
	var axiom = reff.child("axiom").val();
	var startingAngle = reff.child("startingAngle").val();
	var incrementingAngle = reff.child("incrementingAngle").val();
	var numberOfIterations = reff.child("numberOfIterations").val();
	var startingPositionX = reff.child("startingPositionX").val();
	var startingPositionY = reff.child("startingPositionY").val();
	var rule1Lit = reff.child("rule1Lit").val();
	var rule2Lit = reff.child("rule2Lit").val();
	var rule3Lit = reff.child("rule3Lit").val();
	var rule4Lit = reff.child("rule4Lit").val();
	var rule1Expr = reff.child("rule1Expr").val();
	var rule2Expr = reff.child("rule2Expr").val();
	var rule3Expr = reff.child("rule3Expr").val();
	var rule4Expr = reff.child("rule4Expr").val();

	document.getElementsByClassName("canvas")[0].innerHTML=imageLink;
	setIterations(numberOfIterations);
	document.getElementById("axiom").value = axiom;
	document.getElementById("startDegree").value = startingAngle;
	document.getElementById("incrDegree").value = incrementingAngle;
	oForm=document.getElementById("rulesForm");
	oForm.elements["firstLiteral"].value = rule1Lit;
	oForm.elements["firstRule"].value = rule1Expr;
	oForm.elements["secondLiteral"].value = rule2Lit;
	oForm.elements["secondRule"].value = rule2Expr;
	oForm.elements["thirdLiteral"].value = rule3Lit;
	oForm.elements["thirdRule"].value = rule3Expr;
	oForm.elements["fourthLiteral"].value = rule4Lit;
	oForm.elements["fourthRule"].value = rule4Expr;
	x = startingPositionX;
	y = startingPositionY;
	document.getElementById("startPos").innerHTML=""+x+","+y;
}

function getFolderNameForEmail(email){
	email = email.replace('@','');
	email = email.replace('.','');
	email = email.replace(',','');
	email = email.replace('_','');
	email = email.replace('[','');
	email = email.replace(']','');
	return email;
}

function getIterations(){
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
	return iterations;
}

function setIterations(iterations){
	document.getElementById("radio1").checked=false;
	document.getElementById("radio2").checked=false;
	document.getElementById("radio3").checked=false;
	document.getElementById("radio4").checked=false;
	document.getElementById("radio5").checked=false;
	document.getElementById("radio6").checked=false;
	document.getElementById("radio7").checked=false;
	if(iterations == 1){
		document.getElementById("radio1").checked=true;
	}
	if(iterations ==2 ){
		document.getElementById("radio2").checked=true;
	}
	if(iterations ==3 ){
		document.getElementById("radio3").checked=true;
	}
	if(iterations ==4 ){
		document.getElementById("radio4").checked=true;
	}
	if(iterations ==5 ){
		document.getElementById("radio5").checked=true;
	}
	if(iterations ==6 ){
		document.getElementById("radio6").checked=true;
	}
	if(iterations ==7){
		document.getElementById("radio7").checked=true;
	}
}