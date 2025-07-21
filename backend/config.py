from dotenv import load_dotenv
import os

class Config:
    load_dotenv()

    LASTFM_API_KEY = os.getenv('LASTFM_API_KEY')
    LASTFM_SECRET_KEY = os.getenv('LASTFM_SECRET_KEY')
    LASTFM_USER = os.getenv('LASTFM_USER')
    LASTFM_URL = 'http://ws.audioscrobbler.com/2.0/'
