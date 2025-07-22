import mysql.connector
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from backend.config import Config

def get_db_connection():
    try:
        db_config = Config
        connection = mysql.connector.connect(
            host= db_config.DB_HOST,
            user= db_config.DB_USER,
            password= db_config.DB_PASSWORD,
            database= db_config.DB_NAME
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Erro ao conectar ao MySQL: {err}")
        return None
