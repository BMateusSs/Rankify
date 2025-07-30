import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.queries.selections.get_total_weeks import get_total_weeks
from backend.src.database.connection import get_db_connection

def get_track_chart_data(artist, album):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
        WITH weekly_rankings AS (
        SELECT
            wcm.id AS chart_id,
            wcm.start_date,
            wcm.end_date,
            wti.track_name, -- Alterado de album_name para track_name
            wti.artist_name,
            wti.track_cover, -- Alterado de album_cover para track_cover
            wti.playcount,
            ROW_NUMBER() OVER (
                PARTITION BY wcm.id
                ORDER BY wti.playcount DESC, wti.track_name ASC -- Alterado para track_name
            ) AS weekly_rank
        FROM weekly_chart_metadata wcm
        JOIN weekly_track_items wti ON wcm.id = wti.chart_metadata_id -- Alterado para weekly_track_items
        WHERE wcm.user_id = 2
    ),
    filtered_track AS ( -- Renomeado para filtered_track
        SELECT
            chart_id,
            track_name, -- Alterado para track_name
            artist_name,
            track_cover, -- Alterado para track_cover
            start_date,
            end_date,
            playcount,
            weekly_rank
        FROM weekly_rankings
        WHERE track_name = %s AND artist_name = %s -- Alterado para track_name
    ),
    track_stats AS ( -- Renomeado para track_stats
        SELECT
            track_name, -- Alterado para track_name
            artist_name,
            track_cover, -- Alterado para track_cover
            MIN(start_date) AS debut_date,
            MIN(weekly_rank) AS peak_position,
            SUM(CASE WHEN weekly_rank = 1 THEN 1 ELSE 0 END) AS weeks_at_1,
            SUM(CASE WHEN weekly_rank <= 3 THEN 1 ELSE 0 END) AS weeks_in_top3,
            SUM(CASE WHEN weekly_rank <= 5 THEN 1 ELSE 0 END) AS weeks_in_top5,
            SUM(CASE WHEN weekly_rank <= 10 THEN 1 ELSE 0 END) AS weeks_in_top10,
            COUNT(*) AS total_weeks_charted
        FROM filtered_track -- Alterado para filtered_track
        GROUP BY track_name, artist_name, track_cover -- Alterado para track_name e track_cover
    ),
    position_history AS (
        SELECT
            track_name, -- Alterado para track_name
            artist_name,
            start_date,
            end_date,
            weekly_rank AS rank_position,
            playcount
        FROM filtered_track -- Alterado para filtered_track
        ORDER BY start_date
    )

    SELECT
        ts.track_name, -- Alterado para ts.track_name
        ts.artist_name,
        ts.track_cover, -- Alterado para ts.track_cover
        ts.weeks_at_1,
        ts.weeks_in_top3,
        ts.weeks_in_top5,
        ts.weeks_in_top10,
        ts.peak_position,
        ts.debut_date,
        ts.total_weeks_charted,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'start_date', ph.start_date,
                'end_date', ph.end_date,
                'rank_position', ph.rank_position,
                'play_count', ph.playcount
            )
        ) AS position_history
    FROM track_stats ts -- Renomeado para ts
    JOIN position_history ph ON
        ph.track_name = ts.track_name AND -- Alterado para track_name
        ph.artist_name = ts.artist_name
    GROUP BY
        ts.track_name, ts.artist_name, ts.track_cover, -- Alterado para track_name e track_cover
        ts.weeks_at_1, ts.weeks_in_top3, ts.weeks_in_top5,
        ts.weeks_in_top10, ts.peak_position, ts.debut_date, ts.total_weeks_charted;
    '''

    cursor.execute(query, (album, artist,))
    data = cursor.fetchone()
    
    return data
