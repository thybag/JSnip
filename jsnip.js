/**
 * Jsnip - A Lightweight Javascript Snippeting package
 * @version 0.3.4 alpha
 * @author: Carl Saggs
 * @source https://github.com/thybag/JSnip
 */
base.onLoad(function(){
	//List of valid Snippets
	var validSnippets = Array('jsnipImageSwitcher','jsnipShowHide','jsnipTabs','jsnipScrollToTop');
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
			//For each possible snippet
			for(var v=0;v<validSnippets.length;v++){
				//If they happen to this snippet, call the relevnt snippet function
				if(this.hasClass(nodes[s],validSnippets[v])){
					new snippet[validSnippets[v]](nodes[s]);
				}				
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
			var animating = false;
			
			//Create control bar DOM object
			var n = base.createNode('div',{'class':'bar'},node);
			//Create tagline
			var tagLine = base.createNode('div',{'class':'tagLine'});
			
			var scrollChange = function(evt) {
				//Resolve this becuse IE doesnt set it correctly
				var _this;
				if(this == window){
					_this = event.srcElement;
				}else{
					_this = this;
				}
				//Check this isnt the same image we are already displaying
				if(_this.getAttribute('idx') == current) return;
				if(animating) return;
				
				//Get array of all the buttons, then make them show as inactive
				buttonAr = _this.parentNode.getElementsByTagName('span');
				for(var a=0;a<buttonAr.length;a++){
					base.removeClass(buttonAr[a],'active');
				}
				//Make the clicked button the new active one.
				base.addClass(_this,'active');
				
				//Update the current image index (store old, so we can still use it temporairly)
				old = current;
				current = _this.getAttribute('idx');
				//Update tagline with the new title
				tagLine.innerHTML = images[current].getAttribute('alt');
				//Get animation type
				if(node.getAttribute('itemprop') == 'crossFade'){
					animating=true;
					//Fiddle positioning so images site on top of each other
					if(old<current){underImg = old;}else{underImg = current;}
					images[underImg].style.position ='absolute';
					//Run fades at the same time (ish)
					base.animate.fadeOut(images[old],function(){images[underImg].style.position ='';},650);
					base.animate.fadeIn(images[current],function(){animating=false;},700);
		
				}else{
					animating=true;
					//Fade old image out, fade new image in.
					base.animate.fadeOut(images[old],function(){
						base.animate.fadeIn(images[current],function(){animating=false;});
					});			
				}
			}
			//Loop threw images to actually set the snippet up.
			for(var i=0;i<images.length;i++){
				//If its not the very first image, make it invisable.
				if(i!==0) images[i].style.display = 'none';
				//Create the link element (button used to change image)
				
				var l = base.createNode('span',{idx:i},n);
				l.innerHTML = '.';
			
		
				//Make the first image's button active and set the tagline with its alt attribute.
				if(i==0){ 
					base.addClass(l,'active');
					tagLine.innerHTML = images[i].getAttribute('alt');
				}
				//If a scroll button gets clicked.
				base.addEvent(l,'click',scrollChange,false);
			}   
			//add the tagline to the page
			base.prepend(tagLine,n);//n.appendChild(tagLine);
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
				var inner = base.createNode('div',{'class':'inner'});
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
				var titleBar = base.createNode('div',{'class':'title'});
				//Add the correct name
				if(node.title){
					titleBar.innerHTML = node.title;
				}else{
					titleBar.innerHTML = "Unknown";
				}
			}
			//attach the onclick
			base.addEvent(titleBar,'click',this.showHide);
			
			base.prepend(titleBar,node);
			
			//Create arrow in Canvas (who needs images :p )
			var arrow = base.createNode('canvas',{'class':'arrow', 'height':'8', 'width':'18'},titleBar);
			arrow.style.cssFloat = 'right';
			if(arrow.getContext){
				a = arrow.getContext("2d");
				a.beginPath();
				a.moveTo(9, 0)
				a.lineTo(0, 8);
				a.lineTo(18, 8);
				a.lineTo(9, 0);
				a.fillStyle = "rgb(255,255,255)";
				a.fill();
			}	
			
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
			var tabBar = base.createNode('ul',{'class':'tabBar'});
			//document.createElement('ul');
			//tabBar.className = 'tabBar';
			var currentTab=1;
			
			var changeTab = function(){
				//Resolve this becuse IE doesnt set it correctly
				var _this;
				if(this == window){
					_this = event.srcElement;
				}else{
					_this = this;
				}
				//Unhighlight all the old tabs
				toptabs = _this.parentNode.getElementsByTagName('LI');
				for(var a=0;a<toptabs.length;a++){
					base.removeClass(toptabs[a],'active');
				}
				//Highlight current tab
				base.addClass(_this,'active');
				//Hide the old Tab inner, update the currentTab, then show the new one.
				tabs[currentTab].style.display = 'none';
				currentTab = parseInt(_this.getAttribute('idx'))+1;//ignore our tablist
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
				li = base.createNode('li',{idx: t});
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
				base.addEvent(li,'click', changeTab);

			}
			base.prepend(tabBar,node);
		}
		/**
		 * ScrollToTop
		 * A simple snippet designed for use as a quick scroll to top button
		 */
		this.jsnipScrollToTop = function(node){
			//Attach to onClick of this node
			base.addEvent(node,'click', function(){
				
				//Use scrollTo to animate scroll
				base.animate.scrollTo(window, 0 ,function(){
					//Nothing
				});
			});	
		}
		
		
		
	}
	//Run the parser
	parsePage();
 });