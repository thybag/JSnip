/**
 * Jsnip - A Lightweight Javascript Snippeting package
 * @version 0.3.2 Alpha
 * @author: Carl Saggs
 * 
 */
window.addEventListener("load",function(){

	//List of valid Snippets
	var validSnippets = Array('jsnipImageSwitcher','jsnipShowHide','jsnipTabs');
	/**
	 * parsePage
	 * Called once the page is loaded, this will check through every DIV element in the page
	 * looking for JSnip snippets. Any found will be created.
	 */
	function parsePage(){
		//Get all nodes that could be snippets
		var nodes = document.getElementsByTagName('div');
		//Check all of them
		for(var s=0;s<nodes.length;s++){
			//If they happen to be a snippet, call the relevnt snippet function
			if(type = base.classMatch(nodes[s],validSnippets)){
				//Call function of the same name (as found in snippet)
				new snippet[type](nodes[s]);

			}
		}
	}
	/**
	 * snippet
	 * JSnip Snippets are contained within this function.
	 */
	var snippet = new function(){
		/**
		 * Image Switcher
		 * Create an image Switcher from provided node
		 * @param Node defined as Image Switcher
		 */
		this.jsnipImageSwitcher = function(node){
			var images = node.getElementsByTagName('img');//Get images contained
			var current = 0;
			//Create control bar DOM object
			var n = document.createElement('div');
			n.className ='bar';
			node.appendChild(n);
			//Create tagline
			var tagLine = document.createElement('div');
			tagLine.className = 'tagLine';
			
			var scrollChange = function(evt) {
				//Get array of all the buttons, then make them show as inactive
				buttonAr = this.parentNode.getElementsByTagName('span');
				for(var a=0;a<buttonAr.length;a++){
					base.removeClass(buttonAr[a],'active');
				}
				//Make the clicked button the new active one.
				base.addClass(this,'active');
				
				//Update the current image index (store old, so we can still use it temporairly)
				old = current;
				current = this.getAttribute('idx');
				//Update tagline with the new title
				tagLine.innerHTML = images[current].getAttribute('alt');
				//Fade old image out, fade new image in.
				base.animate.fadeOut(images[old],function(){
					base.animate.fadeIn(images[current]);
				});				
			}
			//Loop threw images to actually set the snippet up.
			for(var i=0;i<images.length;i++){
				//If its not the very first image, make it invisable.
				if(i!==0) images[i].style.display = 'none';
				//Create the link element (button used to change image)
				
				var l = document.createElement('span');
				l.innerHTML = '.';
				l.setAttribute('idx',i);
				n.appendChild(l);
		
				//Make the first image's button active and set the tagline with its alt attribute.
				if(i==0){ 
					base.addClass(l,'active');
					tagLine.innerHTML = images[i].getAttribute('alt');
				}
				//If a scroll button gets clicked.
				l.addEventListener('click',scrollChange,false);
			}   
			//add the tagline to the page
			n.appendChild(tagLine);
		}
		
		/**
		 * showHide
		 * Create an showHide from provided node
		 * @hint title Attribute is the text show
		 * @hint itemtype Attribute can be set to "open" to make snippet open by default
		 *
		 * @param Node defined as showHide
		 */
		this.jsnipShowHide = function(node){
		
			//If a title node already exits, use it rather than creating a new one.
			//Stores title node in TitleBar
			test = node.getElementsByTagName('div')[0];
			if(test && test.className == 'title'){
				//titleText = node.getElementsByTagName('div')[0].innerHTML;
				var titleBar = test.cloneNode(true);
				base.remove(test);
			}			
			
			//Test if inner exists
			test = node.getElementsByTagName('div')[0];
			if(test && test.className == 'inner'){
				var inner = test;
			}else{
				//create div to encapsolate content of showHide
				var inner = document.createElement('div');
				inner.className = 'inner';
				inner.innerHTML = node.innerHTML;
				//Blank real div
				node.innerHTML = '';
				node.appendChild(inner);
			}
			
			
			//Set up the showHide function
			this.showHide = function(){
				if(inner.style.display == 'none'){ 
					base.animate.slideDown(inner);
					base.rotate(arrow,0);
				}
				else{
					base.animate.slideUp(inner);
					base.rotate(arrow,180);
				}
				
			}
			
			//If a titleBar node doesn't exist, create a new one
			if(titleBar == null){
				//Create the new title bar
				var titleBar = document.createElement('div');
				titleBar.className = 'title';
				//Add the correct name
				if(node.title){
					titleBar.innerHTML = node.title;
				}else{
					titleBar.innerHTML = "Unknown";
				}
			}
			//attach the onclick
			titleBar.addEventListener('click',this.showHide,false);
			
			base.prepend(titleBar,node);
			
			//Create arrow in Canvas (who needs images :p )
			var arrow = document.createElement('canvas');
			arrow.className = 'arrow';
			arrow.width = 18;
			arrow.height = 8;
			arrow.style.cssFloat = 'right';
			titleBar.appendChild(arrow);
			
			a = arrow.getContext("2d");
			a.beginPath();
			a.moveTo(9, 0)
			a.lineTo(0, 8);
			a.lineTo(18, 8);
			a.lineTo(9, 0);
			a.fillStyle = "rgb(255,255,255)";
			a.fill();
				
			
			if(node.getAttribute('itemtype') != 'open'){
				inner.style.display = 'none';
				base.rotate(arrow,180);
			}
			
		}
		/**
		 * Tabs
		 * Create a set of Tabs from provided node
		 * @hint All first Level div's are assumed to be Tabs
		 * @hint Each tab must contain an H2 which will become the tab title.
		 *
		 * @param Node defined as Tabs
		 */
		this.jsnipTabs = function(node){
			//Get all the divs we want to make in to tabs
			var tabs = node.childNodes;
			//Clean it up by removing the irrelevnt nodes;
			for(var t=0;t<tabs.length;t++){
				if(tabs[t].nodeName != 'DIV'){
					node.removeChild(tabs[t]);
				}
			}
			//Create Tab Bar
			var tabBar = document.createElement('ul');
			tabBar.className = 'tabBar';
			var currentTab=1;
			
			var changeTab = function(){
				//Unhighlight all the old tabs
				toptabs = this.parentNode.getElementsByTagName('li');
				for(var a=0;a<toptabs.length;a++){
					base.removeClass(toptabs[a],'active');
				}
				//Highlight current tab
				base.addClass(this,'active');
				//Hide the old Tab inner, update the currentTab, then show the new one.
				tabs[currentTab].style.display = 'none';
				currentTab = parseInt(this.getAttribute('idx'))+1;//ignore our tablist
				tabs[currentTab].style.display = 'block';
			}
			//For each potental Tab
			for(var t=0;t<tabs.length;t++){
				tabs[t].className = 'tabContent';
				
				if(tabs[t].title){
					//Use title node in div.
					titleText = tabs[t].title;
				}else{
					//get Title node from document
					titleNode = tabs[t].getElementsByTagName('h2')[0];
					//If this node has no title, set title as unknown.
					if(titleNode != null) {
						titleText = titleNode.innerHTML;
						//Remove the title node once it has been used for a tab.
						tabs[t].removeChild(titleNode);
					}else{
						titleText = 'unknown';
					}
				}
				//Create the Tab itself
				li = document.createElement('li');
				li.setAttribute('idx',t);
				li.innerHTML = titleText;		
				//Make the first tab active	
				if(t == 0){base.addClass(li,'active');}
				//Add the tab to the Tab bar.
				tabBar.appendChild(li);
				
				//hide the tab contents of inactive tabs
				if(t != 0){
					tabs[t].style.display = 'none';
				}
				
				//Attach action to tab click
				li.addEventListener('click', changeTab,false);

			}
			base.prepend(tabBar,node);
		}
	}
	
	//Run the parser
	parsePage();
 },false);
 
 /**
 * Base provides a set of useful JavaScript functions for use by the
 * JSnip Snippets.
 * @author Carl Saggs
 * @version 0.3 Alpha
 *
 * Base.animation provides the animation functions used.
 */
