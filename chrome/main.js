/**
 * main.js
 *
 * CITATIONS: The image used for this project is from the URL: "http://i2.kym-cdn.com/entries/icons/original/000/011/065/YES%20MEME.JPG
 * (Also shown below)
 *
 * This file is the main file used to extend the GMailr library for the CS193c Final project.
 * A lot of hackery had to go into this project to get it to work since the original
 * library was out of date with the new chrome extension manifest version and used to
 * rely on looser secruity permissions that were previously available.
 *
 * This file uses a number of hacks in conjunction with the Gmailr library to traverse
 * the minified and obfuscated Gmail DOM. The DOM consists of multiple iframes nested
 * in each other. For some reason, only limited JQuery and standard tag selectors work
 * when traversing the DOM (no ID's or class names work) so the DOM had to be traversed
 * level by level, checking each time if it encountered an element out of place.
 *
 * Furthermore, it seems that Chrome has some race conditions as loading the MIT license
 * LAB library attached sometimes fails outright (as it cannot be found)!
 *
 * Our exploration in into the Gmail DOM and Google's Chrome extensions has been a great
 * learning experience. I have spent more time on this program than all three of the first
 * assignments combined and have become much more comfortable traversing the DOM and
 * really pushing to parse it out with basic JavaScript. Working with Chrome extensions
 * also involved understanding cross origin XMLHttpRequests, Content Security Policies,
 * working with JSON manifest files, getting VERY familiar with Chrome's debugging tools,
 * and how browser, web, and extension APIs work in sync to create a browsing experience.
 *
 * I even had my first pull request to an open source project (Gmailr) accepted by one 
 * of the Parse founders!
 *
 *
 * IMPORTANT USAGE NOTES:
 *
 * Since this is very much a rough product just poking at the potential of what
 * we could do with more time in JavaScript, please run this extension in Chrome
 * with the console open.
 *
 * After already being logged into Gmail Going directly to the url in your browser:
 *
 * https://mail.google.com/mail/u/0/#compose 
 *
 * wait until the blue bar at the top says that the Email Tracker has been loaded.
 * If you have a signature in your email you should see it turn red in the compose box
 * after which time when you click on the box you should see some text and and image
 * appear in the compose box.
 *
 * Sometimes, due to what we expect are race conditions in Chrome, the document or LAB
 * can not be loaded. In that case please refresh the page and wait a different time
 * before clicking!
 *
 *
 * There are a lot of weird timers and hacked looking syntax in this code. This was our
 * attempt to get around Chrome's race conditions and some odd load timing issues when
 * grabbing iframes within the DOM
 * 
 */
/* JavaScript */
/* Correct JLint for the browser and Google libraries */
/*jslint browser: true, devel: true, plusplus: true, vars: true*/
/*global getElementById: true, chrome: true, Gmailr: true, $: true, top: true*/

Gmailr.debug = true; // Turn verbose debugging messages on 
var hasInjected = false;
var lastFragment = "";
var composeBoxBackup;

var timeoutID;

var injectPic = function () {
	'use strict';
	try {
		console.log("prepping to inject picture");
		if (hasInjected) {
			return; //Return if the image has been injected
		}
		var overArchingDocument = top.document.getElementsByTagName("iframe")[4].contentDocument;
		var composeBoxDocument = overArchingDocument.getElementsByTagName("iframe")[0].contentDocument;
		var composeBoxBody = composeBoxDocument.getElementsByTagName("body")[0];

		var elem = document.createElement("h1");
		elem.innerHTML = "JOHN JUST BEASTED GMAIL!!!";
		elem.style.color = "red";

		var img = document.createElement("img");
		img.setAttribute("src", "http://i2.kym-cdn.com/entries/icons/original/000/011/065/YES%20MEME.JPG");
		img.setAttribute("alt", "http://i2.kym-cdn.com/entries/icons/original/000/011/065/YES%20MEME.JPG");
		console.log(elem);

		console.log("random");
		console.log(composeBoxBody);
		composeBoxBody.appendChild(elem);
		composeBoxBody.appendChild(img);
		console.log("-----picture injected-----");
	} catch (exeception) {
		hasInjected = false;
		console.log("Error injecting picture");
		return;
	}
	
	hasInjected = true; //To say that an injection has been made
};

/* DEPRECATED: "Unsafe because no null checks
var attemptToAddComposeBoxListenerUnSafe = function () {
	'use strict';
	if(!isOnNewFragment() || !isOnComposePage()) return; //Execute only if are on a compose page and on a new page
	var overArchingDocument = top.document.getElementsByTagName("iframe")[4].contentDocument;
	var composeBoxDocument = overArchingDocument.getElementsByTagName("iframe")[0].contentDocument;
	var composeBoxBody = composeBoxDocument.getElementsByTagName("body")[0];
	composeBoxBody.addEventListener("focus", injectPic, false);
	console.log("*****addEventListener to compose box)*****");
	hasInjected = false;
};
*/


/*
 * Checks the current fragment identifier of the page and compares it to the last
 * fragment identifier global variable. It also checks that the compose box is loaded.
 * The function returns true if both of these are true and updates the lastFragment
 * with the curr fragment if they are different or returns false if they are the same.
 */
var isOnNewFragmentAndLoaded = function () {
	'use strict';
	console.log("isOnNewFragment called");
	var currFragment = window.location.hash;
	if (currFragment !== lastFragment) {
	    console.log("on new page");
		lastFragment = currFragment;
	    return true;
	}
	console.log("on same page");
	return false;
};

