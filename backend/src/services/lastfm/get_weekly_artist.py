import sys
import os
import requests
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from backend.config import Config
from backend.src.services.lastfm.get_album_cover import get_album_cover
from backend.src.database.queries.artist_image_cache import select_url, insert_url
from backend.src.services.spotify.get_artist_image import get_artist_cover

def get_weekly_artist(start_date, end_date):
    config = Config()

    params = {
        'method': 'user.getWeeklyArtistChart',
        'user': config.LASTFM_USER,
        'api_key': config.LASTFM_API_KEY,
        'from': start_date,
        'to': end_date,
        'format': 'json',
        'limit': 50
    }

    url = config.LASTFM_URL

    response = requests.get(url, params)
    dados = response.json()
    artists = dados['weeklyartistchart']['artist']

    dados = []
    for artist in artists:
        artist_name = artist['name']
        artist_cover = select_url(artist_name)
        if not artist_cover:
            artist_cover = get_artist_cover(artist_name)
            insert_url(artist_name, artist_cover)

        artist_info = {
            'artist': artist_name,
            'rank_position': artist['@attr'].get('rank'),
            'playcount': artist['playcount'],
            'artist_cover': artist_cover
        }
        dados.append(artist_info)

    return dados
        