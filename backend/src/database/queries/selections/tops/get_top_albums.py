import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.queries.selections.get_total_weeks import get_total_weeks
from backend.src.database.connection import get_db_connection
from backend.src.utils.get_valid_dates import date_intervals
from backend.src.utils.convert_dates import datetime_to_unixtime
from backend.src.services.lastfm.get_album_cover import get_album_cover
from backend.src.services.lastfm.get_weekly_album import get_weekly_albums

def get_top_albums():
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]

    query = '''
        WITH semana_atual AS (
    SELECT 
        wai.album_name,
        wai.artist_name,
        wai.playcount,
        wai.album_cover,
        ROW_NUMBER() OVER (ORDER BY wai.playcount DESC, wai.album_name) AS rank_position
    FROM weekly_chart_metadata AS wcm
    LEFT JOIN weekly_album_items AS wai 
        ON wcm.id = wai.chart_metadata_id
    WHERE start_date = (
        SELECT MAX(start_date) FROM weekly_chart_metadata
    ) AND wcm.user_id = %s
),

semana_passada AS (
    SELECT
        wai.album_name,
        wai.artist_name,
        ROW_NUMBER() OVER (ORDER BY wai.playcount DESC, wai.album_name) AS previous_rank
    FROM weekly_chart_metadata AS wcm
    LEFT JOIN weekly_album_items AS wai
        ON wcm.id = wai.chart_metadata_id
    WHERE start_date = (
        SELECT MAX(start_date) - INTERVAL 7 DAY FROM weekly_chart_metadata
    )
    AND wcm.user_id = %s
),

semanas_totais AS (
    SELECT
        wai.album_name,
        wai.artist_name,
        COUNT(DISTINCT wcm.start_date) AS total_weeks
    FROM weekly_chart_metadata AS wcm
    LEFT JOIN weekly_album_items AS wai
        ON wcm.id = wai.chart_metadata_id
    WHERE wcm.user_id = %s
    GROUP BY wai.album_name, wai.artist_name
),

ranking_semanal AS (
    SELECT 
        wai.album_name,
        wai.artist_name,
        wcm.start_date,
        ROW_NUMBER() OVER (
            PARTITION BY wcm.start_date 
            ORDER BY wai.playcount DESC, wai.album_name
        ) AS rank_position
    FROM weekly_album_items wai
    JOIN weekly_chart_metadata wcm 
        ON wai.chart_metadata_id = wcm.id
    WHERE wcm.user_id = %s
),

melhor_posicao_album AS (
    SELECT 
        album_name,
        artist_name,
        MIN(rank_position) AS peak_position
    FROM ranking_semanal
    GROUP BY album_name, artist_name
),

semanas_no_peak AS (
    SELECT 
        rs.album_name,
        rs.artist_name,
        COUNT(*) AS weeks_on_peak
    FROM ranking_semanal rs
    JOIN melhor_posicao_album mp
        ON rs.album_name = mp.album_name 
        AND rs.artist_name = mp.artist_name
        AND rs.rank_position = mp.peak_position
    GROUP BY rs.album_name, rs.artist_name
)

    SELECT 
        sa.album_name,
        sa.artist_name,
        sa.rank_position,
        sa.playcount,
        sa.album_cover,
        sp.previous_rank,
        st.total_weeks,
        mp.peak_position,
        snp.weeks_on_peak
    FROM semana_atual sa
    LEFT JOIN semana_passada sp 
        ON sa.album_name = sp.album_name AND sa.artist_name = sp.artist_name
    LEFT JOIN semanas_totais st 
        ON sa.album_name = st.album_name AND sa.artist_name = st.artist_name
    LEFT JOIN melhor_posicao_album mp 
        ON sa.album_name = mp.album_name AND sa.artist_name = mp.artist_name
    LEFT JOIN semanas_no_peak snp 
        ON sa.album_name = snp.album_name AND sa.artist_name = snp.artist_name
    ORDER BY sa.rank_position;
    '''
    cursor.execute(query, (user_id, user_id, user_id, user_id,))
    albums = cursor.fetchall()

    return albums

get_top_albums()