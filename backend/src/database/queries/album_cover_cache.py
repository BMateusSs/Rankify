import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.config import Config
from backend.src.database.connection import get_db_connection
from backend.src.database.queries.selections.get_id_by_username import get_user_id

def select_url(artist, album, type):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = f'''
        SELECT url
        FROM {type}_cover_cache
        WHERE artist_name = %s 
        AND {type}_name = %s
    '''
    cursor.execute(query, (artist, album,))
    url = cursor.fetchone()
    connection.close()

    return url[0] if url else None

def insert_url(artist, album, url, type):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = f'''
            INSERT INTO {type}_cover_cache
            (artist_name, {type}_name, url)
            VALUES(%s, %s, %s)
        '''
        cursor.execute(query, (artist, album, url))
        connection.commit()
        return True

    except Exception as e:
        print(f"[ERRO] Falha ao inserir URL no cache: {e}")
        return False

    finally:
        if connection:
            connection.close()



