
InDepth:

The core of our CS193c project time was devoted to making progress on
the Chrome Email Tracker plugin. While the plugin looks to be in a very
rough state, a large amount of work and technologies was invested in
getting it to its current state. Technology, challenges, and efforts are
listed below.

XML
JSON
JavaScript
JQuery
Chrome Extenion APIs 
Browser Security (Content Security Policies, cross-origin
XMLHttpRequests, man in the middle attacks)
Chrome Developer Tools
Gmail DOM (obfuscation/minifcation, iframe idosyncracies)
Gmailr et al. packaged libraries
OpenSource Contribution and Pull requests

Chrome Extension APIs:
A Chrome extension consists of a central JSON manifest file, that
determines the properties (name, version, resources, permissions) of the
extension, accompanied by a set of web files (html, css, js, and other
media). To a certain extent, it is like a mini webpage, however, the
manifest file grants certain types of JavaScript files access to both
the browser APIs (such as new tabs) and the ability to make cross-origin
XMLHttpRequests.

The first part of our project involved becoming familiar with these
technologies and hacking with a couple of the examples provided by
Google. Some of these example we deconstructed and some of the
iterations of the extension can be found at
https://www.stanford.edu/~johnys/CS193C/finalProject/chromeExtensionWork/

Gmail DOM Traversal:
One we had a familiarity with Chrome's Extension APIs we began working
on the task of parsing Gmail. This was the most challenging obstacle and
the core of what we still want to develop with the plugin. Gmail's DOM
and JavaScript is obfuscated/minified. Furthermore, the web application
uses a number of iframes (instead of text areas for instance) to get
user input. These iframes load at inconsistent times, making it
extremely hard to set handlers, events, or access on them. 

Because of the cross-origin XMLHttpRequests required to inject pictures
we needed to read about Browser Security, Content Security Policies, and
man in the middle attacks. During development we also confronted
possible Chrome plugin upload race condition bugs.


Open Source:
We tried a number of libraries in an attempt to parse the Gmail DOM.
Eventually we settled on a hack using a very limited piece of the Gmailr
library. The library as we found it did not work at all, 

so I made my
first contribution to an open source project as a pull request accepted
by James Yu (Parse co-founder) (see ** at the end of thsi documen).

A lot of hackery had to go into this project to get it to work in the
limited manner that it currently does. Most of the Gmail library apart
from the raw inject functionality is broken. For some reason, only
limited JQuery and standard tag selectors work when traversing the Gmail
DOM which is further complicated by the different iframe load times.

The final code includes an assortment of tag traversal, null checks, try
catch statements, and manually tuned interval times in an attempt to get
the Gmail compose box and set the image 
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
 * There are a lot of weird timers and hacked looking syntax in this code. This was our
 * attempt to get around Chrome's race conditions and some odd load timing issues when
 * grabbing iframes within the DOM
 * 

