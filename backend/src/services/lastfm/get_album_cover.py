import requests
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from backend.config import Config

def get_album_cover(artist, album_name):
    config = Config()

    params = {
        'method': 'album.getInfo',
        'artist': artist,
        'album': album_name,
        'username': config.LASTFM_USER,
        'api_key': config.LASTFM_API_KEY,
        'format': 'json'
    }

    url = config.LASTFM_URL

    response = requests.get(url, params)
    album_infos = response.json()
    covers = album_infos['album']['image']
    corver_album = next((cover['#text'] for cover in covers if cover['size'] == 'extralarge'), None)
    return corver_album

get_album_cover('Beyoncé', 'Renaissance')