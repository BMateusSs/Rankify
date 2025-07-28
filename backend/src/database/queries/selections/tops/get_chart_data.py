import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.queries.selections.get_total_weeks import get_total_weeks
from backend.src.database.connection import get_db_connection

def get_chart_data(artist, album):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
        WITH weekly_rankings AS (
        SELECT
            wcm.id AS chart_id,
            wcm.start_date,
            wcm.end_date,
            wai.album_name,
            wai.artist_name,
            wai.album_cover,
            wai.playcount,
            ROW_NUMBER() OVER (
                PARTITION BY wcm.id
                ORDER BY wai.playcount DESC, wai.album_name ASC
            ) AS weekly_rank
        FROM weekly_chart_metadata wcm
        JOIN weekly_album_items wai ON wcm.id = wai.chart_metadata_id
        WHERE wcm.user_id = 2  -- Filtro adicionado aqui
    ),
    filtered_album AS (
        SELECT
            chart_id,
            album_name,
            artist_name,
            album_cover,
            start_date,
            end_date,
            playcount,
            weekly_rank
        FROM weekly_rankings
        WHERE album_name = %s AND artist_name = %s
    ),
    album_stats AS (
        SELECT
            album_name,
            artist_name,
            album_cover,
            MIN(start_date) AS debut_date,
            MIN(weekly_rank) AS peak_position,
            SUM(CASE WHEN weekly_rank = 1 THEN 1 ELSE 0 END) AS weeks_at_1,
            SUM(CASE WHEN weekly_rank <= 3 THEN 1 ELSE 0 END) AS weeks_in_top3,
            SUM(CASE WHEN weekly_rank <= 5 THEN 1 ELSE 0 END) AS weeks_in_top5,
            SUM(CASE WHEN weekly_rank <= 10 THEN 1 ELSE 0 END) AS weeks_in_top10,
            COUNT(*) AS total_weeks_charted
        FROM filtered_album
        GROUP BY album_name, artist_name, album_cover
    ),
    position_history AS (
        SELECT
            album_name,
            artist_name,
            start_date,
            end_date,
            weekly_rank AS rank_position,
            playcount
        FROM filtered_album
        ORDER BY start_date
    )

    SELECT
        a.album_name,
        a.artist_name,
        a.album_cover,
        a.weeks_at_1,
        a.weeks_in_top3,
        a.weeks_in_top5,
        a.weeks_in_top10,
        a.peak_position,
        a.debut_date,
        a.total_weeks_charted,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'start_date', ph.start_date,
                'end_date', ph.end_date,
                'rank_position', ph.rank_position,
                'play_count', ph.playcount
            )
        ) AS position_history
    FROM album_stats a
    JOIN position_history ph ON 
        ph.album_name = a.album_name AND 
        ph.artist_name = a.artist_name
    GROUP BY
        a.album_name, a.artist_name, a.album_cover,
        a.weeks_at_1, a.weeks_in_top3, a.weeks_in_top5,
        a.weeks_in_top10, a.peak_position, a.debut_date, a.total_weeks_charted;
    '''

    cursor.execute(query, (album, artist,))
    data = cursor.fetchone()
    return data

a = get_chart_data('Beyoncé', 'Lemonade')