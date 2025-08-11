import sys
import os
from datetime import datetime

import sys
import codecs

# Redefine a saída padrão para usar a codificação UTF-8
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.config import Config
from backend.src.database.connection import get_db_connection
from backend.src.database.queries.selections.get_id_by_username import get_user_id

def get_overal_albums_infos():
    config = Config()
    user = config.LASTFM_USER
    user_id = get_user_id()[0]

    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
        WITH items_rank AS (
	SELECT
		wai.album_cover,
		wai.album_name,
        wai.artist_name,
        ROW_NUMBER() OVER(PARTITION BY wai.chart_metadata_id
						  ORDER BY wai.playcount DESC, wai.album_name) AS rank_position,
		wcm.start_date
	FROM
		weekly_chart_metadata wcm
	JOIN
		weekly_album_items wai
	ON 
		wcm.id = wai.chart_metadata_id
	WHERE
		wcm.user_id = %s
),
item_peaks AS (
	SELECT
		ir.album_cover,
        ir.album_name,
        ir.artist_name,
        MIN(ir.rank_position) AS peak_position
	FROM
		items_rank ir
	GROUP BY
		ir.album_cover,
        ir.album_name,
        ir.artist_name
),
items_weeks AS (
	SELECT
		ir.album_cover,
        ir.album_name,
        ir.artist_name,
        COUNT(ir.start_date) AS total_weeks
	FROM
		items_rank ir
	GROUP BY 
		ir.album_cover,
        ir.album_name,
        ir.artist_name
)
SELECT
	ip.album_cover,
    ip.album_name,
    ip.artist_name,
    ip.peak_position,
    iw.total_weeks
FROM
	item_peaks ip
JOIN
	items_weeks iw
ON
	ip.album_name = iw.album_name  AND ip.artist_name = iw.artist_name
ORDER BY
	iw.total_weeks DESC;
    '''
    cursor.execute(query, (user_id,))
    data = cursor.fetchall()

    response = {}
    for album in data:
        album_name, artist = album[1], album[2]
        response[(artist, album_name)] = {
            'cover': album[0],
            'peak_position': album[3],
            'total_weeks': album[4]
        }
    return response
    
get_overal_albums_infos()