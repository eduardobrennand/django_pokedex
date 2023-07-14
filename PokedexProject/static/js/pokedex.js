function loadMore(url) {
	$('#loading-gif').css("display", "block");
	$('#load-button').css("display", "none");
	setTimeout(function() {
		$.ajax({
			url: '/load_pokemons/',
			type: 'GET',
			data: {
				'url': url
			},
			dataType: 'json',
			success: function(data) {
				var button = `<button class="load-button" id="load-button" type="button" onclick="loadMore('${data.next}')"> Load more </button>`;
				$('#pokedex-table').append(data.html);
				$('#load-button').remove();
				$('#pokedex-main').append(button);
				$('#loading-gif').css("display", "none");
			},
			error: function(xhr, textStatus, error) {
				console.log('XHR -> ' + xhr.statusText);
				console.log('textStatus -> ' + textStatus);
				console.log('error -> ' + error);
			}
		});
	}, 1000);
}
