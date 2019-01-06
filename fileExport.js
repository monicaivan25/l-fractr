// Set-up the export buttons
var svg=document.getElementById("fractalCanvas");
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