/*
 * Returns true if the fragment identifier (i.e. hash) of the page is equal
 * to "#compose" and returns false otherwise
 */
var isOnComposePage = function () {
	'use strict';
	console.log("isOnComposePage called");
	console.log("Checking window Fragment Identifier (i.e. hash)");
	console.log(window.location.hash);
	if (window.location.hash === "#compose") {
		console.log("=== '#compose'");
		return true;
	} else {
		console.log("!== '#compose'");
		return false;
	}
};

/* Returns compose box or null if it does not exist */
var getComposeBoxBody = function () {
	'use strict';
	var composeBoxBody;
	try {
		var iframeArray = top.document.getElementsByTagName("iframe");
		if (iframeArray.length === 0) {
			return null;
		}
		
		var iframe = iframeArray[4];
		if ((typeof iframe === "undefined") || iframe === null || iframe.src !== "https://mail.google.com/mail/u/0/?ui=2&view=bsp&ver=ohhl4rw8mbn4") {
			return null;
		}
		var overArchDoc = iframe.contentDocument;

		var innerIframeArray = overArchDoc.getElementsByTagName("iframe");
		if (innerIframeArray.length === 0) {
			return null;
		}
		
		
		var innerIframe = innerIframeArray[0];
		if ((typeof innerIframe === "undefined") || innerIframe === null) {
			return null;
		}
	//	if (innerIframe.src !== "https://plus.google.com/u/0/_/notifications/frame?sourceid=23&hl=en&origin=https%3A%2F%2Fmail.google.com&jsh=m%3B%2F_%2Fabc-static%2F_%2Fjs%2Fgapi%2F__features__%2Frt%3Dj%2Fver%3Dpeyma3SryPk.en.%2Fsv%3D1%2Fam%3D!SQxz7F5VozeZ9_TH8Q%2Fd%3D1#pid=23&id=gbsf&parent=https%3A%2F%2Fmail.google.com&rpctoken=226823785&_methods=onError%2ConInfo%2ChideNotificationWidget%2CpostSharedMessage%2CsetNotificationWidgetHeight%2CswitchTo%2CnavigateTo%2CgetNotificationText%2CsetNotificationText%2CsetNotificationAnimation%2ChandlePosted%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart") return null;
	//	if ( innerIframe.src.substring(0,24) !== "https://plus.google.com/") {
	//		console.log("------<> Caught <>-------");
	//		return null;
	//	}
		
		var contentDoc = innerIframe.contentDocument;

		console.log("innerIframeDOCUMENT: ");
		console.log(innerIframe.contentDocument.document);

		if ((typeof contentDoc === "undefined") || contentDoc === null) {
			return null;
		}

		var composeBoxBodyArr = contentDoc.getElementsByTagName("body");
		if (composeBoxBodyArr.length === 0) {
			return null;
		}
		
		composeBoxBody = composeBoxBodyArr[0];
	} catch (exception) {
		console.log("Caught exception while looking for compose box");
		return null;
	}
	
	return composeBoxBody;
};


var attemptToAddComposeBoxListener = function () {
	'use strict';
	try {
		console.log("*****addEventListener to compose box)*****");
		hasInjected = false; //Let the 
		var composeBoxBody = getComposeBoxBody();
		composeBoxBody.addEventListener("focus", injectPic, false);
		composeBoxBody.style.color = "red";

		//Testing caching the global var here		
		composeBoxBackup = composeBoxBody;
	} catch (exception) {
		console.log("Exception caught trying to add listener to compose box");
		lastFragment = lastFragment + "i";
		return;
	}
};

var test = function () {
	'use strict';
	var iframeArray = top.document.getElementsByTagName("iframe");
	if (iframeArray.length === 0) {
		return null;
	}
	
	var iframe = iframeArray[4];
	if ((typeof iframe === "undefined") || iframe === null || iframe.src !== "https://mail.google.com/mail/u/0/?ui=2&view=bsp&ver=ohhl4rw8mbn4") {
		return null;
	}

	var overArchDoc = iframe.contentDocument;
	
	var innerIframeArray = overArchDoc.getElementsByTagName("iframe");
	if (innerIframeArray.length === 0) {
		return null;
	}
	
	var innerIframe = innerIframeArray[0];
	console.log(innerIframe.src);
};

/*
 * Checks conditions then sets the handler with a timeout delay 
 */
var checkIfAddConditionsAndDeleay = function () {
	'use strict';
	if (!isOnNewFragmentAndLoaded() || !isOnComposePage()) {
		return; //Execute only if are on a compose page and on a new page
	}
	setTimeout(attemptToAddComposeBoxListener, 500);
};

Gmailr.init(function (G) {
	'use strict';
    G.insertCss(getData('css_path'));
	G.insertTop($("<div id='gmailr'><span>CS193c Experiment Status:</span> <span id='status'>Loaded.</span> </div>"));
	setInterval(checkIfAddConditionsAndDeleay, 20);
	//setInterval(test, 100);
	var status = function (msg) {
        G.$('#gmailr #status').html(msg);
    };

    G.observe('compose', function () {
		injectPic();
		status('You composed an email.');
    });

    G.observe('reply', function (c) {
        status('You replied to an email.');
    });

});
