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
from backend.src.services.lastfm.get_weekly_album import get_weekly_albums


def insert_albums(chart_id, start_date, end_date, atual):
    connection = get_db_connection()
    cursor = connection.cursor()

    total = get_total_weeks()

    albums = get_weekly_albums(start_date, end_date)

    query = '''
        INSERT INTO weekly_album_items
        (chart_metadata_id, album_name, artist_name, playcount, rank_position, album_cover)
        VALUES(%s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            playcount = VALUES(playcount),
            rank_position = VALUES(rank_position),
            album_cover = VALUES(album_cover);
    '''

    for album in albums:
        artist = album['artist']
        album_name = album['album_name']
        playcount = album['playcount']
        rank_position = album['rank_position']
        album_cover = album['album_cover']

        cursor.execute(query, (chart_id, album_name, artist, playcount, rank_position, album_cover,))

    print(f'{atual}/{total}')
    connection.commit()
    

def main():
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]

    query = '''
        SELECT id, start_date, end_date
        FROM weekly_chart_metadata
        WHERE user_id = %s

    '''
    cursor.execute(query, (user_id,))
    dados = cursor.fetchall()
    connection.close()
    c = 1
    for dado in dados:
        chart_id, start_date, end_date = dado
        start_unixtime, end_unixtime = datetime_to_unixtime(start_date, end_date)
        insert_albums(chart_id, start_unixtime, end_unixtime, c)
        c += 1

main()
