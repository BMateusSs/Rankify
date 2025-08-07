import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection

def get_artist_albums_chart_data(artist_name):
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]

    query = '''
    WITH album_ranks AS (
        SELECT 
            wai.album_name,
            wai.album_cover,
            wai.artist_name,
            wcm.start_date,
            ROW_NUMBER() OVER (
                PARTITION BY wai.album_name, wcm.start_date
                ORDER BY wai.playcount DESC, wai.album_name
            ) as rank_position
        FROM weekly_album_items wai
        JOIN weekly_chart_metadata wcm ON wai.chart_metadata_id = wcm.id
        WHERE wcm.user_id = %s
          AND wai.artist_name = %s
    )
    
    SELECT
        ar.album_name,
        MIN(ar.rank_position) AS peak_position,
        COUNT(DISTINCT ar.start_date) AS total_weeks,
        ar.album_cover,
        MIN(ar.start_date) AS debut_week
    FROM album_ranks ar
    GROUP BY
        ar.album_name,
        ar.album_cover
    ORDER BY 
        debut_week DESC;
    '''

    cursor.execute(query, (user_id, artist_name))
    albums_data = cursor.fetchall()
    
    return albums_data

def get_artist_tracks_chart_data(artist_name):
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]

    query = '''
    WITH track_ranks AS (
    SELECT 
        wai.track_name,
        wai.track_cover,
        wai.artist_name,
        wcm.start_date,
        ROW_NUMBER() OVER (
            PARTITION BY wai.chart_metadata_id
            ORDER BY wai.playcount DESC, wai.track_name
        ) as rank_position
    FROM weekly_track_items wai
    JOIN weekly_chart_metadata wcm ON wai.chart_metadata_id = wcm.id
    WHERE wcm.user_id = %s
      AND wai.artist_name = %s
)

SELECT
    tr.track_name,
    MIN(tr.rank_position) AS peak_position,
    COUNT(DISTINCT tr.start_date) AS total_weeks,
    tr.track_cover,
    MIN(tr.start_date) AS debut_week
FROM track_ranks tr
GROUP BY
    tr.track_name,
    tr.track_cover,
    tr.artist_name  -- Adicionado artist_name para garantir o agrupamento correto
ORDER BY 
    peak_position ASC, total_weeks DESC;
    '''

    cursor.execute(query, (user_id, artist_name))
    albums_data = cursor.fetchall()
    
    return albums_data
