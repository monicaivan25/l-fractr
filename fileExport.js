// Set-up the export buttons
var svg=document.getElementById("fractalCanvas");
var loggedUser;
var num = 0;

// Local save buttons

var savePngBtn = document.getElementById("save-as-png");
savePngBtn.addEventListener('click', function(){
	var svgString = getSVGString(svg.node());
	svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback
	function save( dataBlob, filesize ){
		saveAs( dataBlob, 'fractal.png' ); // FileSaver.js function
	}
});

var saveSvgBtn = document.getElementById("save-as-svg");
saveSvgBtn.addEventListener('click', function(){
	var svgString = getSVGString(svg.node());
	var blob = new Blob([svgString], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "fractal.svg");
});

//remote save button
var saveRemoteBtn = document.getElementById("save-remote");
saveRemoteBtn.addEventListener('click', function(){

	var svgString = getSVGString(svg.node());
	console.log("saving remotely");
	var blob = new Blob([svgString], {type: "text/plain;charset=utf-8"});
	var title = getTitle();
	var storageRef = firebase.storage().ref(loggedUser + '/' + title + '.svg').put(blob);

	var database = firebase.database();
	var folderName = getFolderNameForEmail(loggedUser);
	firebase.database().ref(folderName + '/' + title).set({
		imgRef : loggedUser + '/' + title + '.svg',
		startingPositionX : 10,
		startingPositionY : 10,
		numberOfIterations: 10,
		startingAngle : 10,
		incrementingAngle: 10,
		axiom: 10,
		rule1: 10,
		rule2: 10,
		rule3: 10,
		rule4: 10
	});
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
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');

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


function loadImages(){
	console.log("DONWLOADING");

	//var storageRef = firebase.storage().ref(loggedUser + '/' + title + '.svg').put(blob);

	var database = firebase.database();
	var folderName = getFolderNameForEmail(loggedUser);
	firebase.database().ref(folderName).once("value", function(snapshot) {
		snapshot.forEach(function(child) {
			
			var imageLink = child.child('imgRef').val();
			console.log(imageLink);
		});
		// console.log(snapshot.val());
	});


	var gallery = document.getElementById("gallery");



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

class entry{
	constructor(startingPositionX, startingPositionY, numberOfIterations, startingAngle, incrementingAngle, axiom, rule1, rule2, rule3, rule4, imgString){
		this.startingPositionX = startingPositionX;
		this.startingPositionY = startingPositionY;
		this.numberOfIterations = numberOfIterations;
		this.startingAngle = startingAngle;
		this.incrementingAngle = incrementingAngle;
		this.axiom = axiom;
		this.rule1 = rule1;
		this.rule2 = rule2;
		this.rule3 = rule3;
		this.rule4 = rule4;
		this.imgString =imgString;
	}
}

// var imageLink = child.child('imgRef').val();
// 			var axiom = child.child("axiom").val();
// 			var startingAngle = child.child("startingAngle").val();
// 			var incrementingAngle = child.child("incrementingAngle").val();
// 			var numberOfIterations = child.child("numberOfIterations").val();
// 			var startingPositionX = child.child("startingPositionX").val();
// 			var startingPositionY = child.child("startingPositionY").val();
// 			var rule1 = child.child("rule1").val();
// 			var rule2 = child.child("rule2").val();
// 			var rule3 = child.child("rule3").val();
// 			var rule4 = child.child("rule4").val();