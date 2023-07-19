from django.shortcuts import render
import requests
import json
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.cache import cache

def index(request):
    """Pokedex index."""
    cache_key = 'pokedex_data'
    cached_data = cache.get(cache_key)

    if cached_data is not None:
    	return render(request, 'pokedex/index.html', cached_data)

    url_pokeapi = ("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0")

    r = requests.get(url_pokeapi).json()

    next_r = r['next']
    pokemons_results = r['results']
    pokemons_urls = [p['url'] for p in pokemons_results]

    pokemons = {}

    session = requests.Session()

    for url in pokemons_urls:
        r = session.get(url).json()
        pokemons[r['name']] = {
            'id': r['id'],
            'height': r['height']/10,
            'weight': int(r['weight'])/10,
            'sprite': r['sprites']['front_default'],
            'types': [t['type']['name'] for t in r['types']]
        }

    context = {
        'pokemons': pokemons,
        'next': next_r
    }

    cache.set(cache_key, context, timeout=3600)

    return render(request, 'pokedex/index.html', context)

def load_pokemons(request):
    url_pokeapi = request.GET.get('url')
    cached_data = cache.get(url_pokeapi)

    if cached_data:
        ajax_data = cached_data
    else:
        r = requests.get(url_pokeapi).json()
        next_r = r['next']
        pokemons_results = r['results']
        pokemons_urls = [p['url'] for p in pokemons_results]

        pokemons = {}

        session = requests.Session()

        for url in pokemons_urls:
        	r = session.get(url).json()
        	pokemons[r['name']] = {
	            'id': r['id'],
	            'height': r['height']/10,
	            'weight': int(r['weight'])/10,
	            'sprite': r['sprites']['front_default'],
	            'types': [t['type']['name'] for t in r['types']]
	        }
	       
        cache.set(url_pokeapi, {
            'html': render_to_string('pokedex/pokemon_template.html', {'pokemons': pokemons}),
            'next': next_r
        }, 60 * 15)
        ajax_data = {
            'html': render_to_string('pokedex/pokemon_template.html', {'pokemons': pokemons}),
            'next': next_r
        }

    return JsonResponse(ajax_data)

def search_pokemon(request):
	search_input = request.GET.get('searchInput')
	url_pokeapi = f"https://pokeapi.co/api/v2/pokemon/{search_input}"

	r = requests.get(url_pokeapi).json()

	pokemon = {}

	pokemon[r['name']] = {
		'id': r['id'],
        'height': r['height']/10,
        'weight': int(r['weight'])/10,
        'sprite': r['sprites']['front_default'],
        'types': [t['type']['name'] for t in r['types']]
	}

	ajax_data = {
		'html': render_to_string('pokedex/pokemon_template.html', {'pokemons': pokemon})
	}

	return JsonResponse(ajax_data)


