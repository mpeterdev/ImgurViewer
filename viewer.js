var currentImageIndex = 0;
var imageLinks;
var viewer;
var viewerImg;

// var imgs = document.getElementsByClassName("zoom");
// var ii = 0;
// for (ii; ii < imgs.length; ii++){
// 	// imgs[ii].style.width = "200px";
// 	// console.log(imgs[ii].width);
// 	// imgs[ii].height = 200;
// 	var watermark = document.createElement('img');
// 	watermark.src = "http://www.wabmo.com/Album/watermark/watermarks/Sample-trans.png";
// 	watermark.style.width = "100%";
// 	watermark.style.height = "100%";
// 	watermark.style.top = "0";
// 	watermark.style.position = "absolute";
// 	watermark.style.zIndex = 10;
// 	imgs[ii].append(watermark);
// }

var header = document.getElementsByClassName("header-center")[0];
var nextBtn = document.createElement('button');
nextBtn.style.width = "100px";
nextBtn.style.height = "32px";
nextBtn.style.float = "left";
nextBtn.style.marginLeft = "15px";
nextBtn.style.marginTop = "9px";
nextBtn.style.borderRadius = "3px";
nextBtn.style.borderWidth = "0px";
nextBtn.style.backgroundColor = "#0098E1";
nextBtn.style.color = "white";
nextBtn.style.fontFamily = "'Open Sans',sans-serif";
nextBtn.style.fontSize = "14px";
nextBtn.style.fontWeight = "600";
nextBtn.innerHTML = 'Viewer';
nextBtn.addEventListener('click', function(){
	// find album ID
	// var canonicalURL = document.querySelector("link[rel=canonical]").getAttribute("href");
	// var canonicalURL = window.location.href;
	// var urlTokens = canonicalURL.split('/');
	var albumID;
	var urlTokens = window.location.href.split('/');
	var tokenIndex = 0;
	for (tokenIndex; tokenIndex < urlTokens.length; tokenIndex++){
		if (urlTokens[tokenIndex] === 'a' || urlTokens[tokenIndex] === 'gallery'){
			albumID = urlTokens[tokenIndex + 1];
		}
	}
	// var albumID = urlTokens[urlTokens.length - 1];
	// get image information from API
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.imgur.com/3/album/" + albumID);
	xhr.setRequestHeader('Authorization', 'Client-ID 7c6bf9036879018');
	xhr.onload = function(){
		var response = JSON.parse(this.responseText);
		var imageDataArray = response.data.images;
		imageLinks = [];
		var jj = 0;
		for (jj; jj < imageDataArray.length; jj++){
			imageLinks.push(imageDataArray[jj].link.substring(5, imageDataArray[jj].link.length))
		}
		createViewer();
	}
	xhr.send();

this.blur();
});
header.append(nextBtn);

var nextImage = function(){
	currentImageIndex++;
	firstImage.src = imageLinks[currentImageIndex];
	console.log('clicked');
}

function createViewer(){
	console.log('Creating overlay');
	viewer = document.createElement('div');
	viewer.style.position = 'fixed';
	viewer.style.zIndex = '102';
	viewer.style.width = '100%';
	viewer.style.height = '100%';
	viewer.style.top = '0';
	viewer.style.left = '0';
	var overlay = document.createElement('div');
	overlay.style.width = '100%';
	overlay.style.height = '100%';
	overlay.style.backgroundColor = 'black';
	overlay.style.opacity = '0.9';
	overlay.addEventListener('click', removeViewer);

	viewerImg = document.createElement('img');
	viewerImg.src = imageLinks[0];
	viewerImg.style.maxHeight = '96%';
	viewerImg.style.maxWidth = '100%';
	viewerImg.style.width = 'auto';
	viewerImg.style.height = 'auto';
	viewerImg.style.position = 'absolute';
	viewerImg.style.top = '1%';
	viewerImg.style.bottom = '0';
	viewerImg.style.left = '0';
	viewerImg.style.right = '0';
	viewerImg.style.margin = 'auto';
	viewerImg.style.opacity = '1';
	viewerImg.addEventListener('click', function(){
		changeImage('next');
	});

	viewer.append(overlay);
	viewer.append(viewerImg);
	document.getElementsByTagName("BODY")[0].append(viewer);

}

function removeViewer(){
	if (viewer){
		viewer.parentNode.removeChild(viewer);
		viewer = null;
		currentImageIndex = 0;
	}
}

window.onkeydown = function(e){
	if (viewer){
		console.log(e.which);
		if ((e.which === 72 || e.which === 65) && currentImageIndex > 0){
			changeImage('prev');
		} else if ((e.which === 76 || e.which === 68) && currentImageIndex < imageLinks.length - 1){
			changeImage('next');
		} else if (e.which === 27){
			removeViewer();
		}
	}
}

function changeImage(changeTo){
	if (changeTo === 'next'){
		currentImageIndex++;
	} else if (changeTo === 'prev'){
		currentImageIndex--;
	}
	viewerImg.src = imageLinks[currentImageIndex];
	preloadImages();
}

function preloadImages(){
	/* Preload Images */
	if (currentImageIndex <= imageLinks.length - 1)
	{
		var preloadImage = new Image();
		preloadImage.src = imageLinks[currentImageIndex + 1];
	}
	if (currentImageIndex > 1)
	{
		var preloadImage2 = new Image();
		preloadImage2.src = imageLinks[currentImageIndex - 1];
	}
	if (currentImageIndex <= imageLinks.length - 2)
	{
		var preloadImage3 = new Image();
		preloadImage3.src = imageLinks[currentImageIndex + 2];
	}
	if (currentImageIndex <= imageLinks.length - 3)
	{
		var preloadImage4 = new Image();
		preloadImage4.src = imageLinks[currentImageIndex + 3];
	}
}

// var imgs = document.getElementsByClassName("post-image-placeholder");
// var ii = 0;
// for (ii; ii < imgs.length; ii++){
// 	imgs[ii].style.width = "200px";
// 	console.log(imgs[ii].width);
// 	// imgs[ii].height = 200;
// }
// var imgs = document.getElementsByClassName("js-post-image-thumb");
// var ii = 0;
// for (ii; ii < imgs.length; ii++){
// 	imgs[ii].style.width = "200px";
// 	console.log(imgs[ii].width);
// 	// imgs[ii].height = 200;
// }
