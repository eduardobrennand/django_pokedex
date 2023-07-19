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
				var button = `<button class="load button" id="load-button" type="button" onclick="loadMore('${data.next}')"> Load more </button>`;
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

function searchPokemon() {
	let searchInput = document.querySelector(".search-input").value.toLowerCase().replace(" ", "-");
	$('#loading-gif').css("display", "block");
	$('#load-button').css("display", "none");
	$('#pokedex-table').css("display", "none");
	$('#return-button').css("display", "none");
	$('#not-found').css("display", "none");
		setTimeout(function() {
			$.ajax({
				url: '/search_pokemon/',
				type: 'GET',
				data: {
					'searchInput': searchInput
				},
				dataType: 'json',
				success: function(data) {
					$('#pokedex-table').css("display", "block");
					$('.loaded-row').remove()
					$('#pokedex-rows').html(data.html);
					$('#loading-gif').css("display", "none");
					$('#return-button').css("display", "block");
				},
				error: function() {
					$('#not-found').css("display", "block");
					$('#loading-gif').css("display", "none");
					$('#return-button').css("display", "block");
				}
			});
		}, 1000);
}