var base = new function(){
	/**
	 * classMatch
	 * Does this node have a class contained the the provided array
	 * @param node DOM Node
	 * @param validArray Array of Class Names
	 */
	this.classMatch = function(node,validArray){
		//If the node only has the one class.
		if(node.className.indexOf(' ') == -1){
			for(var v=0;v<validArray.length;v++){
				if(node.className == validArray[v]) return validArray[v];
			}
		//If the node has multiple class's
		}else{
			for(var v=0;v<validArray.length;v++){
				if(node.className.indexOf(validArray[v]) != -1) return validArray[v];
			}
		}
	}
	/**
	 * addClass
	 * add's a CSS class to a DOM node.
	 * @param node DOM Node
	 * @param nclass Name of class to apply
	 */
	this.addClass = function(node,nclass){
		if(node.className.indexOf(nclass) !== -1) return;//if already exists
		node.className = node.className+' '+nclass;
	}
	/**
	 * removeClass
	 * removes a CSS class to a DOM node.
	 * @param node DOM Node
	 * @param nclass Name of class to remove
	 */
	this.removeClass = function(node,nclass){
		if(node.className.indexOf(nclass) == -1) return;//if we dont have this class
		if(node.className.indexOf(' ') == -1){ node.className = nclass; return;}//if this is the only class
		node.className = node.className.replace(nclass,'');
	}
	/**
	 * prepend
	 * Add's one DOM node to the start of another.
	 * @param node DOM Node to add
	 * @param parent DOM Node to place first node in to
	 */
	this.prepend = function(node,parent){
		parent.insertBefore(node,parent.firstChild);
	}
	/**
	 * Remove
	 * Remove a node from the DOM
	 * @param node DOM Node to remove
	 * @return Copy of the removed node.
	 */
	this.remove = function(node){
		node.parentNode.removeChild(node);
	}
	/**
	 * Rotate
	 * Rotates a Node to a given angle
	 * @param node DOM Node
	 * @param rotation int 
	 */
	this.rotate = function(node,rotation){
		node.style.MozTransform="rotate("+rotation+"deg)";
		node.style.WebkitTransform="rotate("+rotation+"deg)";
		node.style.OTransform="rotate("+rotation+"deg)";
		node.style.msTransform="rotate("+rotation+"deg)";
		node.style.Transform="rotate("+rotation+"deg)";
	}
	/**
	 * ajaxGet
	 * Untested and currently not in use.
	 * @param path to open
	 * @param callback fucntion
	 */
	this.ajaxGet = function(location,callback){
		try {xmlhttp = window.XMLHttpRequest?new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");}  catch (e) { }
			xmlhttp.onreadystatechange = function(){
				if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
					callback(xmlhttp.responseText);
				}
			}
			xmlhttp.open("GET", location, true);
			xmlhttp.send(null);
	}
	/**
	 * ajaxGetJSON
	 * Gets a JSON file from the server and returns a JSON object
	 * @param path to JSON file.
	 * @param callback fucntion
	 */
	this.ajaxGetJSON = function(location,callback){
		var cback = callback;
		this.ajaxGet(location, function(json){
			if(JSON){
				var parsed = JSON.parse(json);
				cback(parsed);
			}
			//Fallback is disabled by default for securty reasons.
			//cback(eval('('+json+')'));
		});
	}
	/**
	 * Base.animate provides a set animation functions to the Jsnip Library
	 * @author Carl Saggs
	 * @version 0.3 Alpha
	 */
	this.animate = new function(){
		/**
		 * fadeIn
		 * Fade DOM node in.
		 * @param node DOM node
		 * @param callback function (optional)
		 */
		this.fadeIn = function(node, callback){
			var incr = 0.1;
			var cur_op = 0;
			node.style.opacity = 0;
			node.style.display = '';//Use deafult element style
			var interval = setInterval(function(){
				cur_op += incr;
				node.style.opacity = cur_op;
				if((cur_op+incr) >= 1){
					//ensure fade was completed
					node.style.opacity = 1;
					
					clearInterval(interval);
					//Call callback function is one was provided
					if(callback !=null)	callback();
				}
			}, 20);
		}
		/**
		 * fadeOut
		 * Fade DOM node out.
		 * @param node DOM node
		 * @param callback function (optional)
		 */
		this.fadeOut = function(node,callback){
			var incr = 0.1;
			var cur_op = 1;
			node.style.opacity = 1;
			var interval = setInterval(function(){
				cur_op -= incr;
				node.style.opacity = cur_op;
				if((cur_op+incr) <= 0){
					//ensure fade was completed
					node.style.display = 'none';
					node.style.opacity = 1;
					
					clearInterval(interval);
					
					//Call callback function is one was provided
					if(callback !=null)	callback();
				}
			}, 20);
		}
		/**
		 * slideDown
		 * slide DOM node down
		 * @param node DOM node
		 * @param callback function (optional)
		 * @param time int (optional)
		 */
		this.slideDown = function(node,callback,time){
			node.style.display = 'block';
			node.parentNode.style.overflow = 'hidden';
			var cur_margin = -node.offsetHeight;
			//Auto timing (if none is provided)
			if(time == null){
				time = 20;
				if(node.offsetHeight < 100)time = 10;
				if(node.offsetHeight < 50)time = 5;
			}
			var incr = parseInt(-cur_margin)/time;
			
			node.style.marginBottom = cur_margin+'px';
			var interval = setInterval(function(){
				cur_margin += incr;
				node.style.marginBottom = cur_margin+'px';
				if((cur_margin+incr) >= 0){
					//ensure fade was completed
					node.style.marginBottom = 0+'px';
					
					clearInterval(interval);
					
					//Call callback function is one was provided
					if(callback !=null)	callback();
				}
			}, 20);
			
		}
		/**
		 * slideUp
		 * slide DOM node up
		 * @param node DOM node
		 * @param callback function (optional)
		 * @param time int (optional)
		 */
		this.slideUp = function(node,callback,time){
			
			node.parentNode.style.overflow = 'hidden';
			var cur_margin = 0;
			var box_height = -node.offsetHeight;
			//Auto timing (if none is provided)
			if(time == null){
				time = 20;
				if(node.offsetHeight < 100)time = 10;
				if(node.offsetHeight < 50)time = 5;
			}
			
			var incr = parseInt(-box_height)/time;
			//node.style.marginBottom = 0+'px';
			var interval = setInterval(function(){
				cur_margin -= incr;
				node.style.marginBottom = cur_margin+'px';
				if((cur_margin-incr) <= box_height){
					node.style.display = 'none';
					//ensure fade was completed
					node.style.marginBottom = 0+'px';
					
					clearInterval(interval);
					
					//Call callback function is one was provided
					if(callback !=null)	callback();
				}
			}, 20);
			
		}
	}
	
}
 