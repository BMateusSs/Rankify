import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.queries.selections.get_total_weeks import get_total_weeks
from backend.src.database.connection import get_db_connection
from backend.src.utils.get_valid_dates import date_intervals
from backend.src.utils.convert_dates import datetime_to_unixtime
from backend.src.services.lastfm.get_album_cover import get_album_cover
from backend.src.services.lastfm.get_weekly_artist import get_weekly_artist
from backend.src.database.queries.selections.get_chart_metadatas import get_chart_metadatas

def insert_weekly_artist(chart_id, start_date, end_date, c):
    connection = get_db_connection()
    cursor = connection.cursor()

    total = get_total_weeks()

    query = '''
        INSERT INTO weekly_artist_items
        (chart_metadata_id, artist_name, playcount, rank_position, artist_cover)
        VALUES(%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            playcount = VALUES(playcount),
            rank_position = VALUES(rank_position),
            artist_cover = VALUES(artist_cover);
    '''

    artists = get_weekly_artist(start_date, end_date)

    for artist_info in artists:
        artist_name = artist_info['artist']
        playcount = artist_info['playcount']
        rank_position = artist_info['rank_position']
        artist_cover = artist_info['artist_cover']

        cursor.execute(query, (chart_id, artist_name, playcount, rank_position, artist_cover,))
    
    print(f'{c}/{total}')
    connection.commit()

def main():

    dados = get_chart_metadatas()
    c = 1
    for dado in dados:
        chart_id, start_date, end_date = dado
        start_unixtime, end_unixtime = datetime_to_unixtime(start_date, end_date)
        insert_weekly_artist(chart_id, start_unixtime, end_unixtime, c)
        c += 1

main()