 /**
 * Base provides a set of simple but often useful javaScript functions.
 * @author Carl Saggs
 * @version 0.6.2 alpha
 * @source https://github.com/thybag/JSnip
 *
 * @module Base.animation for animation methods
 *
 * This package contains the "Sizzle CSS Selector Engine"
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses
 * @see http://sizzlejs.com/
 */
(function(){
	/**
	 * classMatch
	 * Does this node have a class contained the the provided array
	 * @param node DOM Node
	 * @param validArray Array of Class Names
	 */
	this.classMatch = function(node,validArray){
		//Helper method for Jsnip
		for(var v=0;v<validArray.length;v++){
				if(this.hasClass(node,validArray[v])) return validArray[v];
		}
	}
	/**
	 * addClass
	 * add's a CSS class to a DOM node.
	 * @param node DOM Node
	 * @param nclass Name of class to apply
	 */
	this.addClass = function(node,nclass){
		if(!this.hasClass(node,nclass)){
			node.className = node.className+' '+nclass;
		}
	}
	/**
	 * removeClass
	 * removes a CSS class to a DOM node.
	 * @param node DOM Node
	 * @param nclass Name of class to remove
	 */
	this.removeClass = function(node,nclass){
		node.className = node.className.replace(new RegExp('(^|\\s)'+nclass+'(\\s|$)'),'');
		return;
	}
	/**
	 * hasClass
	 * Checks if a DOM node has a particular Class
	 * @param node DOM Node
	 * @param nclass Name of class to apply
	 * @return boolean
	 */
	this.hasClass = function(node, nclass){
		return (node.className.match(new RegExp('(^|\\s)'+nclass+'(\\s|$)')) != null);
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
		//This is just here becuse there are so many of em.
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
			//Add standard AJAX header.
			xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
		 * @param speed Animation Speed
		 */
		this.fadeIn = function(node, callback, speed){
		
			//Calcuate animation speed
			if(!speed){speed=275;}
			var incr  = 1/(speed/20); //Speed
			
			var cur_op = 0;
			node.style.opacity = 0;
			node.style.filter = 'alpha(opacity=0)';
			node.style.display = '';//Use deafult element style
			var interval = setInterval(function(){
				cur_op += incr;
				node.style.opacity = cur_op;
				node.style.filter = 'alpha(opacity='+(cur_op*100)+')';
				if((cur_op+incr) >= 1){
					//ensure fade was completed
					node.style.opacity = 1;
					node.style.filter = 'alpha(opacity=100)';
					
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
		 * @param speed Animation Speed
		 */
		this.fadeOut = function(node, callback, speed){

			//Calcuate animation speed
			if(!speed){speed=275;}
			var incr  = 1/(speed/20); //Speed
		
			var cur_op = 1;
			node.style.opacity = 1;
			//IE
			node.style.filter = 'alpha(opacity=100)';
			var interval = setInterval(function(){
				cur_op -= incr;
				node.style.opacity = cur_op;
				node.style.filter = 'alpha(opacity='+(cur_op*100)+')';
				if((cur_op+incr) <= 0){
					//ensure fade was completed
					node.style.display = 'none';
					node.style.opacity = 1;
					node.style.filter = 'alpha(opacity=100)';
					
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
				time = 24;
				if(node.offsetHeight < 100)time = 10;
				//if(node.offsetHeight < 50)time = 5;
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
				time = 24;
				if(node.offsetHeight < 100)time = 10;
				//if(node.offsetHeight < 50)time = 5;
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
		/**
		 * scrollTo
		 * Scroll to a given position in a node. (Y axis only)
		 * @param node DOM node
		 * @param distance from top pixels
		 * @param callback function (optional)
		 */
		
		this.scrollTo = function(node, position, callback){
			//Get current scroll position
			var toScroll = node.scrollY || node.pageYOffset;
			var direction = 'up';
			//Catch IE7 if node is window
			if(isNaN(toScroll) && node==window){toScroll=document.documentElement.scrollTop;}
			//get Scroll Distance needed
			toScroll = toScroll-position;
			//Figure out direction and invert distance to scroll for downwards direction
			if(toScroll < 0){toScroll = -toScroll;  direction ='down';}
			
			//Work out timeings
			time=18;
			inc = toScroll/time;
			
			//Animate
			var interval = setInterval(function(){
				//Incriment counter
				toScroll -=inc;
				
				//Depending on direction we are scrolling work out next position
				if(direction=='up'){
					node.scrollTo(0,toScroll+position);
				}else{
					node.scrollTo(0,(-toScroll)+position);
				}
				//If we have no more distance to scroll, run completion conditions
				if(toScroll <= 0 || isNaN(toScroll)){
					node.scrollTo(0,position);
					clearInterval(interval);
					if(callback !=null)	callback();
				}
			},20);
			
		}
	}
	/**
	* createNode
	* Create a DOM node
	* @param nodeType Type of Node to create
	* @param jsonAttributes JSON object describing tag features
	* @param attach Node to place the new node in. (does nothing if not set)
	*/
	this.createNode = function(nodeType,jsonAttributes,attach){
			//Create node of type
			var node = document.createElement(nodeType);
			//Attach attributes passed
			for(var attr in jsonAttributes){
				node.setAttribute(attr,jsonAttributes[attr]);
			}
			//Append if required
			if(attach !=null && attach !== undefined){
			
				if(attach.nodeType==1){
					attach.appendChild(node);
				}else{
					this.byId(attach).appendChild(node);
				}
			}
			//IE7 force redraw?
			node.className = node.getAttribute("class");

			return node;
	}
	/**
	 * Get pixel position of a DOM Element relative
	 * to the document itself.
	 * @param node
	 * @return x,y coords object.
	 */
	this.getCoord = function(node){
	
		var my_x = node.offsetLeft;
		var my_y = node.offsetTop ;
		
		//Ugly hack to stop IE7 getting offset width and heigh added (since it seems to get it wrong)
		//IE8 gets included, but suffers no noticable side effects
		if(!(document.all && typeof document.addEventListener != 'function')){
			my_x += node.offsetWidth; 
			my_y += node.offsetHeight;
		}
		//If it has offsetParent, add em up to get the objects full position.
		if (node.offsetParent) {
			temp = node;
			while(temp = temp.offsetParent){
				my_x +=temp.offsetLeft;
				my_y +=temp.offsetTop;
			}
		}
		return {x: my_x, y: my_y};
	
	}
	/**
	 * get viewPort width
	 * @return width
	 */
	this.getBrowserWidth = function(){
		return window.innerWidth || document.documentElement.clientWidth ;
	}
	
	/**
	 * get viewPort height
	 * @return width
	 */
	this.getBrowserHeight= function(){
		return window.innerHeight || document.documentElement.clientHeight ;
	}
	
	/**
	 * get full document Size
	 * @return Object { width,height }
	 */
	this.getDocumentSize = function(){
		return {
			height:(document.height !== undefined) ? document.height : document.body.offsetHeight,
			width: (document.width !== undefined) ? document.width : document.body.offsetWidth
		}
	}
	
	/**
	 * get coords of center of viewport
	 * @return Object { x,y }
	 */
	this.getCenterCoord = function(){
		//Work out Y offset;
		yoffset = window.pageYOffset || document.documentElement.scrollTop;
		
		return {
			x: (this.getBrowserWidth()/2),
			y: (this.getBrowserHeight()/2) + yoffset
		}
	}
	
	/**
	* Get nodes using CSS selectors.
	* Uses Sizzle!
	* @param query CSS Selectors
	* @param within Node to search. If not provided uses document.
	* @return NodeList|node
	*/
	this.select = function(query, within){
		//This function requires sizzle to run
		if(!base.sizzle) return false;
		//use document is 2nd param not passed
		if(within == null || within == 'undefined') within = document;
		results = base.sizzle.find(query,document).set;
		//Return node itself if only one result
		if(results.length == 1) results = results[0];
		return results;
	}
	
	//Short Hand Function
	this.byId = function(id){
		return document.getElementById(id);
	}
	/**
	* Onload
	* Calls provided function once the page has loaded
	* @param callback function
	*/
	this.onLoad = function(callback){
		this.addEvent(window,'load',callback);
	}
	/**
	 * AddEvent
	 * Connect function call to event (Only really here to add IE compatability)
	 * @param Node to attach event too
	 * @param event to listen for
	 * @param function to run when event takes place
	 */
	this.addEvent = function(obj, event, callback){
		if(window.addEventListener){
				//Browsers that don't suck
				obj.addEventListener(event, callback, false);
		}else{
				//IE8/7
				obj.attachEvent('on'+event, callback);
		}
	}

	/**
	 * triggerEvent
	 * Fire an event on a given object
	 *
	 * @scope private
	 * @param node. Objects to fire event on
	 * @return event_name. type of event
	 */
	this.triggerEvent = function(obj, event_name){
		if (document.createEvent) {
			//Good browsers
			var evt = document.createEvent("HTMLEvents");
    		evt.initEvent(event_name, true, true);
    		obj.dispatchEvent(evt);
		}else{
			//old IE versions
			var evt = document.createEventObject();
    		evt.eventType = 'on'+ event_name;
    		obj.fireEvent(evt.eventType, evt);
		}
	}

	/**
	 * Base.log
	 * Quick function to allow snippets to throw warnings. 
	 * Will only work in browsers that include a console.
	 *
	 */
	this.log = function(msg){
		if(console) if(console.log) console.log('Warning: '+msg);
	}
	
	//Add base to global scope
	window.base = this;
}).call({});
(function(){var chunker=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,done=0,toString=Object.prototype.toString,hasDuplicate=false,baseHasDuplicate=true,rBackslash=/\\/g,rNonWord=/\W/;[0,0].sort(function(){baseHasDuplicate=false;return 0});var Sizzle=function(selector,context,results,seed){results=results||[];context=context||document;var origContext=context;if(context.nodeType!==1&&context.nodeType!==9){return[]}if(!selector||typeof selector!=="string"){return results}var m,set,checkSet,extra,ret,cur,pop,i,prune=true,contextXML=Sizzle.isXML(context),parts=[],soFar=selector;do{chunker.exec("");m=chunker.exec(soFar);if(m){soFar=m[3];parts.push(m[1]);if(m[2]){extra=m[3];break}}}while(m);if(parts.length>1&&origPOS.exec(selector)){if(parts.length===2&&Expr.relative[parts[0]]){set=posProcess(parts[0]+parts[1],context)}else{set=Expr.relative[parts[0]]?[context]:Sizzle(parts.shift(),context);while(parts.length){selector=parts.shift();if(Expr.relative[selector]){selector+=parts.shift()}set=posProcess(selector,set)}}}else{if(!seed&&parts.length>1&&context.nodeType===9&&!contextXML&&Expr.match.ID.test(parts[0])&&!Expr.match.ID.test(parts[parts.length-1])){ret=Sizzle.find(parts.shift(),context,contextXML);context=ret.expr?Sizzle.filter(ret.expr,ret.set)[0]:ret.set[0]}if(context){ret=seed?{expr:parts.pop(),set:makeArray(seed)}:Sizzle.find(parts.pop(),parts.length===1&&(parts[0]==="~"||parts[0]==="+")&&context.parentNode?context.parentNode:context,contextXML);set=ret.expr?Sizzle.filter(ret.expr,ret.set):ret.set;if(parts.length>0){checkSet=makeArray(set)}else{prune=false}while(parts.length){cur=parts.pop();pop=cur;if(!Expr.relative[cur]){cur=""}else{pop=parts.pop()}if(pop==null){pop=context}Expr.relative[cur](checkSet,pop,contextXML)}}else{checkSet=parts=[]}}if(!checkSet){checkSet=set}if(!checkSet){Sizzle.error(cur||selector)}if(toString.call(checkSet)==="[object Array]"){if(!prune){results.push.apply(results,checkSet)}else if(context&&context.nodeType===1){for(i=0;checkSet[i]!=null;i++){if(checkSet[i]&&(checkSet[i]===true||checkSet[i].nodeType===1&&Sizzle.contains(context,checkSet[i]))){results.push(set[i])}}}else{for(i=0;checkSet[i]!=null;i++){if(checkSet[i]&&checkSet[i].nodeType===1){results.push(set[i])}}}}else{makeArray(checkSet,results)}if(extra){Sizzle(extra,origContext,results,seed);Sizzle.uniqueSort(results)}return results};Sizzle.uniqueSort=function(results){if(sortOrder){hasDuplicate=baseHasDuplicate;results.sort(sortOrder);if(hasDuplicate){for(var i=1;i<results.length;i++){if(results[i]===results[i-1]){results.splice(i--,1)}}}}return results};Sizzle.matches=function(expr,set){return Sizzle(expr,null,null,set)};Sizzle.matchesSelector=function(node,expr){return Sizzle(expr,null,null,[node]).length>0};Sizzle.find=function(expr,context,isXML){var set;if(!expr){return[]}for(var i=0,l=Expr.order.length;i<l;i++){var match,type=Expr.order[i];if((match=Expr.leftMatch[type].exec(expr))){var left=match[1];match.splice(1,1);if(left.substr(left.length-1)!=="\\"){match[1]=(match[1]||"").replace(rBackslash,"");set=Expr.find[type](match,context,isXML);if(set!=null){expr=expr.replace(Expr.match[type],"");break}}}}if(!set){set=typeof context.getElementsByTagName!=="undefined"?context.getElementsByTagName("*"):[]}return{set:set,expr:expr}};Sizzle.filter=function(expr,set,inplace,not){var match,anyFound,old=expr,result=[],curLoop=set,isXMLFilter=set&&set[0]&&Sizzle.isXML(set[0]);while(expr&&set.length){for(var type in Expr.filter){if((match=Expr.leftMatch[type].exec(expr))!=null&&match[2]){var found,item,filter=Expr.filter[type],left=match[1];anyFound=false;match.splice(1,1);if(left.substr(left.length-1)==="\\"){continue}if(curLoop===result){result=[]}if(Expr.preFilter[type]){match=Expr.preFilter[type](match,curLoop,inplace,result,not,isXMLFilter);if(!match){anyFound=found=true}else if(match===true){continue}}if(match){for(var i=0;(item=curLoop[i])!=null;i++){if(item){found=filter(item,match,i,curLoop);var pass=not^!!found;if(inplace&&found!=null){if(pass){anyFound=true}else{curLoop[i]=false}}else if(pass){result.push(item);anyFound=true}}}}if(found!==undefined){if(!inplace){curLoop=result}expr=expr.replace(Expr.match[type],"");if(!anyFound){return[]}break}}}if(expr===old){if(anyFound==null){Sizzle.error(expr)}else{break}}old=expr}return curLoop};Sizzle.error=function(msg){throw"Syntax error, unrecognized expression: "+msg;};var Expr=Sizzle.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(elem){return elem.getAttribute("href")},type:function(elem){return elem.getAttribute("type")}},relative:{"+":function(checkSet,part){var isPartStr=typeof part==="string",isTag=isPartStr&&!rNonWord.test(part),isPartStrNotTag=isPartStr&&!isTag;if(isTag){part=part.toLowerCase()}for(var i=0,l=checkSet.length,elem;i<l;i++){if((elem=checkSet[i])){while((elem=elem.previousSibling)&&elem.nodeType!==1){}checkSet[i]=isPartStrNotTag||elem&&elem.nodeName.toLowerCase()===part?elem||false:elem===part}}if(isPartStrNotTag){Sizzle.filter(part,checkSet,true)}},">":function(checkSet,part){var elem,isPartStr=typeof part==="string",i=0,l=checkSet.length;if(isPartStr&&!rNonWord.test(part)){part=part.toLowerCase();for(;i<l;i++){elem=checkSet[i];if(elem){var parent=elem.parentNode;checkSet[i]=parent.nodeName.toLowerCase()===part?parent:false}}}else{for(;i<l;i++){elem=checkSet[i];if(elem){checkSet[i]=isPartStr?elem.parentNode:elem.parentNode===part}}if(isPartStr){Sizzle.filter(part,checkSet,true)}}},"":function(checkSet,part,isXML){var nodeCheck,doneName=done++,checkFn=dirCheck;if(typeof part==="string"&&!rNonWord.test(part)){part=part.toLowerCase();nodeCheck=part;checkFn=dirNodeCheck}checkFn("parentNode",part,doneName,checkSet,nodeCheck,isXML)},"~":function(checkSet,part,isXML){var nodeCheck,doneName=done++,checkFn=dirCheck;if(typeof part==="string"&&!rNonWord.test(part)){part=part.toLowerCase();nodeCheck=part;checkFn=dirNodeCheck}checkFn("previousSibling",part,doneName,checkSet,nodeCheck,isXML)}},find:{ID:function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m&&m.parentNode?[m]:[]}},NAME:function(match,context){if(typeof context.getElementsByName!=="undefined"){var ret=[],results=context.getElementsByName(match[1]);for(var i=0,l=results.length;i<l;i++){if(results[i].getAttribute("name")===match[1]){ret.push(results[i])}}return ret.length===0?null:ret}},TAG:function(match,context){if(typeof context.getElementsByTagName!=="undefined"){return context.getElementsByTagName(match[1])}}},preFilter:{CLASS:function(match,curLoop,inplace,result,not,isXML){match=" "+match[1].replace(rBackslash,"")+" ";if(isXML){return match}for(var i=0,elem;(elem=curLoop[i])!=null;i++){if(elem){if(not^(elem.className&&(" "+elem.className+" ").replace(/[\t\n\r]/g," ").indexOf(match)>=0)){if(!inplace){result.push(elem)}}else if(inplace){curLoop[i]=false}}}return false},ID:function(match){return match[1].replace(rBackslash,"")},TAG:function(match,curLoop){return match[1].replace(rBackslash,"").toLowerCase()},CHILD:function(match){if(match[1]==="nth"){if(!match[2]){Sizzle.error(match[0])}match[2]=match[2].replace(/^\+|\s*/g,'');var test=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(match[2]==="even"&&"2n"||match[2]==="odd"&&"2n+1"||!/\D/.test(match[2])&&"0n+"+match[2]||match[2]);match[2]=(test[1]+(test[2]||1))-0;match[3]=test[3]-0}else if(match[2]){Sizzle.error(match[0])}match[0]=done++;return match},ATTR:function(match,curLoop,inplace,result,not,isXML){var name=match[1]=match[1].replace(rBackslash,"");if(!isXML&&Expr.attrMap[name]){match[1]=Expr.attrMap[name]}match[4]=(match[4]||match[5]||"").replace(rBackslash,"");if(match[2]==="~="){match[4]=" "+match[4]+" "}return match},PSEUDO:function(match,curLoop,inplace,result,not){if(match[1]==="not"){if((chunker.exec(match[3])||"").length>1||/^\w/.test(match[3])){match[3]=Sizzle(match[3],null,null,curLoop)}else{var ret=Sizzle.filter(match[3],curLoop,inplace,true^not);if(!inplace){result.push.apply(result,ret)}return false}}else if(Expr.match.POS.test(match[0])||Expr.match.CHILD.test(match[0])){return true}return match},POS:function(match){match.unshift(true);return match}},filters:{enabled:function(elem){return elem.disabled===false&&elem.type!=="hidden"},disabled:function(elem){return elem.disabled===true},checked:function(elem){return elem.checked===true},selected:function(elem){if(elem.parentNode){elem.parentNode.selectedIndex}return elem.selected===true},parent:function(elem){return!!elem.firstChild},empty:function(elem){return!elem.firstChild},has:function(elem,i,match){return!!Sizzle(match[3],elem).length},header:function(elem){return(/h\d/i).test(elem.nodeName)},text:function(elem){var attr=elem.getAttribute("type"),type=elem.type;return elem.nodeName.toLowerCase()==="input"&&"text"===type&&(attr===type||attr===null)},radio:function(elem){return elem.nodeName.toLowerCase()==="input"&&"radio"===elem.type},checkbox:function(elem){return elem.nodeName.toLowerCase()==="input"&&"checkbox"===elem.type},file:function(elem){return elem.nodeName.toLowerCase()==="input"&&"file"===elem.type},password:function(elem){return elem.nodeName.toLowerCase()==="input"&&"password"===elem.type},submit:function(elem){var name=elem.nodeName.toLowerCase();return(name==="input"||name==="button")&&"submit"===elem.type},image:function(elem){return elem.nodeName.toLowerCase()==="input"&&"image"===elem.type},reset:function(elem){var name=elem.nodeName.toLowerCase();return(name==="input"||name==="button")&&"reset"===elem.type},button:function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&"button"===elem.type||name==="button"},input:function(elem){return(/input|select|textarea|button/i).test(elem.nodeName)},focus:function(elem){return elem===elem.ownerDocument.activeElement}},setFilters:{first:function(elem,i){return i===0},last:function(elem,i,match,array){return i===array.length-1},even:function(elem,i){return i%2===0},odd:function(elem,i){return i%2===1},lt:function(elem,i,match){return i<match[3]-0},gt:function(elem,i,match){return i>match[3]-0},nth:function(elem,i,match){return match[3]-0===i},eq:function(elem,i,match){return match[3]-0===i}},filter:{PSEUDO:function(elem,match,i,array){var name=match[1],filter=Expr.filters[name];if(filter){return filter(elem,i,match,array)}else if(name==="contains"){return(elem.textContent||elem.innerText||Sizzle.getText([elem])||"").indexOf(match[3])>=0}else if(name==="not"){var not=match[3];for(var j=0,l=not.length;j<l;j++){if(not[j]===elem){return false}}return true}else{Sizzle.error(name)}},CHILD:function(elem,match){var type=match[1],node=elem;switch(type){case"only":case"first":while((node=node.previousSibling)){if(node.nodeType===1){return false}}if(type==="first"){return true}node=elem;case"last":while((node=node.nextSibling)){if(node.nodeType===1){return false}}return true;case"nth":var first=match[2],last=match[3];if(first===1&&last===0){return true}var doneName=match[0],parent=elem.parentNode;if(parent&&(parent.sizcache!==doneName||!elem.nodeIndex)){var count=0;for(node=parent.firstChild;node;node=node.nextSibling){if(node.nodeType===1){node.nodeIndex=++count}}parent.sizcache=doneName}var diff=elem.nodeIndex-last;if(first===0){return diff===0}else{return(diff%first===0&&diff/first>=0)}}},ID:function(elem,match){return elem.nodeType===1&&elem.getAttribute("id")===match},TAG:function(elem,match){return(match==="*"&&elem.nodeType===1)||elem.nodeName.toLowerCase()===match},CLASS:function(elem,match){return(" "+(elem.className||elem.getAttribute("class"))+" ").indexOf(match)>-1},ATTR:function(elem,match){var name=match[1],result=Expr.attrHandle[name]?Expr.attrHandle[name](elem):elem[name]!=null?elem[name]:elem.getAttribute(name),value=result+"",type=match[2],check=match[4];return result==null?type==="!=":type==="="?value===check:type==="*="?value.indexOf(check)>=0:type==="~="?(" "+value+" ").indexOf(check)>=0:!check?value&&result!==false:type==="!="?value!==check:type==="^="?value.indexOf(check)===0:type==="$="?value.substr(value.length-check.length)===check:type==="|="?value===check||value.substr(0,check.length+1)===check+"-":false},POS:function(elem,match,i,array){var name=match[2],filter=Expr.setFilters[name];if(filter){return filter(elem,i,match,array)}}}};var origPOS=Expr.match.POS,fescape=function(all,num){return"\\"+(num-0+1)};for(var type in Expr.match){Expr.match[type]=new RegExp(Expr.match[type].source+(/(?![^\[]*\])(?![^\(]*\))/.source));Expr.leftMatch[type]=new RegExp(/(^(?:.|\r|\n)*?)/.source+Expr.match[type].source.replace(/\\(\d+)/g,fescape))}var makeArray=function(array,results){array=Array.prototype.slice.call(array,0);if(results){results.push.apply(results,array);return results}return array};try{Array.prototype.slice.call(document.documentElement.childNodes,0)[0].nodeType}catch(e){makeArray=function(array,results){var i=0,ret=results||[];if(toString.call(array)==="[object Array]"){Array.prototype.push.apply(ret,array)}else{if(typeof array.length==="number"){for(var l=array.length;i<l;i++){ret.push(array[i])}}else{for(;array[i];i++){ret.push(array[i])}}}return ret}}var sortOrder,siblingCheck;if(document.documentElement.compareDocumentPosition){sortOrder=function(a,b){if(a===b){hasDuplicate=true;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition){return a.compareDocumentPosition?-1:1}return a.compareDocumentPosition(b)&4?-1:1}}else{sortOrder=function(a,b){if(a===b){hasDuplicate=true;return 0}else if(a.sourceIndex&&b.sourceIndex){return a.sourceIndex-b.sourceIndex}var al,bl,ap=[],bp=[],aup=a.parentNode,bup=b.parentNode,cur=aup;if(aup===bup){return siblingCheck(a,b)}else if(!aup){return-1}else if(!bup){return 1}while(cur){ap.unshift(cur);cur=cur.parentNode}cur=bup;while(cur){bp.unshift(cur);cur=cur.parentNode}al=ap.length;bl=bp.length;for(var i=0;i<al&&i<bl;i++){if(ap[i]!==bp[i]){return siblingCheck(ap[i],bp[i])}}return i===al?siblingCheck(a,bp[i],-1):siblingCheck(ap[i],b,1)};siblingCheck=function(a,b,ret){if(a===b){return ret}var cur=a.nextSibling;while(cur){if(cur===b){return-1}cur=cur.nextSibling}return 1}}Sizzle.getText=function(elems){var ret="",elem;for(var i=0;elems[i];i++){elem=elems[i];if(elem.nodeType===3||elem.nodeType===4){ret+=elem.nodeValue}else if(elem.nodeType!==8){ret+=Sizzle.getText(elem.childNodes)}}return ret};(function(){var form=document.createElement("div"),id="script"+(new Date()).getTime(),root=document.documentElement;form.innerHTML="<a name='"+id+"'/>";root.insertBefore(form,root.firstChild);if(document.getElementById(id)){Expr.find.ID=function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?m.id===match[1]||typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id").nodeValue===match[1]?[m]:undefined:[]}};Expr.filter.ID=function(elem,match){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return elem.nodeType===1&&node&&node.nodeValue===match}}root.removeChild(form);root=form=null})();(function(){var div=document.createElement("div");div.appendChild(document.createComment(""));if(div.getElementsByTagName("*").length>0){Expr.find.TAG=function(match,context){var results=context.getElementsByTagName(match[1]);if(match[1]==="*"){var tmp=[];for(var i=0;results[i];i++){if(results[i].nodeType===1){tmp.push(results[i])}}results=tmp}return results}}div.innerHTML="<a href='#'></a>";if(div.firstChild&&typeof div.firstChild.getAttribute!=="undefined"&&div.firstChild.getAttribute("href")!=="#"){Expr.attrHandle.href=function(elem){return elem.getAttribute("href",2)}}div=null})();if(document.querySelectorAll){(function(){var oldSizzle=Sizzle,div=document.createElement("div"),id="__sizzle__";div.innerHTML="<p class='TEST'></p>";if(div.querySelectorAll&&div.querySelectorAll(".TEST").length===0){return}Sizzle=function(query,context,extra,seed){context=context||document;if(!seed&&!Sizzle.isXML(context)){var match=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);if(match&&(context.nodeType===1||context.nodeType===9)){if(match[1]){return makeArray(context.getElementsByTagName(query),extra)}else if(match[2]&&Expr.find.CLASS&&context.getElementsByClassName){return makeArray(context.getElementsByClassName(match[2]),extra)}}if(context.nodeType===9){if(query==="body"&&context.body){return makeArray([context.body],extra)}else if(match&&match[3]){var elem=context.getElementById(match[3]);if(elem&&elem.parentNode){if(elem.id===match[3]){return makeArray([elem],extra)}}else{return makeArray([],extra)}}try{return makeArray(context.querySelectorAll(query),extra)}catch(qsaError){}}else if(context.nodeType===1&&context.nodeName.toLowerCase()!=="object"){var oldContext=context,old=context.getAttribute("id"),nid=old||id,hasParent=context.parentNode,relativeHierarchySelector=/^\s*[+~]/.test(query);if(!old){context.setAttribute("id",nid)}else{nid=nid.replace(/'/g,"\\$&")}if(relativeHierarchySelector&&hasParent){context=context.parentNode}try{if(!relativeHierarchySelector||hasParent){return makeArray(context.querySelectorAll("[id='"+nid+"'] "+query),extra)}}catch(pseudoError){}finally{if(!old){oldContext.removeAttribute("id")}}}}return oldSizzle(query,context,extra,seed)};for(var prop in oldSizzle){Sizzle[prop]=oldSizzle[prop]}div=null})()}(function(){var html=document.documentElement,matches=html.matchesSelector||html.mozMatchesSelector||html.webkitMatchesSelector||html.msMatchesSelector;if(matches){var disconnectedMatch=!matches.call(document.createElement("div"),"div"),pseudoWorks=false;try{matches.call(document.documentElement,"[test!='']:sizzle")}catch(pseudoError){pseudoWorks=true}Sizzle.matchesSelector=function(node,expr){expr=expr.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!Sizzle.isXML(node)){try{if(pseudoWorks||!Expr.match.PSEUDO.test(expr)&&!/!=/.test(expr)){var ret=matches.call(node,expr);if(ret||!disconnectedMatch||node.document&&node.document.nodeType!==11){return ret}}}catch(e){}}return Sizzle(expr,null,null,[node]).length>0}}})();(function(){var div=document.createElement("div");div.innerHTML="<div class='test e'></div><div class='test'></div>";if(!div.getElementsByClassName||div.getElementsByClassName("e").length===0){return}div.lastChild.className="e";if(div.getElementsByClassName("e").length===1){return}Expr.order.splice(1,0,"CLASS");Expr.find.CLASS=function(match,context,isXML){if(typeof context.getElementsByClassName!=="undefined"&&!isXML){return context.getElementsByClassName(match[1])}};div=null})();function dirNodeCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){var match=false;elem=elem[dir];while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break}if(elem.nodeType===1&&!isXML){elem.sizcache=doneName;elem.sizset=i}if(elem.nodeName.toLowerCase()===cur){match=elem;break}elem=elem[dir]}checkSet[i]=match}}}function dirCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){var match=false;elem=elem[dir];while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break}if(elem.nodeType===1){if(!isXML){elem.sizcache=doneName;elem.sizset=i}if(typeof cur!=="string"){if(elem===cur){match=true;break}}else if(Sizzle.filter(cur,[elem]).length>0){match=elem;break}}elem=elem[dir]}checkSet[i]=match}}}if(document.documentElement.contains){Sizzle.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):true)}}else if(document.documentElement.compareDocumentPosition){Sizzle.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}}else{Sizzle.contains=function(){return false}}Sizzle.isXML=function(elem){var documentElement=(elem?elem.ownerDocument||elem:0).documentElement;return documentElement?documentElement.nodeName!=="HTML":false};var posProcess=function(selector,context){var match,tmpSet=[],later="",root=context.nodeType?[context]:context;while((match=Expr.match.PSEUDO.exec(selector))){later+=match[0];selector=selector.replace(Expr.match.PSEUDO,"")}selector=Expr.relative[selector]?selector+"*":selector;for(var i=0,l=root.length;i<l;i++){Sizzle(selector,root[i],tmpSet)}return Sizzle.filter(later,tmpSet)};base.sizzle=Sizzle})();
	