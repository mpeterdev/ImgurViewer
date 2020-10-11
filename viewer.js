// the index of the current image displayed in the viewer
var currentImageIndex = 0;
// array of links for all images in album
var imageLinks;
// top level viewer div
var viewer;
// viewer img element to display current image
var viewerImg;

// create a button to launch the viewer that is styled to match Imgur's design
var launchButton = document.createElement('button');
launchButton.style.width = "100px";
launchButton.style.height = "32px";
launchButton.style.float = "left";
launchButton.style.marginLeft = "15px";
launchButton.style.marginTop = "9px";
launchButton.style.borderRadius = "3px";
launchButton.style.borderWidth = "0px";
launchButton.style.backgroundColor = "#0098E1";
launchButton.style.color = "white";
launchButton.style.fontFamily = "'Open Sans',sans-serif";
launchButton.style.fontSize = "14px";
launchButton.style.fontWeight = "600";
launchButton.innerHTML = 'Viewer';

// register a handler to make the API request and spawn the viewer when the
// launch button is clicked
launchButton.addEventListener('click', function(){
	// find album ID
	// NOTE originally the canonical URL was used, and it still seems more
	// appropriate, but it does not update to reflect the user moving between
	// albums so the current URL is being grabbed instead

	// var canonicalURL = document.querySelector("link[rel=canonical]").getAttribute("href");
	// var canonicalURL = window.location.href;
	// var urlTokens = canonicalURL.split('/');
	var albumID;
	var urlTokens = window.location.href.split('/');
	var tokenIndex = 0;
	for (tokenIndex; tokenIndex < urlTokens.length; tokenIndex++){
		// support both /gallery/id and /album/id URLs as they are essentially the
		// same
		if (urlTokens[tokenIndex] === 'a' || urlTokens[tokenIndex] === 'gallery'){
			albumID = urlTokens[tokenIndex + 1];
		}
	}
	// get album information from API
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.imgur.com/3/album/" + albumID);
	xhr.setRequestHeader('Authorization', 'Client-ID 7c6bf9036879018');
	xhr.onload = function(){
		// for simplicity's sake, we are going to trust that the Imgur API won't
		// give us a malformed response
		var response = JSON.parse(this.responseText);
		var imageDataArray = response.data.images;
		imageLinks = [];
		// iterate through all images and push their links onto the array
		var ii = 0;
		for (ii; ii < imageDataArray.length; ii++){
			// trim the protocol before pushing
			imageLinks.push(imageDataArray[ii].link.replace(/^https?:/, ''));
		}
		// create the viewer overlay
		createViewer();
	}
	xhr.send();

	// blur the button to get rid of the surrounding highlight that appears when
	// it is clicked
	this.blur();
});

// place the button into the page header
var header = document.getElementsByClassName("NavbarContainer-left")[0];
header.append(launchButton);

/**
 * Create the viewer and add it to the screen
 * @return {void}
 */
function createViewer(){
	// create the tinted overlay
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

	// remove the viewer if the user clicks on the overlay outside of the image
	overlay.addEventListener('click', removeViewer);

	// create the image element with auto-fit properties
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

	// alloy moving forward by clicking the image as well
	viewerImg.addEventListener('click', function(){
		changeImage('next');
	});

	viewer.append(overlay);
	viewer.append(viewerImg);
	document.getElementsByTagName("BODY")[0].append(viewer);

}

/**
 * Remove the viewer from the page and clear its reference so that it
 * can be garbage collected
 * @return {void}
 */
function removeViewer(){
	if (viewer){
		viewer.parentNode.removeChild(viewer);
		viewer = null;
		currentImageIndex = 0;
	}
}

/**
 * Register keyboard bindings
 * a, h : previous
 * d, l : next
 * ESC  : exit viewer
 * @param  {Object} e Keycode event
 * @return {void}
 */
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

/**
 * Switch out the visible image in the viewer to the prev/next image in the
 * album
 * @param  {String} changeTo can be 'prev' or 'next'
 * @return {void}
 */
function changeImage(changeTo){
	if (changeTo === 'next'){
		currentImageIndex++;
	} else if (changeTo === 'prev'){
		currentImageIndex--;
	}
	viewerImg.src = imageLinks[currentImageIndex];
	preloadImages();
}

/**
 * Throw the previous image and next three images into non-visible elements so
 * that they are downloaded in the background
 * @return {void}
 */
function preloadImages(){
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
