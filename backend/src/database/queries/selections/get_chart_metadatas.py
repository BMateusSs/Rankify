import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection

def get_chart_metadatas():
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

    return dados