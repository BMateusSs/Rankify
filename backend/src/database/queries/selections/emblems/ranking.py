import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection

def get_ranking(type):
    connection = get_db_connection()
    cursor = connection.cursor()

    if type == 'album':
        table_name = 'weekly_album_items'
        name_column = 'album_name'
        cover_column = 'album_cover'
        emblem_100_plays = 100
        emblem_1000_plays = 1000
    elif type == 'track':
        table_name = 'weekly_track_items'
        name_column = 'track_name'
        cover_column = 'track_cover'
        emblem_100_plays = 10
        emblem_1000_plays = 100
    else:
        # Retorna uma lista vazia ou lança um erro para um tipo inválido
        return []

    query = f'''
        WITH
        -- 🔥 Emblema: Plays em uma semana
        emblema_100 AS (
            SELECT DISTINCT {name_column}, artist_name, {cover_column}
            FROM {table_name}
            WHERE playcount >= {emblem_100_plays}
        ),
        total_100 AS (
            SELECT COUNT(*) AS total FROM emblema_100
        ),
        pontos_100 AS (
            SELECT
                e.{name_column}, e.artist_name, e.{cover_column},
                1000.0 / t.total AS pontos
            FROM emblema_100 e
            CROSS JOIN total_100 t
        ),

        -- 🎧 Emblema: Reproduções no total
        emblema_1000 AS (
            SELECT {name_column}, artist_name, {cover_column}
            FROM {table_name}
            GROUP BY {name_column}, artist_name, {cover_column}
            HAVING SUM(playcount) >= {emblem_1000_plays}
        ),
        total_1000 AS (
            SELECT COUNT(*) AS total FROM emblema_1000
        ),
        pontos_1000 AS (
            SELECT
                e.{name_column}, e.artist_name, e.{cover_column},
                1000.0 / t.total AS pontos
            FROM emblema_1000 e
            CROSS JOIN total_1000 t
        ),

        -- ⏳ Emblema: +52 semanas no chart
        emblema_52 AS (
            SELECT {name_column}, artist_name, {cover_column}
            FROM {table_name}
            GROUP BY {name_column}, artist_name, {cover_column}
            HAVING COUNT(*) > 52
        ),
        total_52 AS (
            SELECT COUNT(*) AS total FROM emblema_52
        ),
        pontos_52 AS (
            SELECT
                e.{name_column}, e.artist_name, e.{cover_column},
                1000.0 / t.total AS pontos
            FROM emblema_52 e
            CROSS JOIN total_52 t
        ),

        -- 🥇 Emblema: 5+ semanas em #1
        emblema_top1_5 AS (
            SELECT {name_column}, artist_name, {cover_column}
            FROM (
                SELECT
                    {name_column}, artist_name, {cover_column},
                    ROW_NUMBER() OVER (PARTITION BY chart_metadata_id ORDER BY playcount DESC, {name_column}) AS posicao
                FROM {table_name}
            ) ranked
            WHERE posicao = 1
            GROUP BY {name_column}, artist_name, {cover_column}
            HAVING COUNT(*) >= 5
        ),
        total_top1_5 AS (
            SELECT COUNT(*) AS total FROM emblema_top1_5
        ),
        pontos_top1_5 AS (
            SELECT
                e.{name_column}, e.artist_name, e.{cover_column},
                1000.0 / t.total AS pontos
            FROM emblema_top1_5 e
            CROSS JOIN total_top1_5 t
        ),
        
        -- 👑 Emblema: 10+ semanas em #1
        emblema_top1_10 AS (
            SELECT {name_column}, artist_name, {cover_column}
            FROM (
                SELECT
                    {name_column}, artist_name, {cover_column},
                    ROW_NUMBER() OVER (PARTITION BY chart_metadata_id ORDER BY playcount DESC, {name_column}) AS posicao
                FROM {table_name}
            ) ranked
            WHERE posicao = 1
            GROUP BY {name_column}, artist_name, {cover_column}
            HAVING COUNT(*) >= 10
        ),
        total_top1_10 AS (
            SELECT COUNT(*) AS total FROM emblema_top1_10
        ),
        pontos_top1_10 AS (
            SELECT
                e.{name_column}, e.artist_name, e.{cover_column},
                1000.0 / t.total AS pontos
            FROM emblema_top1_10 e
            CROSS JOIN total_top1_10 t
        ),

        -- 🚀 Emblema: Estreia em #1
        estreias AS (
            SELECT
                wai.{name_column}, wai.artist_name, wai.{cover_column}, wcm.start_date,
                ROW_NUMBER() OVER (PARTITION BY wai.chart_metadata_id ORDER BY wai.playcount DESC, wai.{name_column}) AS rank_position
            FROM {table_name} wai
            JOIN weekly_chart_metadata wcm ON wai.chart_metadata_id = wcm.id
        ),
        estreia_top1 AS (
            SELECT e.{name_column}, e.artist_name, e.{cover_column}
            FROM estreias e
            JOIN (
                SELECT {name_column}, artist_name, MIN(start_date) AS debut
                FROM estreias
                GROUP BY {name_column}, artist_name
            ) d
            ON e.{name_column} = d.{name_column} AND e.artist_name = d.artist_name AND e.start_date = d.debut
            WHERE e.rank_position = 1
        ),
        total_estreia AS (
            SELECT COUNT(*) AS total FROM estreia_top1
        ),
        pontos_estreia AS (
            SELECT
                e.{name_column}, e.artist_name, e.{cover_column},
                1000.0 / t.total AS pontos
            FROM estreia_top1 e
            CROSS JOIN total_estreia t
        ),

        -- União de todos os emblemas com pontuação
        todas_pontuacoes AS (
            SELECT * FROM pontos_100
            UNION ALL
            SELECT * FROM pontos_1000
            UNION ALL
            SELECT * FROM pontos_52
            UNION ALL
            SELECT * FROM pontos_top1_5
            UNION ALL
            SELECT * FROM pontos_top1_10  -- Novo emblema adicionado aqui
            UNION ALL
            SELECT * FROM pontos_estreia
        )

        -- Resultado final com soma das pontuações
        SELECT
            {cover_column},
            {name_column},
            artist_name,
            SUM(pontos) AS total_pontos
        FROM todas_pontuacoes
        GROUP BY {cover_column}, {name_column}, artist_name
        ORDER BY total_pontos DESC;
    '''

    cursor.execute(query)
    data = cursor.fetchall()
    return data

