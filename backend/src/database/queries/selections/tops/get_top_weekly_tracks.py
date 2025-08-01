import sys
import os
from datetime import datetime, date, timedelta # Importe timedelta

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from datetime import datetime, timedelta
from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection


def get_top_weekly_tracks(selected_date_str):
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]
    selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date()
    previous_week_date = selected_date - timedelta(days=7)

    query = '''
    WITH semana_atual AS (
        SELECT 
            wti.track_name,
            wti.artist_name,
            wti.playcount,
            wti.track_cover,
            ROW_NUMBER() OVER (ORDER BY wti.playcount DESC, wti.track_name) AS rank_position
        FROM weekly_chart_metadata AS wcm
        LEFT JOIN weekly_track_items AS wti 
            ON wcm.id = wti.chart_metadata_id
        WHERE wcm.start_date = %s
        AND wcm.user_id = %s
    ),

    semana_passada AS (
        SELECT
            wti.track_name,
            wti.artist_name,
            ROW_NUMBER() OVER (ORDER BY wti.playcount DESC, wti.track_name) AS previous_rank
        FROM weekly_chart_metadata AS wcm
        LEFT JOIN weekly_track_items AS wti
            ON wcm.id = wti.chart_metadata_id
        WHERE wcm.start_date = %s
        AND wcm.user_id = %s
    ),

    semanas_totais AS (
        SELECT
            wti.track_name,
            wti.artist_name,
            COUNT(DISTINCT wcm.start_date) AS total_weeks
        FROM weekly_chart_metadata AS wcm
        LEFT JOIN weekly_track_items AS wti
            ON wcm.id = wti.chart_metadata_id
        WHERE wcm.user_id = %s
        AND wcm.start_date <= %s
        GROUP BY wti.track_name, wti.artist_name
    ),

    ranking_semanal AS (
        SELECT 
            wti.track_name,
            wti.artist_name,
            wcm.start_date,
            ROW_NUMBER() OVER (
                PARTITION BY wcm.start_date 
                ORDER BY wti.playcount DESC, wti.track_name
            ) AS rank_position
        FROM weekly_track_items wti
        JOIN weekly_chart_metadata wcm 
            ON wti.chart_metadata_id = wcm.id
        WHERE wcm.user_id = %s
        AND wcm.start_date <= %s
    ),

    melhor_posicao_track AS (
        SELECT 
            track_name,
            artist_name,
            MIN(rank_position) AS peak_position
        FROM ranking_semanal
        GROUP BY track_name, artist_name
    ),

    semanas_no_peak AS (
        SELECT 
            rs.track_name,
            rs.artist_name,
            COUNT(*) AS weeks_on_peak
        FROM ranking_semanal rs
        JOIN melhor_posicao_track mp
            ON rs.track_name = mp.track_name 
            AND rs.artist_name = mp.artist_name
            AND rs.rank_position = mp.peak_position
        GROUP BY rs.track_name, rs.artist_name
    )

    SELECT 
        sa.track_name,
        sa.artist_name,
        sa.rank_position,
        sa.playcount,
        sa.track_cover,
        sp.previous_rank,
        st.total_weeks,
        mp.peak_position,
        snp.weeks_on_peak
    FROM semana_atual sa
    LEFT JOIN semana_passada sp 
        ON sa.track_name = sp.track_name AND sa.artist_name = sp.artist_name
    LEFT JOIN semanas_totais st 
        ON sa.track_name = st.track_name AND sa.artist_name = st.artist_name
    LEFT JOIN melhor_posicao_track mp 
        ON sa.track_name = mp.track_name AND sa.artist_name = mp.artist_name
    LEFT JOIN semanas_no_peak snp 
        ON sa.track_name = snp.track_name AND sa.artist_name = snp.artist_name
    ORDER BY sa.rank_position;
'''

    cursor.execute(query, (
        selected_date,       
        user_id,
        previous_week_date, 
        user_id,
        user_id,          
        selected_date,
        user_id,           
        selected_date
    ))

    tracks = cursor.fetchall()
    return tracks
