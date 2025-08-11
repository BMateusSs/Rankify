import requests
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from backend.config import Config
from backend.src.database.queries.selections.tops.get_chart_data import get_chart_data
from backend.src.database.queries.selections.tops.get_track_chart_data import get_track_chart_data
from backend.src.database.queries.selections.tops.get_artist_chart_data import get_artist_chart_data
from backend.src.database.queries.selections.get_overall_items_infos import get_overal_albums_infos

def get_overall_albums():
    config = Config()

    params = {
        'method': 'user.getTopAlbums',
        'user': config.LASTFM_USER,
        'api_key': config.LASTFM_API_KEY,
        'format': 'json'
    }

    url = config.LASTFM_URL

    response = requests.get(url, params)
    data = response.json()

    albums = data['topalbums']['album']
    dados = []
    albums_infos = get_overal_albums_infos()
    for album in albums:
        artist = album['artist']['name']
        album_name = album['name']
        infos = albums_infos[(artist, album_name)]

        dados.append({
            'artist': artist,
            'name': album_name,
            'playcount': album['playcount'],
            'cover': infos['cover'],
            'peak_position': infos['peak_position'],
            'total_weeks': infos['total_weeks']
        })

    return dados

def get_overall_tracks():
    config = Config()

    params = {
        'method': 'user.getTopTracks',
        'user': config.LASTFM_USER,
        'api_key': config.LASTFM_API_KEY,
        'format': 'json'
    }

    url = config.LASTFM_URL

    response = requests.get(url, params)
    data = response.json()

    albums = data['toptracks']['track']
    dados = []
    for album in albums:
        artist = album['artist']['name']
        album_name = album['name']
        infos = get_track_chart_data(artist, album_name)

        dados.append({
            'artist': artist,
            'name': album_name,
            'playcount': album['playcount'],
            'cover': infos[2],
            'peak_position': infos[7],
            'total_weeks': infos[9]
        })

    return dados

def get_overall_artists():
    config = Config()

    params = {
        'method': 'user.getTopArtists',
        'user': config.LASTFM_USER,
        'api_key': config.LASTFM_API_KEY,
        'format': 'json'
    }

    url = config.LASTFM_URL

    response = requests.get(url, params)
    data = response.json()

    artists = data['topartists']['artist']
    dados = []
    for artist in artists:
        artist_name = artist['name']
        infos = get_artist_chart_data(artist_name)

        dados.append({
            'artist': '',
            'name': artist_name,
            'playcount': artist['playcount'],
            'cover': infos[1],
            'peak_position': infos[6],
            'total_weeks': infos[8]
        })

    return dados