def get_max_album_emblems():
    connection = get_db_connection()
    cursor = connection.cursor()

    query= '''
    WITH 
-- 🔥 Emblema: +100 plays em uma semana
emblema_100 AS (
    SELECT DISTINCT album_name, artist_name, album_cover
    FROM weekly_album_items
    WHERE playcount >= 100
),
total_100 AS (
    SELECT COUNT(*) AS total FROM emblema_100
),
pontos_100 AS (
    SELECT 
        e.album_name, e.artist_name, e.album_cover,
        1000.0 / t.total AS pontos
    FROM emblema_100 e
    CROSS JOIN total_100 t
),

-- 🎧 Emblema: +1000 reproduções no total
emblema_1000 AS (
    SELECT album_name, artist_name, album_cover
    FROM weekly_album_items
    GROUP BY album_name, artist_name, album_cover
    HAVING SUM(playcount) >= 1000
),
total_1000 AS (
    SELECT COUNT(*) AS total FROM emblema_1000
),
pontos_1000 AS (
    SELECT 
        e.album_name, e.artist_name, e.album_cover,
        1000.0 / t.total AS pontos
    FROM emblema_1000 e
    CROSS JOIN total_1000 t
),

-- ⏳ Emblema: +52 semanas no chart
emblema_52 AS (
    SELECT album_name, artist_name, album_cover
    FROM weekly_album_items
    GROUP BY album_name, artist_name, album_cover
    HAVING COUNT(*) > 52
),
total_52 AS (
    SELECT COUNT(*) AS total FROM emblema_52
),
pontos_52 AS (
    SELECT 
        e.album_name, e.artist_name, e.album_cover,
        1000.0 / t.total AS pontos
    FROM emblema_52 e
    CROSS JOIN total_52 t
),

-- 🥇 Emblema: 5+ semanas em #1
emblema_top1 AS (
    SELECT album_name, artist_name, album_cover
    FROM (
        SELECT 
            album_name, artist_name, album_cover,
            ROW_NUMBER() OVER (PARTITION BY chart_metadata_id ORDER BY playcount DESC, album_name) AS posicao
        FROM weekly_album_items
    ) ranked
    WHERE posicao = 1
    GROUP BY album_name, artist_name, album_cover
    HAVING COUNT(*) >= 5
),
total_top1 AS (
    SELECT COUNT(*) AS total FROM emblema_top1
),
pontos_top1 AS (
    SELECT 
        e.album_name, e.artist_name, e.album_cover,
        1000.0 / t.total AS pontos
    FROM emblema_top1 e
    CROSS JOIN total_top1 t
),

-- 🚀 Emblema: Estreia em #1
estreias AS (
    SELECT 
        wai.album_name, wai.artist_name, wai.album_cover, wcm.start_date,
        ROW_NUMBER() OVER (PARTITION BY wai.chart_metadata_id ORDER BY wai.playcount DESC, wai.album_name) AS rank_position
    FROM weekly_album_items wai
    JOIN weekly_chart_metadata wcm ON wai.chart_metadata_id = wcm.id
),
estreia_top1 AS (
    SELECT e.album_name, e.artist_name, e.album_cover
    FROM estreias e
    JOIN (
        SELECT album_name, artist_name, MIN(start_date) AS debut
        FROM estreias
        GROUP BY album_name, artist_name
    ) d
    ON e.album_name = d.album_name AND e.artist_name = d.artist_name AND e.start_date = d.debut
    WHERE e.rank_position = 1
),
total_estreia AS (
    SELECT COUNT(*) AS total FROM estreia_top1
),
pontos_estreia AS (
    SELECT 
        e.album_name, e.artist_name, e.album_cover,
        1000.0 / t.total AS pontos
    FROM estreia_top1 e
    CROSS JOIN total_estreia t
),

-- União de todos os emblemas com pontuação
todas_pontuacoes AS (
    SELECT * FROM pontos_100
    UNION ALL
    SELECT * FROM pontos_1000
    UNION ALL
    SELECT * FROM pontos_52
    UNION ALL
    SELECT * FROM pontos_top1
    UNION ALL
    SELECT * FROM pontos_estreia
),

emblemas_por_album AS (
    SELECT 
        album_cover,
        album_name,
        artist_name,
        COUNT(*) AS total_emblemas,
        SUM(pontos) AS total_pontos
    FROM todas_pontuacoes
    GROUP BY album_cover, album_name, artist_name
),

album_top_emblemas AS (
    SELECT *
    FROM emblemas_por_album
    ORDER BY total_emblemas DESC, total_pontos DESC
    LIMIT 1
)

SELECT * FROM album_top_emblemas;
    '''
    cursor.execute(query)
    data = cursor.fetchone()

    return data

data = get_max_album_emblems()
print(data)