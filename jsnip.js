/**
 * Jsnip - A Lightweight Javascript Snippeting package
 * @version 0.5.2 alpha
 * @author: Carl Saggs
 * @source https://github.com/thybag/JSnip
 */
base.onLoad(function(){
	//List of valid Snippets
	var validSnippets = Array(
		'jsnipImageSwitcher',
		'jsnipShowHide',
		'jsnipTabs',
		'jsnipScrollToTop',
		'jsnipScrollToAnchor',
		'jsnipLightBox'
	);
	/**
	 * parsePage
	 * Called once the page is loaded, this will check through every DIV element in the page
	 * looking for JSnip snippets. Any found will be created.
	 */
	function parsePage(){
		//Get all nodes that could be snippets
		var nodes = document.getElementsByTagName('*');
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
			
			//Firefox Fix (IE9 and Chrome are happy, yet firefox isn't - weird?)
			if(navigator.userAgent && (navigator.userAgent.indexOf('Firefox') != -1)){
				n.style.marginTop= '-30px';
				n.style.marginBottom= '';
				n.style.position = 'static';
			}
			
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
				if(node.getAttribute('data-animation') == 'crossFade'){
					animating=true;
					
					//Fiddle positioning so images site on top of each other
					if(old<current){underImg = old;}else{underImg = current;}
					images[underImg].style.position ='absolute';
					images[underImg].style.width = node.style.width;
					
					//Run fades at the same time (ish)
					base.animate.fadeOut(images[old],function(){images[underImg].style.position ='';images[underImg].style.width = '';},660);
					base.animate.fadeIn(images[current],function(){animating=false;},60);
		
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
		 * @hint data-mode Attribute can be set to "open" to make snippet open by default
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
			
			if(node.getAttribute('data-mode') != 'open'){
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
		 * ScrollToAnchor
		 * Scroll to an Anchor in the page
		 */
		this.jsnipScrollToAnchor = function(node){
			//Extract Id from # (IE7 doesnt do this for us with getAttribute)
			hash = node.getAttribute("href");
			if(hash.indexOf('#') == -1){
				//no # = invalid link
				base.log("href is not pointed at an anchor."); 
				return;
			}else{
				//Get hash itself
				hash = hash.substr(hash.indexOf('#')+1);
			}
			//Grab node itself
			var nodeRef = base.byId(hash);
			
			//Check node was found
			if(nodeRef == null) {
				//warning
				base.log("Node with ID: "+ node.getAttribute("href")+" could be found"); 
				return;
			}
			//Attach to onClick of this node
			base.addEvent(node, 'click', function(e){
				//prevent normal action
				if(e.preventDefault){e.preventDefault();}else{e.returnValue = false;}
				
				//Get location of the #Node
				coord = base.getCoord(nodeRef);
				//Use scrollTo to animate scroll
				base.animate.scrollTo(window, coord.y ,function(){
					//Nothing
				});
			});	
		
		}
		/**
		 * ScrollToTop
		 * A simple snippet designed for use as a quick scroll to top button
		 */
		this.jsnipScrollToTop = function(node){
			//Attach to onClick of this node
			base.addEvent(node,'click', function(e){
				//Use scrollTo to animate scroll
				base.animate.scrollTo(window, 0 ,function(){
					//Nothing
				});
				//prevent normal action
				if(e.preventDefault){e.preventDefault();}else{e.returnValue = false;}
			});	
		}
		/**
		 * Lightbox
		 * Add a lightbox effect to an image.
		 *
		 * @todo Add scroll through other lightboxable images maybe?
		 */
		this.jsnipLightBox = function(node){
			//Attach to onClick of this node
			base.addEvent(node,'click', function(e){
			
				//Define Settings to use in function
				var border_t = 10,
				border_w = 30,
				box_w = 20,
				box_h = 20;
				//Set Animation time
				var time = 20;
				//Get Center
				var cent_x =base.getCenterCoord().x;
				var cent_y =base.getCenterCoord().y;
				
				//Create Overlay (dark background)
				var overlay = base.createNode('div', {}, document.body);
					overlay.style.position = 'absolute';
					overlay.style.top = '0px';
					overlay.style.left = '0px';
					overlay.style.zindex = 100;
					overlay.style.background = '#000';
					overlay.style.opacity = 0.7;
					overlay.style.filter = 'alpha(opacity=70)';
					overlay.style.width = '100%';
					overlay.style.height = base.getDocumentSize().height+'px';
				//Set up loading gif
				var lding = base.createNode('div', {'class':'loading_img'}, document.body);
				lding.style.left = cent_x-15+'px';
				lding.style.top = cent_y-15+'px';
				// Create Image Node
				var img = base.createNode('img',{});
				//This runs when the image is loaded.
				base.addEvent(img, 'load', function(e){
					base.remove(lding);
					//Create Lightbox
					var box = base.createNode('div', {'class':'jsniplightboxWindow'}, document.body);
						box.style.width = box_w+'px';
						box.style.height = box_h+'px';
						box.style.left = cent_x-(box_w/2)+'px'
						box.style.top = cent_y-(box_h/2)+'px'
					//Create InfoBar
					var bar = base.createNode('div',{'class':'infoBar'});
					
					if(node.hasAttribute){
						if(node.hasAttribute('alt')) bar.innerHTML = node.getAttribute('alt');
					}else{
						//Just assume it does
						 bar.innerHTML = node.getAttribute('alt');
					}
					//Create Close Button
					var close = base.createNode('div',{'class':'close'});
					close.innerHTML = '[close]';
					base.prepend(close, bar);
				
					//Get Image width/height + add styles
					i_width  = img.width;
					i_height = img.height;

					//Ensure width of image will allow it to fit on page (Image size, or if thats to big, window size)
					if(base.getBrowserWidth()-(border_w*2) < i_width ){
						//If not use page's max as width
						oldwidth = i_width;
						i_width = base.getBrowserWidth()-(border_w*2);
						//Scale Height accordingly
						i_height = i_height*(i_width/oldwidth);
					}
					if(base.getBrowserHeight()-(border_t*2) < i_height) {
						//If to long use page height
						oldheight = i_height;
						i_height = base.getBrowserHeight()-(border_t*2);
						//Scale Width accordingly
						i_width = i_width*(i_height/oldheight);
					}
					//Compensate for margin of error
					i_width = i_width*0.9;
					i_height = i_height*0.9;
					//Add image stylings
					img.style.height='auto';
					img.className = 'lightIMG';
					box.appendChild(img);
				
					//Work out incriments based on time
					inc_w = i_width/time;
					inc_h = i_height/time;
					
					//Begin Animation
					var interval = setInterval(function(){
						//Incriment counter
						time--;
						//Update box width & height
						box_w = box_w + inc_w;
						box_h = box_h + inc_h;
						//Apply style changes
						box.style.width = box_w+'px';
						box.style.height = box_h+'px';
						box.style.left = cent_x-(box_w/2)+'px'
						box.style.top = cent_y-(box_h/2)+'px'
						img.style.width = box_w-10+'px';//compensate for image pad
						
						//If animation is complete
						if(time == 0 || time < 0){
							//Set box styles to full positions (ensure it was completed)
							box.style.width = i_width+'px';
							box.style.height = i_height+18+'px';
							box.style.left = cent_x-(i_width/2)+'px';
							box.style.top = cent_y-(i_height/2)+'px';
							//Add InfoBar to page
							img.style.marginBottom ='0px';
							box.appendChild(bar);	
							bar.style.paddingTop ='2px';
							//Fit image correctly
							img.style.width = i_width-12+'px';
							
							//End animation
							clearInterval(interval);
						}
					},20);
					//Add onClick events to allow closing of window.
					base.addEvent(overlay,'click', function(e){
						base.remove(overlay);
						base.remove(box);
					});
					base.addEvent(close,'click', function(e){
						base.remove(overlay);
						base.remove(box);
					});
					base.addEvent(img,'click', function(e){
						base.remove(overlay);
						base.remove(box);
					});
				});
				
				//Find out if large image is avaible
				if(node.getAttribute('data-image') != null && node.getAttribute('data-image').length > 1){
					//User larger image if its specified in prop
					img.src = node.getAttribute('data-image');
				}else{
					//Else use current image src
					img.src = node.src;
				}
			});	
		}
	
	}
	//Run the parser
	parsePage();
 });