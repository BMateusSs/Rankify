import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection

def get_100_playcount_emblem():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
    SELECT
        wai.album_cover,
        wai.album_name,
        wai.artist_name,
        MIN(wcm.start_date) AS first_100_play_week
    FROM
        weekly_chart_metadata wcm
    LEFT JOIN
        weekly_album_items wai
    ON
        wcm.id = wai.chart_metadata_id
    WHERE
        wai.playcount >= 100
    GROUP BY
        wai.album_cover,
        wai.album_name,
        wai.artist_name
    ORDER BY
        first_100_play_week;
    '''
    cursor.execute(query)
    data = cursor.fetchall()

    return data

def get_1000_playcount_emblem():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
    WITH plays_totais AS (
	SELECT 
		wai.album_cover,
		wai.album_name,
		wai.artist_name,
		SUM(wai.playcount) as plays
	FROM weekly_album_items wai
    GROUP BY
		 wai.album_cover, wai.album_name, wai.artist_name
    )

    SELECT 
        pt.album_cover,
        pt.album_name,
        pt.artist_name
    FROM 
        plays_totais pt
    WHERE 
        pt.plays >= 1000;
    '''

    cursor.execute(query)
    data = cursor.fetchall()

    return data

data = get_1000_playcount_emblem()
print(data)

def get_52_week_albums():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
        WITH semanas_totais AS (
        SELECT 
            wai.album_cover,
            wai.album_name,
            wai.artist_name,
            COUNT(wai.chart_metadata_id) as semanas
        FROM 
            weekly_album_items wai
        GROUP BY
            wai.album_name,
            wai.artist_name,
            wai.album_cover
    )

        SELECT
            st.album_cover,
            st.album_name,
            st.artist_name,
            st.semanas
        FROM
            semanas_totais st
        WHERE
            semanas > 52
        ORDER BY
            semanas DESC;
    '''

    cursor.execute(query)
    data = cursor.fetchall()

    return data

def get_5_weeks_at_one():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
        WITH posicoes AS(
	SELECT
        wai.album_cover,
		wai.album_name,
        wai.artist_name,
        ROW_NUMBER() OVER( 
			PARTITION BY wai.chart_metadata_id
            ORDER BY wai.playcount DESC, wai.album_name) AS posicao_semanal
	FROM 
		weekly_album_items wai
    ),

    semanas_em_1 AS (
        SELECT 
            p.album_cover,
            p.album_name,
            p.artist_name,
            COUNT(p.posicao_semanal) AS vezes_um
        FROM 
            posicoes p
        WHERE p.posicao_semanal = 1
        GROUP BY
            p.album_cover, p.album_name, p.artist_name
    )

    SELECT
        su.album_cover, 
        su.album_name,
        su.artist_name,
        su.vezes_um
    FROM 
        semanas_em_1 su
    WHERE 
        su.vezes_um >= 5
    ORDER BY 
        su.vezes_um DESC;
    '''

    cursor.execute(query)
    data = cursor.fetchall()

    return data

def get_debut_at_1_emblem():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
    WITH positions AS (
	SELECT
		wai.album_cover,
        wai.album_name,
        wai.artist_name,
        wcm.start_date,
        ROW_NUMBER() OVER(PARTITION BY wai.chart_metadata_id
						  ORDER BY wai.playcount DESC, wai.album_name) AS rank_position
	FROM
		weekly_chart_metadata wcm
	LEFT JOIN
		weekly_album_items wai
	ON 
		wcm.id = wai.chart_metadata_id
    ),
    debut_date AS (
        SELECT 
            p.album_cover,
            p.album_name,
            p.artist_name,
            MIN(p.start_date) AS first_date,
            p.rank_position
        FROM 
            positions p
        GROUP BY
            p.album_cover, p.album_name, p.artist_name
    )
    SELECT
        dd.album_cover,
        dd.album_name,
        dd.artist_name,
        dd.first_date,
        dd.rank_position
    FROM
        debut_date dd
    WHERE 
        dd.rank_position = 1;
'''

    cursor.execute(query)
    data = cursor.fetchall()

    return data
