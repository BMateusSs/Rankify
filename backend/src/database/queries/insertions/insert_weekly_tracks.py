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
from backend.src.services.lastfm.get_weekly_track import get_weekly_track
from backend.src.database.queries.selections.get_chart_metadatas import get_chart_metadatas

def insert_weekly_tracks(chart_id, start_date, end_date, c):
    connection = get_db_connection()
    cursor = connection.cursor()

    total = get_total_weeks()

    query = '''
        INSERT INTO weekly_track_items
        (chart_metadata_id, track_name, artist_name, playcount, rank_position, track_cover)
        VALUES(%s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            playcount = VALUES(playcount),
            rank_position = VALUES(rank_position),
            track_cover = VALUES(track_cover);
    '''

    tracks = get_weekly_track(start_date, end_date)

    print(f'\nProcessando chart {c}/{total} (chart_id={chart_id}) com {len(tracks)} tracks...')
    for i, track in enumerate(tracks, 1):
        artist = track['artist']
        track_name = track['track_name']
        playcount = track['playcount']
        rank_position = track['rank_position']
        track_cover = track['track_cover']

        cursor.execute(query, (chart_id, track_name, artist, playcount, rank_position, track_cover,))
        print(f'  Track {i}/{len(tracks)} inserida: {track_name} - {artist}')
    print(f'Finalizado chart {c}/{total} (chart_id={chart_id})\n')
    connection.commit()

def main():

    dados = get_chart_metadatas()
    c = 1
    for dado in dados:
        chart_id, start_date, end_date = dado
        start_unixtime, end_unixtime = datetime_to_unixtime(start_date, end_date)
        insert_weekly_tracks(chart_id, start_unixtime, end_unixtime, c)
        c += 1

main()