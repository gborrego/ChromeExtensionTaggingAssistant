/**
 * Simple, lightweight, usable local autocomplete library for modern browsers
 * Because there weren’t enough autocomplete scripts in the world? Because I’m completely insane and have NIH syndrome? Probably both. :P
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * MIT license
 */

document.addEventListener("DOMContentLoaded", function() {

(function () {

var _ = function (input, o) {
	var me = this;

	// Setup
	
		var hash = {};
		//TODO: hacer que el hash venda del servidor
		hash["Artifact"] = {name:"Artifact",parent:null,children:["TechologicalSupport", "Generated"]};
		hash["Generated"] = {name:"Generated",parent:"Artifact",children:["Documentation", "Software"]};
		hash["Documentation"] = {name:"Documentation",parent:"Generated",children:null};
		hash["Software"] = {name:"Software",parent:"Generated",children:["Component", "Code"]};
		hash["Component"] = {name:"Component",parent:"Software",children:null};
		hash["Code"] = {name:"Code",parent:"Software",children:null};
		hash["Necessity"] = {name:"Necessity",parent:null,children:null};
		hash["ArchitecturalDecision"] = {name:"ArchitecturalDecision",parent:null,children:null};
		hash["Topic"] = {name:"Topic",parent:null,children:null};
		hash["ArchitecturalView"] = {name:"ArchitecturalView",parent:null,children:null};
		hash["TechologicalSupport"] = {name:"TechologicalSupport",parent:"Artifact",children:null};
		hash["IPServicio"] = {name:"IPServicio",parent:"TechnologicalSupport",children:null};
    hash["PruebasREST "] = {name:"PruebasREST",parent:"TechnologicalSupport",children:null};
    hash["RestApikey"] = {name:"RestApikey",parent:"Code",children:null};
    hash["SeguridadRest"] = {name:"SeguridadRest",parent:"Code",children:null};
    hash["Cifrado"] = {name:"Cifrado",parent:"Code",children:null};
    hash["RespuestaREST"] = {name:"RespuestaREST",parent:"Code",children:null};
    hash["DatosPrueba"] = {name:"DatosPrueba",parent:"Code",children:null};
    hash["RecursoREST"] = {name:"RecursoREST",parent:"Code",children:null};
    hash["AngularCifrado"] = {name:"AngularCifrado",parent:"Component",children:null};
    hash["HistoriaUsuario"] = {name:"HistoriaUsuario",parent:"Documentation",children:null};
    
		
		
		
	

	this.isOpened = false;

	this.input = $(input);

	this.input.setAttribute("autocomplete", "off");
	this.input.setAttribute("aria-autocomplete", "list");

	o = o || {};

	configure(this, {
		minChars: 2,
		maxItems: 50,
		autoFirst: false,
		data: _.DATA,
		filter: _.FILTER_CONTAINS,
		sort: _.SORT_BYLENGTH,
		item: _.ITEM,
		replace: _.REPLACE,
		regexpTrigger:/#\w+(\.\w+)*\.?/ //expresión regular para identificar cuando se escribió # y un caracter de palabra
	}, o);

	this.index = -1;

	// Create necessary elements

	this.container = $.create("div", {
		className: "awesomplete",
		around: input
	});

	this.ul = $.create("ul", {
		hidden: "hidden",
		inside: this.container
	});

	this.status = $.create("span", {
		className: "visually-hidden",
		role: "status",
		"aria-live": "assertive",
		"aria-relevant": "additions",
		inside: this.container
	});

	// Bind events

	$.bind(this.input, {
		"input": this.evaluate.bind(this),
		"blur": this.close.bind(this, { reason: "blur" }),
		"keydown": function(evt) {
			var c = evt.keyCode;

			// If the dropdown `ul` is in view, then act on keydown for the following keys:
			// Enter / Esc / Up / Down
			if(me.opened) {
				if (c === 13 && me.selected) { // Enter // agregar tab
					evt.preventDefault();
					me.select();
				}
				else if (c === 27) { // Esc
					me.close({ reason: "esc" });
				}
				else if (c === 38 || c === 40) { // Down/Up arrow
					evt.preventDefault();
					me[c === 38? "previous" : "next"]();
				}
			}
		}
	});

	$.bind(this.input.form, {"submit": this.close.bind(this, { reason: "submit" })});

	$.bind(this.ul, {"mousedown": function(evt) {
		var li = evt.target;

		if (li !== this) {

			while (li && !/li/i.test(li.nodeName)) {
				li = li.parentNode;
			}

			if (li && evt.button === 0) {  // Only select on left click
				evt.preventDefault();
				me.select(li, evt.target);
			}
		}
	}});

	this.hashTable = hash || {}; // para poder recibir un hashTable con todos los elementos y sus hijos
	_.all.push(this);
};

_.prototype = {
	set hashTable(hashTable) {
		if (typeof hashTable === "object"){
			this._hashTable = hashTable;
			this._list = [];
			for(var x in hashTable)
				this._list.push(x);
			this._wholeList = this._list;
			this._previousValue = "";
			this._previousWord = "";
			this._currentNode = null;
			this._indexOfHash = -1; // el indice del # de la palabra actual
			this._indexOfDot = -1; // el indice del último . de la palabra actual
			this._currentWord = null;
		}

		if (document.activeElement === this.input) {
			this.evaluate();
		}
	},
	get selected() {
		return this.index > -1;
	},

	get opened() {
		return this.isOpened;
	},

	close: function (o) {
		if (!this.opened) {
			return;
		}

		this.ul.setAttribute("hidden", "");
		this.isOpened = false;
		this.index = -1;

		$.fire(this.input, "awesomplete-close", o || {});
	},

	open: function () {
		this.ul.removeAttribute("hidden");
		this.isOpened = true;

		if (this.autoFirst && this.index === -1) {
			this.goto(0);
		}

		$.fire(this.input, "awesomplete-open");
	},

	next: function () {
		var count = this.ul.children.length;
		this.goto(this.index < count - 1 ? this.index + 1 : (count ? 0 : -1) );
	},

	previous: function () {
		var count = this.ul.children.length;
		var pos = this.index - 1;

		this.goto(this.selected && pos !== -1 ? pos : count - 1);
	},

	// Should not be used, highlights specific item without any checks!
	goto: function (i) {
		var lis = this.ul.children;

		if (this.selected) {
			lis[this.index].setAttribute("aria-selected", "false");
		}

		this.index = i;

		if (i > -1 && lis.length > 0) {
			lis[i].setAttribute("aria-selected", "true");
			this.status.textContent = lis[i].textContent;

			$.fire(this.input, "awesomplete-highlight", {
				text: this.suggestions[this.index]
			});
		}
	},

	select: function (selected, origin) {
		if (selected) {
			this.index = $.siblingIndex(selected);
		} else {
			selected = this.ul.children[this.index];
		}

		if (selected) {
			var suggestion = this.suggestions[this.index];

			var allowed = $.fire(this.input, "awesomplete-select", {
				text: suggestion,
				origin: origin || selected
			});

			if (allowed) {
				this.replace(suggestion);
				this.close({ reason: "select" });
				$.fire(this.input, "awesomplete-selectcomplete", {
					text: suggestion
				});
				if (this._hashTable !== null)
					this._currentNode = this._hashTable[suggestion.label];
			}
		}
	},

	getCurrentNode: function(splitedCurrentWord){
		if (splitedCurrentWord[splitedCurrentWord.length-1]==="")
			splitedCurrentWord.pop();
		for(var i=splitedCurrentWord.length-1;i>=0;i--){
			let item = splitedCurrentWord[i];
			if (this._hashTable[item])
				return this._hashTable[item];
		}
		return null;
	},

	getCurrentWord: function (value,selectionStart){
		var spaceSplited = value.split(" ");
		var totalCaracteres = 0;
		var posActual = selectionStart-1;
		for(var i=0;i<spaceSplited.length;i++){
			let item = spaceSplited[i];
			let max = totalCaracteres+item.length-1, min = totalCaracteres;
			totalCaracteres += item.length+1;
			if (posActual>=min && posActual<=max){
				var currentWord = new Object();
				currentWord.word = item;
				currentWord.initialIndex = min;
				currentWord.finalIndex = max;
				currentWord.index = i;
				return currentWord;
			}
		}
		return null;
	},

	evaluate: function() {
		var me = this;
		var value = this.input.value;
		this._currentWord = this.getCurrentWord(value,this.input.selectionStart);
		var txtToSearch = "";

		if (this._currentWord !== null && this.regexpTrigger.test(this._currentWord.word)){
			var splitedCurrentWord = this._currentWord.word.split(".");
			var isAnotherWord = this._previousWord!==null && this._previousWord.index !== this._currentWord.index;
			var isDeleting = this._previousValue.length>value.length;
			if(isAnotherWord || this._currentNode===null || (!isAnotherWord && isDeleting))
				this._currentNode = this.getCurrentNode(splitedCurrentWord);

			var relativeIndexOfDot = this._currentWord.word.lastIndexOf(".");
			this._indexOfHash = this._currentWord.initialIndex;
			this._indexOfDot = relativeIndexOfDot===-1 ? -1 : relativeIndexOfDot + this._currentWord.initialIndex;

			this._list = this._currentNode!==null ? (this._currentNode.children  || []) : this._wholeList;

			txtToSearch = relativeIndexOfDot===-1 ? this._currentWord.word.substr(1)
				: txtToSearch = splitedCurrentWord[splitedCurrentWord.length-1];
			this.suggestions = this._list
				.map(function(item) {
					return new Suggestion(me.data(item, txtToSearch));
				})
				.filter(function(item) {
					return me.filter(item, txtToSearch);
				})
				.sort(this.sort)
				.slice(0, this.maxItems);

			this.ul.innerHTML = "";
			this.suggestions.forEach(function(text) {
					me.ul.appendChild(me.item(text, value));
				});

			if (this.ul.children.length === 0)
				this.close({ reason: "nomatches" });
			else
				this.open();
		}
		else {
			this.close({ reason: "nomatches" });
		}
		this._previousValue = this.input.value;
		this._previousWord = this._currentWord;
	}
};

// Static methods/properties

_.all = [];

_.FILTER_CONTAINS = function (text, input) {
	return RegExp($.regExpEscape(input.trim()), "i").test(text);
};

_.FILTER_STARTSWITH = function (text, input) {
	return RegExp("^" + $.regExpEscape(input.trim()), "i").test(text);
};

_.SORT_BYLENGTH = function (a, b) {
	if (a.length !== b.length) {
		return a.length - b.length;
	}

	return a < b? -1 : 1;
};

_.ITEM = function (text, input) {
	var html = input.trim() === '' ? text : text.replace(RegExp($.regExpEscape(input.trim()), "gi"), "<mark>$&</mark>");
	return $.create("li", {
		innerHTML: html,
		"aria-selected": "false"
	});
};

_.REPLACE = function (text) {
	var before = this._indexOfDot === -1 ? this.input.value.substring(0,this._indexOfHash+1)
		: this.input.value.substring(0,this._indexOfDot+1);
	var after = this.input.value.substr(this._currentWord.finalIndex+1);
	var indexAfter = before.length+text.value.length;
	this.input.value = before + text.value + after;
	this._previousValue = this.input.value;
	this.input.selectionStart = this.input.selectionEnd = indexAfter;
};

_.DATA = function (item/*, input*/) { return item; };

// Private functions

function Suggestion(data) {
	var o = Array.isArray(data)
	  ? { label: data[0], value: data[1] }
	  : typeof data === "object" && "label" in data && "value" in data ? data : { label: data, value: data };

	this.label = o.label || o.value;
	this.value = o.value;
}
Object.defineProperty(Suggestion.prototype = Object.create(String.prototype), "length", {
	get: function() { return this.label.length; }
});
Suggestion.prototype.toString = Suggestion.prototype.valueOf = function () {
	return "" + this.label;
};

function configure(instance, properties, o) {
	for (var i in properties) {
		var initial = properties[i],
		    attrValue = instance.input.getAttribute("data-" + i.toLowerCase());

		if (typeof initial === "number") {
			instance[i] = parseInt(attrValue);
		}
		else if (initial === false) { // Boolean options must be false by default anyway
			instance[i] = attrValue !== null;
		}
		else if (initial instanceof Function) {
			instance[i] = null;
		}
		else {
			instance[i] = attrValue;
		}

		if (!instance[i] && instance[i] !== 0) {
			instance[i] = (i in o)? o[i] : initial;
		}
	}
}

// Helpers

var slice = Array.prototype.slice;

function $(expr, con) {
	return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
}

function $$(expr, con) {
	return slice.call((con || document).querySelectorAll(expr));
}

$.create = function(tag, o) {
	var element = document.createElement(tag);

	for (var i in o) {
		var val = o[i];

		if (i === "inside") {
			$(val).appendChild(element);
		}
		else if (i === "around") {
			var ref = $(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);
		}
		else if (i in element) {
			element[i] = val;
		}
		else {
			element.setAttribute(i, val);
		}
	}

	return element;
};

$.bind = function(element, o) {
	if (element) {
		for (var event in o) {
			var callback = o[event];

			event.split(/\s+/).forEach(function (event) {
				element.addEventListener(event, callback);
			});
		}
	}
};

$.fire = function(target, type, properties) {
	var evt = document.createEvent("HTMLEvents");

	evt.initEvent(type, true, true );

	for (var j in properties) {
		evt[j] = properties[j];
	}

	return target.dispatchEvent(evt);
};

$.regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

$.siblingIndex = function (el) {
	/* eslint-disable no-cond-assign */
	for (var i = 0; el = el.previousElementSibling; i++);
	return i;
};

// Initialization

function init() {
	$$("input.awesomplete").forEach(function (input) {
		new _(input);
	});
}

// Are we in a browser? Check for Document constructor
if (typeof Document !== "undefined") {
	// DOM already loaded?
	if (document.readyState !== "loading") {
		init();
	}
	else {
		// Wait for it
		document.addEventListener("DOMContentLoaded", init);
	}
}

_.$ = $;
_.$$ = $$;

// Make sure to export Awesomplete on self when in a browser
if (typeof self !== "undefined") {
	self.Awesomplete = _;
}

// Expose Awesomplete as a CJS module
if (typeof module === "object" && module.exports) {
	module.exports = _;
}

return _;

}());
});