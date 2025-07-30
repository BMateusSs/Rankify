import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.config import Config
from backend.src.database.connection import get_db_connection

def get_highest_playcount(type):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = f'''
    SELECT
    wai.{type}_cover,
    wai.{type}_name,
    wai.artist_name,
    wai.playcount,
    wcm.start_date AS week_start_date,
    wcm.end_date AS week_end_date,
    -- Calcula o número da semana sequencial
    FLOOR(DATEDIFF(wcm.start_date, (SELECT MIN(start_date) FROM weekly_chart_metadata)) / 7) + 1 AS sequential_week_number,
    ROW_NUMBER() OVER (
        PARTITION BY wcm.start_date, wcm.end_date
        ORDER BY wai.playcount DESC, wai.{type}_name ASC
    ) AS rank_position_calculated
FROM
    weekly_chart_metadata wcm
LEFT JOIN
    weekly_{type}_items wai ON wcm.id = wai.chart_metadata_id
WHERE
    wcm.user_id = 2 AND wai.playcount >= 50
ORDER BY
    wai.playcount DESC;
    '''

    cursor.execute(query)
    dados = cursor.fetchall()
    
    return dados


