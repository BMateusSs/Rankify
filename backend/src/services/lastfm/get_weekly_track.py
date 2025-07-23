import sys
import os
import requests
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from backend.config import Config
from backend.src.services.lastfm.get_album_cover import get_album_cover
from backend.src.database.queries.cache.album_cover_cache import select_url, insert_url
from backend.src.services.spotify.get_track_cover import get_track_cover

def get_weekly_track(start_date, end_date):
    config = Config()

    params = {
        'method': 'user.getWeeklyTrackChart',
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
    tracks = dados['weeklytrackchart']['track']

    type = 'track'

    dados = []
    for track in tracks:
        artist = track['artist'].get('#text')
        track_name = track['name']
        
        track_cover = select_url(artist, track_name, type)
        if not track_cover:
            track_cover = get_track_cover(artist, track_name)
            if not track_cover:
                track_cover = config.DEFAULT_ALBUM_COVER
            insert_url(artist, track_name, track_cover, type)

        track_info = {
            'artist': artist,
            'track_name': track_name,
            'rank_position': track['@attr'].get('rank'),
            'playcount': track['playcount'],
            'track_cover': track_cover
        }
        dados.append(track_info)
        
    return dados