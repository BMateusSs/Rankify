from dotenv import load_dotenv
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import sys
import io
import time
import unicodedata
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(auth_manager=auth_manager, requests_timeout=20)  # Timeout aumentado para 20s

def normalize_str(s):
    return unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('ASCII').lower().strip()

def get_track_cover(nome, artista):
    query = f'track:"{nome}" artist:"{artista}"'
    try:
        resultado = sp.search(q=query, type='track', limit=1)
        if resultado['tracks']['items']:
            track = resultado['tracks']['items'][0]
            images = track['album'].get('images', [])
            if images:
                return images[0]['url']
            else:
                print(f"⚠️ Sem imagem para: {nome} - {artista}")
                return None
        else:
            # Tenta busca menos restrita
            print(f"❌ Não encontrado (exato): {nome} - {artista}. Tentando busca ampla...")
            resultado = sp.search(q=nome, type='track', limit=3)
            for item in resultado['tracks']['items']:
                found_artist = item['artists'][0]['name']
                if normalize_str(found_artist) == normalize_str(artista):
                    images = item['album'].get('images', [])
                    if images:
                        return images[0]['url']
            print(f"❌ Não encontrado nem na busca ampla (ou artista diferente): {nome}")
    except Exception as e:
        print(f"Erro ao buscar capa do Spotify: {e} ({nome} - {artista})")
        return None
    finally:
        time.sleep(0.5)

