import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.config import Config
from backend.src.database.connection import get_db_connection

def get_user_id():
    user_config  = Config()
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
        SELECT id 
        FROM users
        WHERE lastfm_username = %s;
    '''
    cursor.execute(query, (user_config.LASTFM_USER,))
    user_id = cursor.fetchone()
    cursor.close()

    return user_id
