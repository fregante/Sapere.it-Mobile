(function (undefined) {
	var B = {};
	
	B.constants = {};
	
	//indirizzo per prendere la definizione da Sapere.it
	B.constants.URL = "http://query.yahooapis.com/v1/public/yql?q=use%20'http%3A%2F%2Fwww.datatables.org%2Fdata%2Fhtmlstring.xml'%20as%20data.html%3B%20select%20*%20from%20data.html%20where%20url%3D'http%3A%2F%2Fwww.sapere.it%2Fsapere%2Fdizionari%2Fdizionari%2FItaliano%2FX%2FX%2FX.html'%20and%20xpath%3D%22%2F%2Fdiv%5B%40id%3D'main'%5D%2F%2Fdiv%5Bcontains(%40class%2C'p_text')%5D%2F%2Fdiv%7C%2F%2Fdiv%5B%40id%3D'main'%5D%2F%2Fh2%7C%2F%2Fdiv%5B%40id%3D'main'%5D%2F%2Fh1%22&format=json&callback=?";
	
	//cache di $('html')
	B.constants.HTML = $(document.documentElement);
	
	B.input = {};
	
	//cache della parola cercata
	B.input.word = '';
	
	//cache dell'input di ricerca
	B.input.$ = null;
	
	//ascolta gli eventi "focus" e "cerca" del campo di ricerca
	B.input.listen = function () {
		B.input.$ = $('#word-input');
		
		B.input.$.on('focus', function (e) {
			this.form.reset(); 
		});

		$('#ios-search-button-only-form').submit(function (e) {
			e.preventDefault();
			
			B.input.word = B.input.$.val();
			B.definition.fetch();
			
			B.input.$.blur();
			
			return false;
		});
	}
	
	B.definition = {};
	
	//cache del contenitore della definizione
	B.definition.$ = null;
	
	//chiedi parola a sapere.it
	B.definition.fetch = function (word) {
		word = $.trim(word || B.input.word).toLowerCase();
		
		var url = B.constants.URL
			.replace('X', word.substr(0, 1).toUpperCase())
			.replace('X', word.substr(0, 2).toUpperCase())
			.replace('X', word);
		
		B.constants.HTML.addClass('loading');
		$.getJSON(url, B.definition.receive);
	};
	
	//controlla i dati ricevuti da sapere.it
	B.definition.receive = function (data, status) {
		var result, content;
		
		if (status === 'success') {
			content = data.query.results.result;
			if(/pagina non trovata/i.test(content)) {
				content = '<p>La parola non è nel dizionario oppure ha più significati (le parole con più significati non sono compatibili al momento).</p>';
				
			} else {
				//rimuovi paragrafi preesistenti
				content = content.replace(/<p>|<\/p>|·|<br\/>/g,"");
				
				//crea paragrafi per definizioni multiple
				content = content.replace(/<strong>([\d\s¶]+)<\/strong>/g,"</p><p class='definizione'><strong class='numero'>$1</strong>");
				
				//aggiungi fonte e segnalazione problemi
				content += '<footer><p>fonte: sapere.it</p><p><a href="https://github.com/bfred-it/Sapere.it-Mobile/issues/new?title=Problemi%20con%20la%20parola%20'+encodeURIComponent(B.input.word)+'">Segnala problemi con questa parola</a></p></footer>';
			}
		} else {
			content = '<p>Qualcosa non ha funzionato. Controlla che la parola inserita sia corretta e che Internet sia attivo. Se continua a non funzionare probabilmente si è rotta qualcosa.</p>'
		}
				
		result = document.createElement('div');
		result.innerHTML = content;
		
		B.definition.display( $(result) );
	};
	
	//visualizza i dati ricevuti da sapere.it
	B.definition.display = function ($content) {
		if(B.definition.$ === null) {
			B.definition.$ = $('#definition');
		}
		$content.find('h2:first,script,#s24square').remove();
		B.definition.$.html($content);
		B.constants.HTML.removeClass('loading');
	};
	
	
	$(function () {
		B.input.listen();
		
		//imposta titolo corto per icon sull'home screen di iOS
		$('title').text('Dizionario'); 
	});
	
	window.B = B;
})();
