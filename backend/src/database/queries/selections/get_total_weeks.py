import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.config import Config
from backend.src.database.connection import get_db_connection
from backend.src.database.queries.selections.get_id_by_username import get_user_id

def get_total_weeks():
    user_config  = Config()
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]

    query = '''
        SELECT COUNT(DISTINCT start_date) AS total
        FROM weekly_chart_metadata
        WHERE user_id = %s
    '''
    cursor.execute(query, (user_id,))
    total = cursor.fetchone()
    cursor.close()

    return total[0]

total = get_total_weeks()
print(total)