// MAKE SVG 
var width = 700, height = 700;
var circleSizeMax = 15;
var rMax = Math.min(width,height)/2 - circleSizeMax;

var radius 	= d3.scale.linear().range([0,rMax]);
var angle 	= d3.scale.linear().range([0,2*Math.PI]);
var size 	= d3.scale.linear().range([0,circleSizeMax]);
var color 	= d3.scale.ordinal().range(['#fcfb3c','#fcf900','#ff825a','#ffd2cb','#71d362','#ffd16f','#ff3d5d','#ff7218','#04b3f3','#bce5ac','#6e0215','#69D2E7','#A7DBDB','#E0E4CC','#F38630','#E94C6F','#542733','#5A6A62','#C6D5CD','#DB3340','#E8B71A','#F7EAC8','#1FDA9A','#588C73','#F2E394','#F2AE72','#D96459','#D0C91F','#85C4B9','#008BBA','#DF514C','#00C8F8','#59C4C5','#FFC33C','#FBE2B4','#5E412F','#FCEBB6','#78C0A8','#F07818','#DE4D4E','#DA4624','#DE593A','#FFD041','#B1EB00','#53BBF4','#FF85CB','#FF432E','#354458','#3A9AD9','#29ABA4','#E9E0D6','#4298B5','#ADC4CC','#92B06A','#E19D29','#BCCF02','#5BB12F','#73C5E1','#9B539C','#FFA200','#00A03E','#24A8AC','#0087CB','#260126','#59323C','#F2EEB3','#BFAF80','#BFF073','#0DC9F7','#7F7F7F','#F05B47','#3B3A35','#20457C','#5E3448','#FB6648','#E45F56','#A3D39C','#7ACCC8','#4AAAA5','#DC2742','#AFA577','#ABA918','#8BAD39','#F2671F','#C91B26','#9C0F5F','#60047A','#0F5959','#17A697','#638CA6','#8FD4D9','#83AA30','#1499D3','#4D6684','#3D3D3D','#333333','#424242','#00CCD6','#EFEFEF','#CCC51C','#FFE600','#F05A28','#B9006E','#F17D80','#737495','#68A8AD','#C4D4AF']);
var x = function(d) { return radius( d.r ) * Math.cos( angle( d.angle ) ); };
var y = function(d) { return radius( d.r ) * Math.sin( angle( d.angle ) ); };

var svg = d3.select('main').append('svg')
.attr('width', width)
.attr('height',height);

var chart = svg.append('g').attr('transform','translate('+[width/2,height/2]+')');

var data = d3.range(350).map( function(d) { return {r: Math.random(), angle: Math.random(), size: Math.random() }; });

chart.selectAll('cirle')
.data(data).enter()
.append('circle')
.attr('class','blendCircle')
.attr({
	cx: x,
	cy: y,
	r: function(d) { return size(d.size); },
	fill: function(d,i) { return color(i); }
});



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