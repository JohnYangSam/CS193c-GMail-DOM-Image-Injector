/**
    This is the example app using the Gmailr API.
    In this file, you have access to the Gmailr object.
 */
/* JavaScript */
/* Correct JLint for the browser and Google libraries */
/*jslint browser: true, devel: true, plusplus: true, vars: true*/
/*global getElementById: true, chrome: true, Gmailr: true, $: true*/

Gmailr.debug = true; // Turn verbose debugging messages on 

function getMethods(obj) {
  var result = [];
  for (var id in obj) {
    try {
      if (typeof(obj[id]) == "function") {
        result.push(id + ": " + obj[id].toString());
      }
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result;
}

function jqColonReplace(selector) {
    return selector.replace(/:/, '\\\\:');
}

Gmailr.init(function (G) {
    G.insertCss(getData('css_path'));
	var canvas = G.elements.canvas;	
	var body = G.elements.body;
	var nBody = $("body", canvas);
	console.log(nBody);
	var iframes = $("iframe", nBody);
	var iframe = iframes[0];
	var next = iframe.contentDocument;
	console.log(iframes);
	console.log("frame");
	console.log(iframe);	
	console.log("next");
	console.log(next);
	//console.log(editable);	
	G.insertTop($("<div id='gmailr'><span>Email Tracker Status:</span> <span id='status'>Loaded.</span> </div>"));
	//console.log("Box?: " + getMethods(G.elements.body));
	console.log("random");
	
	console.log( top.document.getElementsByTagName("iframe")[4].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByTagName("body"));
	//console.log( top.document.getElementById("js_frame").contentDocument);
	var status = function (msg) {
        G.$('#gmailr #status').html(msg);
    };

    G.observe('compose', function () {
        status('You composed an email.');
    });

    G.observe('reply', function (c) {
        status('You replied to an email.');
    });

});
