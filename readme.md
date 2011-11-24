JSnip - A JavaScript Snipping package
---------------------

**JSnip** is a lightweight JavaScript based Snipping package, aimed at those who want to add interactive 
elements to their webpages but lack the necessary JavaScript knowledge to do so.

This version of JSnip contains six snippets types:

* JsnipTabs
* JsnipShowHide
* JsnipImageSwitcher
* JsnipScrollToTop and JsnipScrollToAnchor
* jsnipLightBox 

A sample page showing all theses snippets in action can be seen [here](http://userbag.co.uk/demo/jsnip/sample.htm).

### Browser support

JSnip has been tested to run in:

* Chrome
* Firefox 3.5, 3.6, 4, 5 and 6
* IE 9 (CSS3 transitions are unsupported, Ajax functions untested for IE8/7)
* Andorid Browser
* IOS Browser

### Change Log

#### 1.5.3
* Correct scopeing bug in base.js

#### 1.5.2
* In accordances with some changes in the HTML5 spec, have switched from using itemprops to data items for additional paramiters.
* Brand new sample page, including instructions.
* Styling tweaks.

#### 1.5.1
* Signifcantly improve scaling system for lightBox (now actually takes height in to account)
* Loading image added + checks to ensure image is loaded before grabbing width/height
* Doesn't just assume alt text exists (checks)
* Add ability to specifiy larger image useing itemprop (thumb can connect to big image for lightbox)
* Base now correctly gets browser center location in IE8/7

#### 1.5
* Fixed firefox bug with ImageSwitcher
* Added Lightbox Snippet
* Added custom animation for lightbox.
* Added getCenterCoord, getDocumentSize, getBrowserWidth and getBrowserHeight methods to base.
* Bugfix to crossFade effect (images of differnt sizes)
* Styling tweaks to fix IE ImageSwitcher issue (InfoBar flickered)
* Multiple minor bug fix's

#### 1.4
* Added support for IE7, IE8 and IOS
* Multiple bug fix's
* Two new snippets (JsnipScrollToAnchor and JsnipScrollToTop)
* Scroll animation type added to base
* Cross fade effect added to Image Switcher
* getCoords method added to base
* Jsnip now works on any element type (not just divs)


Licensing
---------------------

**MIT License**

Copyright (C) 2011 by Carl Saggs


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 
**Other**    
If you find the MIT Licence restricts you from using the provided code in the way you'd like, 
just give me a buzz and I'd be more than happy to provide it to you under whatever licence satisfies 
your needs. 

Quick start guide.
---------------------
Please see [this article](http://userbag.co.uk/development/introducing-jsnip/) for a more complete/readable guide.

1. Upload jsnip.min.js, base.min.js and Jsnip.css on to your web server and import them in your documents header. 
   Ensure base is imported before jsnip.

2. To add a snippet, simply create a DIV with the relevant class name.


**ShowHide**

Requires class: *jsnipShowHide*

Other Attributes:
Title: Text show on the showHide bar itself.   
data-mode: When set to open, the snippet will default to display as open.

Example:

    <div class='jsnipShowHide' title='Title for your ShowHide' >
        Show Hide Content
    </div>


**Tabs**

Requires class: *jsnipTabs*

All divs inside the JSnipTabs are considered to be Tabs.   
The first H2 inside each Tab is considered to the tabs title.


Example:

    <div class='jsnipTabs'>
        <div>
            <h2>Tab 1</h2>
            Tab 1 Content! Add tab one content here.
        </div>
        <div>
            <h2>Tab 2</h2>
            Tab 2 Content! Add tab two content here.
        </div>
        <div>
            <h2>Tab 3</h2>
            Tab 3 Content! Add tab 3 content here.
        </div>
    </div>


**Image Switcher**

Requires class: *jsnipImageSwitcher*

Must contains a number of image tags.   
The alt attribute of each image is used as the caption.

Other Attributes:     
data-animation: crossFade (expermental transition type)

Example:

    <div class="jsnipImageSwitcher">
        <img src="/demo/img/skunk.jpg" alt="A baby skunk!" />
        <img src="/demo/img/otter.jpg" alt="An otter" />
        <img src="/demo/img/bunny.jpg" alt="A Bunny Rabbit" />
    </div>
	
**Scroll to top**

Requires class: *JsnipScrollToTop*

Will add event to node that scrolls browser back to top of the page.

Example:

    <div class="jsnipScrollToTop">Top of Page</div>
	
	
**Scroll to Anchor**	
	
Requires class: *JsnipScrollToAnchor*

Will scroll browser window to the position of any Node with an ID matching that specified
in the links href

Example:

      <a href='#AnchorWithID' class="jsnipScrollToAnchor">Go to "AnchorWithID"</a>
	  
	  
**LightBox Effect**	
	
Requires class: *jsnipLightBox *

Other Attributes:
data-image: You can use this value specifiy the URL to a larger version of the image for use with the lightbox

Apply the jsnipLightBox class to an image, to making clicking on it cause the image to open in a LightBox

Example:

      <img src='mydir/myimage.jpg' class='jsnipLightBox' />
	
	
	
	