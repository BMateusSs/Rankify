import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.config import Config
from backend.src.database.connection import get_db_connection

def get_user_charts_info():
    user_config  = Config()
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
        SELECT 
        (SELECT COUNT(DISTINCT album_name) 
        FROM weekly_album_items 
        WHERE chart_metadata_id IN (SELECT id FROM weekly_chart_metadata WHERE user_id = %s)) AS total_distinct_albums,
        
        (SELECT COUNT(DISTINCT track_name) 
        FROM weekly_track_items 
        WHERE chart_metadata_id IN (SELECT id FROM weekly_chart_metadata WHERE user_id = %s)) AS total_tracks,
        
        (SELECT COUNT(DISTINCT artist_name) 
        FROM weekly_artist_items 
        WHERE chart_metadata_id IN (SELECT id FROM weekly_chart_metadata WHERE user_id = %s)) AS total_artists;
    '''
    cursor.execute(query, (2, 2, 2,))
    user_infos = cursor.fetchone()
    cursor.close()

    return user_infos

um, dois, tres = get_user_charts_info()
