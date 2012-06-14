(function (undefined) {
!function(
  a, // trimming object that defined String.prototype extensions and their related Regular Expressions
  b // placeholder variable for iterating over 'a'
){
  for(b in a) // iterate over each of the trimming items in 'a'
    String.prototype[b]=b[b] || // use the native string trim/trimLeft/trimRight method if available, if not:
    Function('return this.replace('+a[b]+',"")') // generate a function that will return a new string that replaces the relevant whitespace
  }({
  trimLeft: /^\s+/, // regex to trim the left side of a string (along with prototype name)
  trimRight: /\s+$/ // regex to trim the right side of a string (along with prototype name)
})

	var B = {};
	
	B.constants = {};
	
	B.constants.URL = "http://query.yahooapis.com/v1/public/yql?q=use%20'http%3A%2F%2Fwww.datatables.org%2Fdata%2Fhtmlstring.xml'%20as%20data.html%3B%20select%20*%20from%20data.html%20where%20url%3D'http%3A%2F%2Fwww.sapere.it%2Fsapere%2Fdizionari%2Fdizionari%2FItaliano%2FX%2FX%2FX.html'%20and%20xpath%3D%22%2F%2Fdiv%5B%40id%3D'main'%5D%2F%2Fdiv%5Bcontains(%40class%2C'p_text')%5D%2F%2Fdiv%7C%2F%2Fdiv%5B%40id%3D'main'%5D%2F%2Fh2%7C%2F%2Fdiv%5B%40id%3D'main'%5D%2F%2Fh1%22&format=json&callback=?";
	
	B.constants.HTML = $$(document.documentElement);
	
	//B.constants.URL = "http://query.yahooapis.com/v1/public/yql?q=use%20'http%3A%2F%2Fwww.datatables.org%2Fdata%2Fhtmlstring.xml'%20as%20data.html%3B%20select%20*%20from%20data.html%20where%20url%3D%22http%3A%2F%2Fwww.sapere.it%2Fsapere%2Fdizionari%2Fdizionari%2FItaliano%2F#1%2F#2%2F#3.html%22%20and%20xpath%3D%22%2F%2Fdiv%5Bcontains(%40class%2C'alpha')%5D%2F%2Fdiv%5Bcontains(%40class%2C'p_text')%5D%22&format=json&callback=?";
	
	B.input = {};
	
	B.input.word = '';
	
	B.input.$ = null;
	
	B.input.get = function () {
		if(B.input.$ === null) {
			B.input.$ = $$('#word-input');
		}
		return B.input.$;
	}
	
	B.input.listen = function () {
//		B.input.get().on('input', function (e) {
//			B.input.word = B.input.$.val();
//		});

		$$('#ios-search-button-only-form').on('submit', function (e) {
			e.preventDefault();
			
			B.input.word = B.input.get().val();
			B.definition.fetch();
			
			B.input.get().trigger('blur');
			
			return false;
		});
	}
	
	B.definition = {};
	
	B.definition.$ = null;
	
	B.definition.url = '';
	
	B.definition.fetch = function (word) {
		word = (word || B.input.word).trim().toLowerCase();
		
		B.definition.url = B.constants.URL
			.replace('X', word.substr(0, 1).toUpperCase())
			.replace('X', word.substr(0, 2).toUpperCase())
			.replace('X', word);
		
		B.constants.HTML.addClass('loading');
		$$.ajax({
			url: B.definition.url,
			success: B.definition.receive
		});
	};
	
	B.definition.receive = function (data) {
		var result, content;
		
		//if (status === 'success') {
			content = data.query.results.result;
			if(/pagina non trovata/i.test(content)) {
				content = '<p>La parola non è nel dizionario oppure ha più significati (le parole con più significati non sono compatibili al momento).</p>';
			} else {
				
				console.log(content)
				//remove existing paragraphs
				content = content.replace(/<p>|<\/p>|·/g,"");
				
				//make paragraphs for multiple definitions
				content = content.replace(/<strong>[\d\s¶<br\/>]+<\/strong>/g,"</p><p>$&");
			}
//		} else {
//			content = '<p>Qualcosa non ha funzionato. Controlla che la parola inserita sia corretta e che Internet sia attivo. Se continua a non funzionare probabilmente si è rotta qualcosa.</p>'
//		}
		result = document.createElement('div');
		result.innerHTML = content;
		
		B.definition.display( result );
	};
	
	B.definition.display = function ($content) {
		if(B.definition.$ === null) {
			B.definition.$ = $$('#definition');
		}
		//console.log($content)
		B.definition.$.empty().append($content);
		$$('h2,script,#s24square',B.definition.$).remove();
		B.constants.HTML.removeClass('loading');
	};
	
	
	$$(document).ready(function () {
		B.input.listen();
		$$('title').text('Dizionario');
	});
	
	window.B = B;
})();