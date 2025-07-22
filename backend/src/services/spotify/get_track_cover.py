import requests
import os
import sys
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))
from backend.config import Config

_cached_token = None
_token_expiry = 0

def get_track_cover(track, artist):
    config = Config()
    client_id = config.SPOTIFY_CLIENT_ID
    client_secret = config.SPOTIFY_CLIENT_SECRET

    access_token = get_access_token(client_id, client_secret)

    search_url = "https://api.spotify.com/v1/search"
    params = {
        "q": f"track:{track} artist:{artist}",
        "type": "track",
        "limit": 1
    }
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(search_url, params=params, headers=headers)
    if response.status_code != 200:
        print("Erro ao buscar faixa:", response.text)
        return None

    track_data = response.json()
    items = track_data.get("tracks", {}).get("items", [])
    if items:
        album_images = items[0].get("album", {}).get("images", [])
        if album_images:
            return album_images[0]["url"]
    return None

def get_access_token(client_id, client_secret):
    global _cached_token, _token_expiry
    if _cached_token and time.time() < _token_expiry:
        return _cached_token

    auth_url = "https://accounts.spotify.com/api/token"
    auth_data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }
    response = requests.post(auth_url, data=auth_data)
    if response.status_code != 200:
        raise Exception(f"Erro ao obter token: {response.text}")

    data = response.json()
    access_token = data.get("access_token")
    expires_in = data.get("expires_in", 3600)

    _cached_token = access_token
    _token_expiry = time.time() + expires_in - 60
    return access_token

