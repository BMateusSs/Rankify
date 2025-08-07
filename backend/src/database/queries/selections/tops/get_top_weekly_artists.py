import sys
import os
from datetime import datetime, date, timedelta # Importe timedelta

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from datetime import datetime, timedelta
from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection

def get_top_weekly_artists(selected_date_str):
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]
    selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date()
    previous_week_date = selected_date - timedelta(days=7)

    query = '''
    WITH semana_atual AS (
        SELECT 
            wai.artist_name,
            wai.playcount,
            wai.artist_cover,
            ROW_NUMBER() OVER (ORDER BY wai.playcount DESC, wai.artist_name) AS rank_position
        FROM weekly_chart_metadata AS wcm
        LEFT JOIN weekly_artist_items AS wai 
            ON wcm.id = wai.chart_metadata_id
        WHERE wcm.start_date = %s
        AND wcm.user_id = %s
    ),

    semana_passada AS (
        SELECT
            wai.artist_name,
            ROW_NUMBER() OVER (ORDER BY wai.playcount DESC, wai.artist_name) AS previous_rank
        FROM weekly_chart_metadata AS wcm
        LEFT JOIN weekly_artist_items AS wai
            ON wcm.id = wai.chart_metadata_id
        WHERE wcm.start_date = %s
        AND wcm.user_id = %s
    ),

    semanas_totais AS (
        SELECT
            wai.artist_name,
            COUNT(DISTINCT wcm.start_date) AS total_weeks
        FROM weekly_chart_metadata AS wcm
        LEFT JOIN weekly_artist_items AS wai
            ON wcm.id = wai.chart_metadata_id
        WHERE wcm.user_id = %s
        AND wcm.start_date <= %s
        GROUP BY wai.artist_name
    ),

    ranking_semanal AS (
        SELECT 
            wai.artist_name,
            wcm.start_date,
            ROW_NUMBER() OVER (
                PARTITION BY wcm.start_date 
                ORDER BY wai.playcount DESC, wai.artist_name
            ) AS rank_position
        FROM weekly_artist_items wai
        JOIN weekly_chart_metadata wcm 
            ON wai.chart_metadata_id = wcm.id
        WHERE wcm.user_id = %s
        AND wcm.start_date <= %s
    ),

    melhor_posicao_artist AS (
        SELECT 
            artist_name,
            MIN(rank_position) AS peak_position
        FROM ranking_semanal
        GROUP BY artist_name
    ),

    semanas_no_peak AS (
        SELECT 
            rs.artist_name,
            COUNT(*) AS weeks_on_peak
        FROM ranking_semanal rs
        JOIN melhor_posicao_artist mp
            ON rs.artist_name = mp.artist_name
            AND rs.rank_position = mp.peak_position
        GROUP BY rs.artist_name
    )

    SELECT 
        sa.artist_name,
        sa.rank_position,
        sa.playcount,
        sa.artist_cover,
        sp.previous_rank,
        st.total_weeks,
        mp.peak_position,
        snp.weeks_on_peak
    FROM semana_atual sa
    LEFT JOIN semana_passada sp 
        ON sa.artist_name = sp.artist_name
    LEFT JOIN semanas_totais st 
        ON sa.artist_name = st.artist_name
    LEFT JOIN melhor_posicao_artist mp 
        ON sa.artist_name = mp.artist_name
    LEFT JOIN semanas_no_peak snp 
        ON sa.artist_name = snp.artist_name
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

    artists = cursor.fetchall()
    return artists
