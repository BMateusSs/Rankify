import sys
import os
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection

def get_top_artists():
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]
    print(f"DEBUG: ID de Usuário recuperado: {user_id}") # Linha de depuração 1

    # --- Depurando a start_date mais recente ---
    try:
        cursor.execute("SELECT MAX(start_date) FROM weekly_chart_metadata WHERE user_id = %s", (user_id,))
        latest_start_date = cursor.fetchone()[0]
        print(f"DEBUG: start_date mais recente para o usuário {user_id}: {latest_start_date}") # Linha de depuração 2

        if latest_start_date:
            cursor.execute("SELECT MAX(start_date) - INTERVAL 7 DAY FROM weekly_chart_metadata WHERE user_id = %s", (user_id,))
            previous_start_date = cursor.fetchone()[0]
            print(f"DEBUG: start_date anterior (7 dias atrás) para o usuário {user_id}: {previous_start_date}") # Linha de depuração 3
        else:
            print(f"DEBUG: Nenhuma start_date mais recente encontrada para o usuário {user_id}. Isso pode ser o motivo de não haver dados retornados.")
            return [] # Sai mais cedo se não houver data mais recente
    except Exception as e:
        print(f"ERRO durante a recuperação da data: {e}")
        return [] # Sai mais cedo em caso de erro

    query = '''
    WITH semana_atual AS (
        SELECT
            wai.artist_name,
            wai.playcount,
            wai.rank_position,
            wai.artist_cover
        FROM weekly_chart_metadata AS wcm
        JOIN weekly_artist_items AS wai
            ON wcm.id = wai.chart_metadata_id
        WHERE wcm.start_date = (
            SELECT MAX(start_date) FROM weekly_chart_metadata WHERE user_id = %s
        ) AND wcm.user_id = %s
    ),

    semana_passada AS (
        SELECT
            wai.artist_name,
            wai.rank_position AS previous_rank
        FROM weekly_chart_metadata AS wcm
        JOIN weekly_artist_items AS wai
            ON wcm.id = wai.chart_metadata_id
        WHERE wcm.start_date = (
            SELECT MAX(start_date) - INTERVAL 7 DAY FROM weekly_chart_metadata WHERE user_id = %s
        ) AND wcm.user_id = %s
    ),

    semanas_totais AS (
        SELECT
            wai.artist_name,
            COUNT(DISTINCT wcm.start_date) AS total_weeks
        FROM weekly_chart_metadata AS wcm
        JOIN weekly_artist_items AS wai
            ON wcm.id = wai.chart_metadata_id
        WHERE wcm.user_id = %s
        GROUP BY wai.artist_name
    ),

    ranking_semanal AS (
        SELECT
            wai.artist_name,
            wcm.start_date,
            wai.rank_position
        FROM weekly_artist_items wai
        JOIN weekly_chart_metadata wcm
            ON wai.chart_metadata_id = wcm.id
        WHERE wcm.user_id = %s
    ),

    melhor_posicao_artist AS (
        SELECT
            artist_name,
            MIN(rank_position) AS peak_position
        FROM ranking_semanal
        GROUP BY artist_name
    ),

    semanas_no_peak AS (
        SELECT
            rs.artist_name,
            COUNT(*) AS weeks_on_peak
        FROM ranking_semanal rs
        JOIN melhor_posicao_artist mp
            ON rs.artist_name = mp.artist_name
            AND rs.rank_position = mp.peak_position
        GROUP BY rs.artist_name
    )

    SELECT
        sa.artist_name,
        sa.rank_position,
        sa.playcount,
        sa.artist_cover,
        sp.previous_rank,
        st.total_weeks,
        mp.peak_position,
        snp.weeks_on_peak
    FROM semana_atual sa
    LEFT JOIN semana_passada sp
        ON sa.artist_name = sp.artist_name
    LEFT JOIN semanas_totais st
        ON sa.artist_name = st.artist_name
    LEFT JOIN melhor_posicao_artist mp
        ON sa.artist_name = mp.artist_name
    LEFT JOIN semanas_no_peak snp
        ON sa.artist_name = snp.artist_name
    ORDER BY sa.rank_position;
    '''
    try:
        cursor.execute(query, (user_id, user_id, user_id, user_id, user_id, user_id,))
        artists = cursor.fetchall()
        print(f"DEBUG: Número de artistas recuperados: {len(artists)}") # Linha de depuração 4
        return artists
    except Exception as e:
        print(f"ERRO: Ocorreu um erro durante a execução da consulta: {e}") # Linha de depuração 5
        return []
    finally:
        cursor.close()
        connection.close()

# Exemplo de uso:
if __name__ == "__main__":
    top_artists_data = get_top_artists()
    if top_artists_data:
        print("\n--- Dados dos Artistas Mais Populares ---")
        for artist in top_artists_data:
            print(artist)
    else:
        print("\nNenhum dado de artista mais popular encontrado. Verifique as mensagens de depuração acima para pistas.")