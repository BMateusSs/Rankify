import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection
from backend.src.utils.get_valid_dates import date_intervals
from backend.src.utils.convert_dates import date_to_datetime
from backend.src.services.lastfm.get_register_date import get_register_date

def insert_metadatas(start_date, end_date):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''
    INSERT INTO weekly_chart_metadata
    (user_id, start_date, end_date)
    VALUES(%s, %s, %s)
    ON DUPLICATE KEY UPDATE end_date = VALUES(end_date)
    ;
    '''
    user_id = get_user_id()[0]
    
    cursor.execute(query, (user_id, start_date, end_date,))
    connection.commit()
                   
def unixtime_date():
    today = date.today()
    register_date = get_register_date()

    dates = date_intervals(register_date, today)
    for start_date, end_date in dates:
        start_datetime, end_datetime = date_to_datetime(start_date, end_date) 
        insert_metadatas(start_datetime, end_datetime)

unixtime_date()




