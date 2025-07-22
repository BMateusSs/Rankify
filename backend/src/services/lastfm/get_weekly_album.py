import sys
import os
import requests
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from backend.config import Config
from backend.src.services.lastfm.get_album_cover import get_album_cover
from backend.src.database.queries.album_cover_cache import select_url, insert_url

def get_weekly_albums(start_date, end_date):
    config = Config()

    params = {
        'method': 'user.getWeeklyAlbumChart',
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
    albums = dados['weeklyalbumchart']['album']
    dados = []
    cover_cache = {}

    for album in albums:
        artist = album['artist'].get('#text')
        album_name = album['name']

        album_cover = select_url(artist, album_name)
        if not album_cover:
            album_cover = get_album_cover(artist, album_name)
            insert_url(artist, album_name, album_cover)

        album_info = {
            'artist': artist,
            'album_name': album_name,
            'rank_position': album['@attr'].get('rank'),
            'playcount': album['playcount'],
            'album_cover': album_cover
        }
        dados.append(album_info)

    return dados
        
