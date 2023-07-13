from django.shortcuts import render
import requests
import json
from django.http import JsonResponse
from django.template.loader import render_to_string


def index(request):
    """Pokedex index."""
    url_pokeapi = ("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0")

    r = requests.get(url_pokeapi).json()

    next_r = r['next']

    pokemons = r['results']

    pokemons_urls = []

    for p in pokemons:
        pokemons_urls.append(p['url'])

    poke = {}

    for url in pokemons_urls:
        url_pokemon = url
        r = requests.get(url_pokemon).json()
        poke[r['name']] = {
            'id': r['id'],
            'height': r['height'],
            'weight': int(r['weight'])/10,
            'sprite': r['sprites']['front_default'],
            'types': [t['type']['name'] for t in r['types']]
        }

    context = {
        'pokemons': poke,
        'next': next_r
    }

    return render(request, 'pokedex/index.html', context)


def load_pokemons(request):
    """Ajax requisition to load 20 more pokemons."""
    url_pokeapi = request.GET.get('url')

    r = requests.get(url_pokeapi).json()

    next_r = r['next']

    pokemons = r['results']

    pokemons_urls = []

    for p in pokemons:
        pokemons_urls.append(p['url'])

    poke = {}

    for url in pokemons_urls:
        url_pokemon = url
        r = requests.get(url_pokemon).json()
        poke[r['name']] = {
            'id': r['id'],
            'height': r['height'],
            'weight': int(r['weight'])/10,
            'sprite': r['sprites']['front_default'],
            'types': [t['type']['name'] for t in r['types']]
        }

    template_context = {
        'pokemons': poke
    }

    html = render_to_string('pokedex/pokemon_template.html', template_context)

    ajax_data = {
        'html': html,
        'next': next_r
    }
    return JsonResponse(ajax_data)
