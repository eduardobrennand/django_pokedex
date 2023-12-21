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

function openFilter() {
	let modal = document.getElementById("filter-modal");
	let span = document.getElementsByClassName("filter-close")[0];
	let filter = document.getElementById("filter-button")

	modal.style.display = "block";


	span.onclick = function() {
		modal.style.display = "none";
	}

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
}

function applyFilter() {
	let modal = document.getElementById("filter-modal");

	modal.style.display = "none";

	let checkedBoxes = document.querySelectorAll('input[name=type-checkbox]:checked');
	let i = 0;
	let selectedTypes = []

	while (i < checkedBoxes.length) {
		selectedTypes.push(checkedBoxes[i].value)
		i++
	}
	selectedTypes = JSON.stringify(selectedTypes)
	console.log(selectedTypes)
	$('#loading-gif').css("display", "block");
	$('#load-button').css("display", "none");
	$('#pokedex-table').css("display", "none");
	$('#return-button').css("display", "none");
	$('#not-found').css("display", "none");
	
	setTimeout(function() {
		$.ajax({
			url: '/filter_pokemon/',
			type: 'GET',
			data: {
				'selectedTypes': selectedTypes
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
				console.log('error')
			}
		});
	}, 1000);
}	
