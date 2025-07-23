import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.config import Config
from backend.src.database.connection import get_db_connection
from backend.src.database.queries.selections.get_id_by_username import get_user_id

def select_url(artist):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = f'''
        SELECT url
        FROM artist_cover_cache
        WHERE artist_name = %s 
    '''
    cursor.execute(query, (artist,))
    url = cursor.fetchone()
    connection.close()

    return url[0] if url else None

def insert_url(artist, url):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = f'''
            INSERT INTO artist_cover_cache
            (artist_name, url)
            VALUES(%s, %s)
        '''
        cursor.execute(query, (artist, url,))
        connection.commit()
        return True

    except Exception as e:
        print(f"[ERRO] Falha ao inserir URL no cache: {e}")
        return False

    finally:
        if connection:
            connection.close()
