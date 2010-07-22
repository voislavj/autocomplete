/**
 * @author Voislav Voja Jovanovic
 * @version 1.0.0
 */


function Autocomplete(element, options) {
	
	// if autocomplete is already initialized, just return
	if(element.hasAttribute("ready")) {
		return;
	}
	element.writeAttribute("ready", "ready");
	
	// patch element's name if `multi` is on
	if(options["multi"] && !options["name"].match(/\[\]$/)) {
		options["name"] += "[]";
	}
	
	// Attach Events
	document.body.observe("click", function(){
		Autocomplete_RemoveList(element);
	});
	
	element.adjacent(".autocomplete-multi-controls").each(function(ctrl){
		ctrl.select(".autocomplete-select-all")[0].observe("click", function(){				
			Autocomplete_getCheckboxes(element).each(function(cb){
				cb.checked = true;
				cb.parentNode.addClassName("selected");
			});
		});
		ctrl.select(".autocomplete-select-none")[0].observe("click", function(){				
			Autocomplete_getCheckboxes(element).each(function(cb){
				cb.checked = false;
				cb.parentNode.removeClassName("selected");
			});
		});
		ctrl.select(".autocomplete-remove")[0].observe("click",function(){
			var rows = Autocomplete_getCheckedRows(element);
			if(rows.length>0) {
				if(confirm("You are about to remove " + rows.length + " item(s).\nDo you want to proceed?")) {
					rows.each(function(r){r.remove();})
					Autocomplete_UpdateStatus(element);
				}
			}
		});
	});
	
	element.observe("keyup", function(e){
		var el = e.target;
		
		// special keys
		switch(e.keyCode) {
			
			case 27:	// Esc
				Autocomplete_RemoveList(el);
			
			case 40:	// Arrow Down
				// focus into list
				el.adjacent("ul.autocomplete-list li:first-child a").each(function(a){
					a.focus();
					a.select();
				});
				
			case 9:		// Tab
			case 13:	// Enter
			case 17:	// Ctrl
			case 18:	// Alt
			case 19:	// Pause/Break
			case 20:	// Caps Lock
			case 33:	// PageUp
			case 34:	// PageDown
			case 35:	// End
			case 36:	// Home
			case 37:	// Arrow Left
			case 38:	// Arrow Up
			case 39:	// Arrow Right
			case 44:	// PrintScreen
			case 45:	// Insert
			case 92:	// Win
			case 93:	// Context
				// do nothing
				return;
				break;
		}
		
		Autocomplete_Stop(el);
		
		el.timeout = setTimeout(function(){
			// check keyword length
			el.value = el.value.replace(/^[\s\r\n\t]+|[\s\r\n\t]+$/g, "")
			if(el.value.length<3) return;
			
			// build POST params
			var data = "";
			if (typeof(options.glue) != "undefined") {
				data += "&glue="+escape(options.glue);
			}
			if(typeof(options.map) != "undefined") {
				if(typeof(options.map.value) != "object") {
					options.map.value = [options.map.value];
				}
				for(var i=0; i<options.map.value.length; i++) {					
					data += "&map[value][]=" + options.map.value[i];
				}
				if(typeof(options.map.label) != "object") {
					options.map.label = [options.map.label];
				}
				for(var i=0; i<options.map.label.length; i++) {					
					data += "&map[label][]=" + options.map.label[i];
				}
				for(var i=0; i<options.map.search.length; i++) {					
					data += "&map[search][]=" + options.map.search[i];
				}
				for(var i=0; i<options.joins.length; i++) {					
					data += "&joins[]=" + options.joins[i];
				}
			}
			if (options["multi"]) {
				el.next(".autocomplete-multi-container").select("input[type=checkbox]").each(function(e){
					data += "&skip[]=" + e.value
				});
			}
			
			// remove previous list if there's one
			Autocomplete_RemoveList(el);
			
			// reset hidden input before sending new request
			if(!options["multi"]) {
				el.parentNode.select("input[type=hidden]").first().value = "";
			}
			
			// make Request
			new Ajax.Request("/autocomplete/find/" + options.model + "/" + _esc(el.value), {
				method: "post",
				parameters: data.substr(1),
				onCreate: function(){
					el.addClassName("autocomplete-loading");
				},
				onComplete: function(req){
					el.removeClassName("autocomplete-loading");
					if(req.status==200) {
						var response = eval('(' + req.responseText + ')');
						
						var ul = new Element("ul", {
							"class": "autocomplete-list"
						});
						var position = el.positionedOffset()
						ul.setStyle({
							left: position[0] + "px",
							top: position[1] + el.getHeight() + "px"
						});
						el.insert({
							before: ul
						});
						if (response.length > 0) {
							var li, a, rem;
							for (var i = 0; i < response.length; i++) {
								// list-item
								li = new Element("li");
								if (i % 2) {
									li.addClassName("odd");
								}
								// item-value
								a = new Element("a");
								a.href = "javascript:void(0);";
								a.r = response[i];
								
								a.observe("keyup", function(e){
									switch(e.keyCode) {
										case 27:	// Esc
											Autocomplete_RemoveList(el);
											break;
										case 40:	// Arrow Down
											this.parentNode.next("li").select("a")[0].focus();
											break;
										case 38:	// Arrow Up
											this.parentNode.previous("li").select("a")[0].focus();
											break;
									}
								});
								
								a.observe("click", function(e){
									var next = this.parentNode.previous("li");
									if(next) {
										next = next.select("a")[0];
									}else{
										next = this.parentNode.next("li");
										if(next) {
											next = next.select("a")[0];
										}
									}
									if (options["multi"]) {
										var c = el.next(".autocomplete-multi-container");
										if (c.select("div.ac-" + this.r["value"]).length == 0) {
											span = new Element("div", {
												"class": "autocomplete-multi-rowset ac-" + this.r["value"]
											});
											span.observe("click", function(e){
												var chk = this.select("input[type=checkbox]")[0];
												if(e.target.hasClassName("autocomplete-multi-rowset")) {
													chk.checked = chk.checked?false:true;
												}
												if(chk.checked) {
													this.addClassName("selected");
												}else{
													this.removeClassName("selected");
												}
											});
											var id = "ac_input_" + this.r["value"];
											inpt = new Element("input", {
												"type": "checkbox",
												"name": options["name"],
												"id": id,
												"value": this.r["value"]
											});
											span.insert(inpt);
											
											label = new Element("label", {"for":id}).update(this.r["label"]);
											span.insert(label)
											
											c.insert(span);
											
											if (this.parentNode.parentNode.select("li").length == 1) {
												Autocomplete_RemoveList(el);
											}
											else {
												this.parentNode.remove();
											}
											Autocomplete_UpdateStatus(el);
										}
										Event.stop(e);
									}
									else {
										el.value = this.r["label"];
										el.title = "value: " + this.r["value"];
										el.parentNode.select("input[type=hidden]").first().value = this.r["value"];
									}
									
									// focus to previous
									if(next) next.focus()
								});
								a.innerHTML = response[i]["label"];
								li.insert(a);
								
								ul.insert(li);
							}
						}else{
							var empty = new Element("li", {"class": "empty"}).update("No results.");
							ul.insert(empty);
							setTimeout(function(){
								Autocomplete_RemoveList(el);
							}, 2000);
						}
					}else{
						//alert(req.status + ". " + req.statusText);
					}
				}
			});
			
		}, 800);
		
	});
	element.observe("keypress", function(e){
		Autocomplete_Stop(e.target);
	});
	
	
}
function Autocomplete_Stop(element) {
	var to = element.timeout;
	if(to) {
		clearTimeout(to);
		element.timeout = null;
	}
}
function Autocomplete_RemoveList(element) {
	var list = $$(".autocomplete-list");
	list.each(function(el){el.remove();});
	element.focus();
}
function Autocomplete_UpdateStatus(element) {
	var container = element.next(".autocomplete-multi-container");
	if (container) {
		element.next(".autocomplete-multi-status").select(".length").each(function(s){
			s.innerHTML = container.select(".autocomplete-multi-rowset").length+"";
		});
	}
	
}
function Autocomplete_getCheckboxes(element) {
	ret = [];
	element.adjacent(".autocomplete-multi-container")[0].select("input[type=checkbox]").each(function(cb){
		ret.push(cb);
	});
	return ret;
}
function Autocomplete_getCheckedRows(element) {
	ret = [];
	element.adjacent(".autocomplete-multi-container")[0].select("input[type=checkbox]").each(function(cb){
		if(cb.checked) {
			ret.push(cb.parentNode);
		}
	});
	return ret;
}

function _esc(str) {
	str = str + ""
	var ret = "", c;
	for(var i=0; i<str.length; i++) {
		c = str[i];
		if(!c.match(/[a-z0-9]/i)) {
			c = c.charCodeAt(0);
			c = "%" + c.toString(16);
		}
		ret += c;
	}
	return ret;
}
