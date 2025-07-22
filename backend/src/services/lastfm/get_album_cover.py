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

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        album_infos = response.json()

        if 'album' not in album_infos or 'image' not in album_infos['album']:
            raise ValueError("Informações do álbum ausentes na resposta da API.")

        covers = album_infos['album']['image']
        corver_album = next((cover['#text'] for cover in covers if cover['size'] == 'extralarge'), None)

        return corver_album if corver_album else config.DEFAULT_ALBUM_COVER

    except Exception as e:
        print(f"[ERRO] Falha ao obter capa do álbum '{album_name}' de '{artist}': {e}")
        return config.DEFAULT_ALBUM_COVER
