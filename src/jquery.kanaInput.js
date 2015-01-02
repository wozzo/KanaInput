(function($) {
	var methods = {
		init : function(options) {
			// Initialise kanaInput			       
			var $this = $(this), settings = {
				// Default Settings
				'defaultKana': 'hiragana', // hiragana || katakana
				'shiftKana' : true // Switch between hiragana and katakana when uppercase is used
			};

			return $this.each(function() { 
				// If options exists merge into settings
				if (options) { 
					$.extend( settings, options);
				};

				// Bind events
				$this.on('beforeinput.kanaInput', methods.UpdateDisplay);

				// Set data
				$this.data('defaultKana', settings.defaultKana.toLowerCase())
					.data('shiftKana', settings.shiftKana);
			});
		},
		show : function() { $(this).css('visibility', 'visible'); },
		hide : function() { $(this).css('visibility', 'hidden'); },
		UpdateDisplay : function(event) {
			var $this, kc, currText, vowelKC, caretPos, prevChar;
			$this = $(this);
			kc = event.keyCode;
			currText = event.currentTarget.value;
			vowelKC = [65, 69, 73, 79, 85, 97, 101, 105, 111, 117, 78, 110];
			caretPos = event.currentTarget.selectionStart; // Position of caret in textbox
			prevChar = (caretPos > 0) ? currText.substring(caretPos-1, caretPos).toLowerCase() : ""; // Previous character
			if (($.inArray(kc, vowelKC) > -1) && (!event.altKey) && (!event.ctrlKey)) { // if vowel entered
				var addCode;// = ($this.data('defaultKana') == 'hiragana') ? 0 : 96; // Set default Kana
				switch ($this.data('defaultKana')) {
					case "katakana":
						addCode = 96;
						break;
					case "hiragana":						
					default:
						addCode = 0;
						break;
				}
				if ((event.shiftKey) && (kc < 95) && ($this.data('shiftKana'))) { // Set addCode if shiftKana enabled
					addCode = (addCode == 0) ? 96 : 0;
				} else if ((!event.shiftKey) && (kc < 95) && ($this.data('shiftKana'))) {
					addCode = (addCode == 0) ? 96 : 0;
				}
				// caps off kc > 95, shift off - keep as is
				// caps off kc < 95, shift on  - flick
				// caps on kc < 95, shift off - flick
				// caps on kc > 95, shift on - keep

				// Convert keycode to equivalent lower case char
				kc = String.fromCharCode(kc).toLowerCase();

				if (kc != "n") { event.preventDefault(); } // Don't enter vowel into textbox

				var repChar, prevPrevChar, noOfChars2Replace, spacing;

				repChar = "";  // Character to insert
				prevPrevChar = (caretPos > 1) ? currText.substring(caretPos-2, caretPos - 1).toLowerCase() : ""; // Previous previous character
				noOfChars2Replace = 1; //indicate how many chars should be replaced
				spacing = 2; //no. of spaces between characters for that consonant group

				switch (prevChar) { // 2 character replacements
					case "x":
					case "l":
						repChar = String.fromCharCode(12353); //little a /2
						break;
					case "k":
						repChar = String.fromCharCode(12363); //ka /2
						break;
					case "g":
						repChar = String.fromCharCode(12364); //ga /2
						break;
					case "s":
						repChar = String.fromCharCode(12373); //sa /2
						break;
					case "z":
						repChar = String.fromCharCode(12374); //za /2
						break;
					case "t":
						repChar = String.fromCharCode(12383); //ta /2/tsu+1
						break;
					case "d":
						repChar = String.fromCharCode(12384); //da /2/tsu+1
						break;
					case "n":
						repChar = String.fromCharCode(12394); //na /1
						spacing = 1;						
						break;
					case "h":
						repChar = String.fromCharCode(12399); //ha /3
						spacing = 3;						
						break;
					case "f":
						repChar = String.fromCharCode(12399); //ha /3
						spacing = 3;						
						break;
					case "b":
						repChar = String.fromCharCode(12400); //ba /3
						spacing = 3;						
						break;
					case "p":
						repChar = String.fromCharCode(12401); //pa /3
						spacing = 3;						
						break;
					case "m":
						repChar = String.fromCharCode(12414); //ma /1
						spacing = 1;						
						break;
					case "y":
						repChar = String.fromCharCode(12420); //ya /2 /1should work
						spacing = 1;						
						break;
					case "r":
						repChar = String.fromCharCode(12425); //ra /1
						spacing = 1;						
						break;
					case "w":
						repChar = String.fromCharCode(12431); //wa /-1should work
						spacing = -1;						
						break;
					case "v":
						repChar = String.fromCharCode(12436);
						spacing = 0;
						break;						
					default: // vowel or n
						noOfChars2Replace = 0;
						repChar = String.fromCharCode(12354);
						break;
				};

				if (spacing) {
					switch (kc) {
						case "a":
							break;
						case "e": 
							repChar = String.fromCharCode(repChar.charCodeAt(0) + (((prevChar == "t") || (prevChar == "d")) ? 3*spacing+1 : 3*spacing));
							break;
						case "i":
							if (prevChar == "j") {
								repChar = String.fromCharCode(12376);
								noOfChars2Replace = 1;
							} else {
								repChar = String.fromCharCode(repChar.charCodeAt(0) + spacing);
							}
							break;
						case "o":
							repChar = String.fromCharCode(repChar.charCodeAt(0) + (((prevChar == "t") || (prevChar == "d")) ? 4*spacing+1 : 4*spacing));
							break;
						case "u":
							repChar = String.fromCharCode(repChar.charCodeAt(0) + (((prevChar == "t") || (prevChar == "d")) ? 2*spacing+1 : 2*spacing));
							break;
						case "n": //n
							if (prevChar == "n") {
								repChar = String.fromCharCode(12435);
								event.preventDefault();
							} else {
								repChar	= "";
							};
							break;
						default: 
							repChar = "";
							break;
					};
				} else {
					if (kc != "u") {
						repChar = repChar + String.fromCharCode(12353 + ($.inArray(kc, ["a", "i", "u", "e", "o"])*2));
					}
				}

				// Special cases
				// Little wo
				if ((prevChar == "w") && (kc == "o")) {
					repChar = String.fromCharCode(12434);
				}

				if (repChar) { 
					// little ya's - kya, rya etc.
					var aSpecialStartChars = ["k","g","s","z","t","d","n","h","b","p","m","r"];
					if ((prevChar == "y") && ($.inArray(prevPrevChar,aSpecialStartChars) > -1)) {
						aSpecialStartKanaCode = [12365, 12366, 12375, 12376, 12385, 12386, 12395, 12402, 12403, 12404, 12415, 12426];
						repChar = String.fromCharCode(aSpecialStartKanaCode[$.inArray(prevPrevChar, aSpecialStartChars)]);
						switch (kc) {
							case "a":
								repChar = repChar + String.fromCharCode(12419);
								break;
							case "i":
								break;
							case "o":
								repChar = repChar + String.fromCharCode(12423);
								break;
							case "u":
								repChar = repChar + String.fromCharCode(12421);
								break;
							default: 
								repChar = "";
								break;
						};
						prevChar = prevPrevChar;
						prevPrevChar = (caretPos > 2) ? currText.substring(caretPos-3, caretPos - 2).toLowerCase() : ""; // Previous previous character;
						noOfChars2Replace++;
					} else if ((prevChar == "h") && ($.inArray(prevPrevChar, ["s", "c"]) > -1)) {
						if (prevPrevChar == "s") {
							repChar = String.fromCharCode(12375);
						} else {
							repChar = String.fromCharCode(12385);	
						};

						switch (kc) {
							case "a":
								repChar = repChar + String.fromCharCode(12419);
								break;
							case "i":
								break;
							case "o":
								repChar = repChar + String.fromCharCode(12423);
								break;
							case "u":
								repChar = repChar + String.fromCharCode(12421);
								break;
							default: 
								repChar = "";
								break;
						};
						prevChar = prevPrevChar;
						prevPrevChar = (caretPos > 2) ? currText.substring(caretPos-3, caretPos - 2).toLowerCase() : ""; // Previous previous character;
						noOfChars2Replace++;
					} else if ((prevChar == "j")){ //&& ($.inArray(kc, [65, 73, 79, 85]) > -1)) {
						repChar = String.fromCharCode(12376);
						switch (kc) {
							case "a":
								repChar = repChar + String.fromCharCode(12419);
								break;
							case "i":
								noOfChars2Replace--;
								break;
							case "o":
								repChar = repChar + String.fromCharCode(12423);
								break;
							case "u":
								repChar = repChar + String.fromCharCode(12421);
								break;
							default: 
								repChar = "";
								break;
						};
						noOfChars2Replace++;
					};

					// Deal with double consonants (little tsu)
					if ((prevChar) && (prevChar == prevPrevChar)) { 
						noOfChars2Replace++;
						repChar = String.fromCharCode(12387) + repChar;
					};

					// Shift to Katakana if required/enabled
					if ((addCode) && (repChar)) {
						var newRepChar = "";
						for (var i = 0; i < repChar.length; i++){
							newRepChar = newRepChar + String.fromCharCode(repChar.charCodeAt(i)+addCode);
						}
						repChar = newRepChar;
					}
					// Insert text in correct position
					event.currentTarget.value = currText.substring(0, caretPos - noOfChars2Replace) + repChar +currText.substring(caretPos, currText.length); 
					// Move caret to correct position
					caretPos = caretPos - noOfChars2Replace + repChar.length;
					event.currentTarget.setSelectionRange(caretPos, caretPos);
				};
			} else if ((prevChar == "n") && (kc > 31)) {
				//if consonant but previous character was an n	
				event.currentTarget.value = currText.substring(0, caretPos-1) + String.fromCharCode(12435) + currText.substring(caretPos, currText.length);
				event.currentTarget.setSelectionRange(caretPos, caretPos);
			};
		},
		destroy : function() {
			return this.each(function() {
				$(window).unbind('kanaInput');
			});
		}
	};

	$.fn.kanaInput = function(method) {
		//Call chosen method
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method){
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.kanaInput');
		}
	};	
})(jQuery);
