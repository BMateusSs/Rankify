import sys
import os
import requests

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from backend.config import Config

def get_register_date():
    config = Config()

    params = {
        'method': 'user.getInfo',
        'user': config.LASTFM_USER,
        'api_key': config.LASTFM_API_KEY,
        'format': 'json'
    }

    url = config.LASTFM_URL

    response = requests.get(url, params)
    user_info = response.json()
    print(user_info)

get_register_date()