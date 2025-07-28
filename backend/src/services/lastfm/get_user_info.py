import sys
import os
import requests
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from backend.config import Config

def get_user_info():
    config = Config()

    params = {
        'method': 'user.getInfo',
        'user': config.LASTFM_USER,
        'api_key': config.LASTFM_API_KEY,
        'format': 'json'
    }

    url = config.LASTFM_URL

    response = requests.get(url, params)
    dados = response.json()

    user = dados['user']
    name = user['name']
    playcount = user['playcount']
    image = user['image'][0].get('#text')

    return name, playcount, image

