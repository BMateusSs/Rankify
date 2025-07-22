from dotenv import load_dotenv
import os

class Config:
    load_dotenv()

    LASTFM_API_KEY = os.getenv('LASTFM_API_KEY')
    LASTFM_SECRET_KEY = os.getenv('LASTFM_SECRET_KEY')
    LASTFM_USER = os.getenv('LASTFM_USER')
    LASTFM_URL = 'http://ws.audioscrobbler.com/2.0/'
    DEFAULT_ALBUM_COVER = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'


    DB_HOST = os.getenv('DB_HOST')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_NAME = os.getenv('DB_NAME')
