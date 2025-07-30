import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.queries.selections.get_total_weeks import get_total_weeks
from backend.src.database.connection import get_db_connection

def get_artist_chart_data(artist):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
        WITH weekly_rankings AS (
    SELECT
        wcm.id AS chart_id,
        wcm.start_date,
        wcm.end_date,
        wai.artist_name,
        wai.artist_cover,
        wai.playcount,
        ROW_NUMBER() OVER (
            PARTITION BY wcm.id
            ORDER BY wai.playcount DESC, wai.artist_name ASC
        ) AS weekly_rank
    FROM weekly_chart_metadata wcm
    JOIN weekly_artist_items wai ON wcm.id = wai.chart_metadata_id
    WHERE wcm.user_id = 2
),
filtered_artist AS (
    SELECT
        chart_id,
        artist_name,
        artist_cover,
        start_date,
        end_date,
        playcount,
        weekly_rank
    FROM weekly_rankings
    WHERE artist_name = %s
),
artist_stats AS (
    SELECT
        artist_name,
        artist_cover,
        MIN(start_date) AS debut_date,
        MIN(weekly_rank) AS peak_position,
        SUM(CASE WHEN weekly_rank = 1 THEN 1 ELSE 0 END) AS weeks_at_1,
        SUM(CASE WHEN weekly_rank <= 3 THEN 1 ELSE 0 END) AS weeks_in_top3,
        SUM(CASE WHEN weekly_rank <= 5 THEN 1 ELSE 0 END) AS weeks_in_top5,
        SUM(CASE WHEN weekly_rank <= 10 THEN 1 ELSE 0 END) AS weeks_in_top10,
        COUNT(*) AS total_weeks_charted
    FROM filtered_artist
    GROUP BY artist_name, artist_cover
),
position_history AS (
    SELECT
        artist_name,
        start_date,
        end_date,
        weekly_rank AS rank_position,
        playcount
    FROM filtered_artist
    ORDER BY start_date
)

SELECT
    as_.artist_name,
    as_.artist_cover,
    as_.weeks_at_1,
    as_.weeks_in_top3,
    as_.weeks_in_top5,
    as_.weeks_in_top10,
    as_.peak_position,
    as_.debut_date,
    as_.total_weeks_charted,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'start_date', ph.start_date,
            'end_date', ph.end_date,
            'rank_position', ph.rank_position,
            'play_count', ph.playcount
        )
    ) AS position_history
FROM artist_stats as_
JOIN position_history ph ON ph.artist_name = as_.artist_name
GROUP BY
    as_.artist_name, as_.artist_cover,
    as_.weeks_at_1, as_.weeks_in_top3, as_.weeks_in_top5,
    as_.weeks_in_top10, as_.peak_position, as_.debut_date, as_.total_weeks_charted;

    '''

    cursor.execute(query, (artist,))
    data = cursor.fetchone()
    
    return data
