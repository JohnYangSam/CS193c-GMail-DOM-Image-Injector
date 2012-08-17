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

Gmailr.init(function (G) {
	'use strict';
	//Set up the top bar
	G.insertCss(getData('css_path'));
	G.insertTop($("<div id='gmailr'><span>CS193c Experiment Status:</span> <span id='status'>Loaded.</span> </div>"));

	//Takes in a target iframe
	var insertElementOnIframeBody = function (iframe) {
		var contentBody = iframe.contents().find('body');

		var elem = document.createElement("h1");
		elem.innerHTML = "JOHN JUST BEASTED GMAIL!!!";
		elem.style.color = "red";

		var img = document.createElement("img");
		img.setAttribute("src", "http://i2.kym-cdn.com/entries/icons/original/000/011/065/YES%20MEME.JPG");
		img.setAttribute("alt", "http://i2.kym-cdn.com/entries/icons/original/000/011/065/YES%20MEME.JPG");

		contentBody.append(elem);
		contentBody.append(img);
	}

	/* CASE 2)
	 * Takes care of the move to compose box through a fragment (#)
	 * Get the class 'cO' frame (and the the contents) with JQuery, bind to the document (i.e. put a
	 * handler) for a DOMInserted event that will take the event target and check its classes. If the
	 * classes match those of the compose box iframe, then pause (to fix loading issues) and call the
	 * insertElementOnIframeBody on the iframe
	 */
	$('.cO').contents().bind('DOMNodeInserted', function (event) {
		var tar = $(event.target);
		if(tar.hasClass("Am") && tar.hasClass("Al") && tar.hasClass("editable")) {
			setTimeout(insertElementOnIframeBody, 200, tar);
		}
	});

	/* CASE 1)
	 * Takes care of the case of if you go directly to the page (because the node is no longer inserted
	 * instead it is just loaded.
	 */
	var tar = $('.cO').contents().find('.Am.Al.editable');
	setTimeout(insertElementOnIframeBody, 200, tar);
	
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
