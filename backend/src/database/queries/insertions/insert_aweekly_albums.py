import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection
from backend.src.utils.get_valid_dates import date_intervals
from backend.src.utils.convert_dates import datetime_to_unixtime
from backend.src.services.lastfm.get_register_date import get_register_date
from backend.src.services.lastfm.get_weekly_album import get_weekly_albums

def insert_albums(chart_id, start_date, end_date):
    connection = get_db_connection()
    cursor = connection.cursor()

    albums = get_weekly_albums(start_date, end_date)
    print('-=-'*20)
    print(albums)


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

    for dado in dados:
        chart_id, start_date, end_date = dado
        start_unixtime, end_unixtime = datetime_to_unixtime(start_date, end_date)
        insert_albums(chart_id, start_unixtime, end_unixtime)

main()
