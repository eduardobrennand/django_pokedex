function loadMore(url) {
	$.ajax({
		url: '/load_pokemons/',
		type: 'GET',
		data: {
            'url': url
        },
		dataType: 'json',
		success: function(data) {
			console.log(data.next)
			button = `<button class="load-button" id="load-button" type="button" onclick="loadMore(url='${data.next}')"> Load more </button>`
			console.log(button)
			$('#pokedex-table').append(data.html);
			$('#load-button').remove()
			$('#pokedex-main').append(button)
		},
		error: function(xhr, textStatus, error) {
		 	console.log('XHR -> ' + xhr.statusText);
		    console.log('textStatus -> ' + textStatus);
		    console.log('error -> ' + error);
		}
	})
}