import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from src.database.queries.selections.get_id_by_username import get_user_id
from src.database.connection import get_db_connection

def get_recent_date():
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]

    query = '''
       SELECT 
            start_date,
            end_date
       FROM 
	        weekly_chart_metadata
       WHERE 
            user_id = 2
       AND 
            start_date = (SELECT MAX(start_date) FROM weekly_chart_metadata WHERE user_id = 2);
    '''
    cursor.execute(query)
    dados = cursor.fetchone()
    print(dados)
    connection.close()

    return dados

get_recent_date()