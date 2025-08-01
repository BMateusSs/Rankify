import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection

def get_weeks():
   connection = get_db_connection()
   user_id = get_user_id()

   cursor = connection.cursor()

   query = '''
        SELECT id, 
            start_date, 
            end_date,
            ROW_NUMBER() OVER (ORDER BY start_date ASC) AS semanas
            FROM weekly_chart_metadata
            WHERE user_id = %s
            ORDER BY start_date DESC;
    '''
   
   cursor.execute(query, (user_id))
   

   data = cursor.fetchall()

   return data

get_weeks()