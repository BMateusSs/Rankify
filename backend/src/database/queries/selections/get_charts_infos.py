import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../..')))

from backend.config import Config
from backend.src.database.connection import get_db_connection

def get_charts_infos():
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = 2

    query = '''
    (
    SELECT
        'album' AS item_type,
        'highest_playcount' AS metric_type,
        wai.album_name AS name,
        wai.artist_name AS secondary_name,
        wai.playcount AS metric_value,
        wai.album_cover AS cover_image,
        wai.rank_position AS rank_in_week
    FROM
        weekly_album_items wai
    JOIN
        weekly_chart_metadata wcm ON wcm.id = wai.chart_metadata_id
    WHERE
        wcm.user_id = %s
    ORDER BY
        wai.playcount DESC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'track' AS item_type,
        'highest_playcount' AS metric_type,
        wti.track_name AS name,
        wti.artist_name AS secondary_name,
        wti.playcount AS metric_value,
        wti.track_cover AS cover_image,
        wti.rank_position AS rank_in_week
    FROM
        weekly_track_items wti
    JOIN
        weekly_chart_metadata wcm ON wcm.id = wti.chart_metadata_id
    WHERE
        wcm.user_id = %s
    ORDER BY
        wti.playcount DESC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'artist' AS item_type,
        'highest_playcount' AS metric_type,
        wai.artist_name AS name,
        NULL AS secondary_name,
        wai.playcount AS metric_value,
        wai.artist_cover AS cover_image,
        wai.rank_position AS rank_in_week
    FROM
        weekly_artist_items wai
    JOIN
        weekly_chart_metadata wcm ON wcm.id = wai.chart_metadata_id
    WHERE
        wcm.user_id = %s
    ORDER BY
        wai.playcount DESC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'album' AS item_type,
        'most_weeks_at_1' AS metric_type,
        ranked_albums.album_name AS name,
        ranked_albums.artist_name AS secondary_name,
        COUNT(ranked_albums.chart_metadata_id) AS metric_value,
        ranked_albums.album_cover AS cover_image,
        NULL AS rank_in_week
    FROM (
        SELECT
            wai.album_name,
            wai.artist_name,
            wai.album_cover,
            wcm.id AS chart_metadata_id,
            ROW_NUMBER() OVER (PARTITION BY wcm.id ORDER BY wai.playcount DESC) AS weekly_rank
        FROM
            weekly_album_items wai
        JOIN
            weekly_chart_metadata wcm ON wcm.id = wai.chart_metadata_id
        WHERE
            wcm.user_id = %s
    ) AS ranked_albums
    WHERE
        ranked_albums.weekly_rank = 1
    GROUP BY
        ranked_albums.album_name,
        ranked_albums.artist_name,
        ranked_albums.album_cover
    ORDER BY
        metric_value DESC, ranked_albums.album_name ASC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'track' AS item_type,
        'most_weeks_at_1' AS metric_type,
        ranked_tracks.track_name AS name,
        ranked_tracks.artist_name AS secondary_name,
        COUNT(ranked_tracks.chart_metadata_id) AS metric_value,
        ranked_tracks.track_cover AS cover_image,
        NULL AS rank_in_week
    FROM (
        SELECT
            wti.track_name,
            wti.artist_name,
            wti.track_cover,
            wcm.id AS chart_metadata_id,
            ROW_NUMBER() OVER (PARTITION BY wcm.id ORDER BY wti.playcount DESC) AS weekly_rank
        FROM
            weekly_track_items wti
        JOIN
            weekly_chart_metadata wcm ON wcm.id = wti.chart_metadata_id
        WHERE
            wcm.user_id = %s
    ) AS ranked_tracks
    WHERE
        ranked_tracks.weekly_rank = 1
    GROUP BY
        ranked_tracks.track_name,
        ranked_tracks.artist_name,
        ranked_tracks.track_cover
    ORDER BY
        metric_value DESC, ranked_tracks.track_name ASC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'artist' AS item_type,
        'most_weeks_at_1' AS metric_type,
        ranked_artists.artist_name AS name,
        NULL AS secondary_name,
        COUNT(ranked_artists.chart_metadata_id) AS metric_value,
        ranked_artists.artist_cover AS cover_image,
        NULL AS rank_in_week
    FROM (
        SELECT
            wai.artist_name,
            wai.artist_cover,
            wcm.id AS chart_metadata_id,
            ROW_NUMBER() OVER (PARTITION BY wcm.id ORDER BY wai.playcount DESC) AS weekly_rank
        FROM
            weekly_artist_items wai
        JOIN
            weekly_chart_metadata wcm ON wcm.id = wai.chart_metadata_id
        WHERE
            wcm.user_id = %s
    ) AS ranked_artists
    WHERE
        ranked_artists.weekly_rank = 1
    GROUP BY
        ranked_artists.artist_name,
        ranked_artists.artist_cover
    ORDER BY
        metric_value DESC, ranked_artists.artist_name ASC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'album' AS item_type,
        'highest_debut' AS metric_type,
        debut_albums.album_name AS name,
        debut_albums.artist_name AS secondary_name,
        debut_albums.playcount AS metric_value,
        debut_albums.album_cover AS cover_image,
        debut_albums.rank_position AS rank_in_week
    FROM (
        SELECT
            wai.album_name,
            wai.artist_name,
            wai.playcount,
            wai.album_cover,
            wai.rank_position,
            wcm.start_date,
            ROW_NUMBER() OVER (PARTITION BY wai.album_name, wai.artist_name ORDER BY wcm.start_date ASC) AS debut_rank
        FROM
            weekly_album_items wai
        JOIN
            weekly_chart_metadata wcm ON wcm.id = wai.chart_metadata_id
        WHERE
            wcm.user_id = %s
    ) AS debut_albums
    WHERE
        debut_albums.debut_rank = 1
        AND debut_albums.rank_position = 1
    ORDER BY
        debut_albums.playcount DESC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'track' AS item_type,
        'highest_debut' AS metric_type,
        debut_tracks.track_name AS name,
        debut_tracks.artist_name AS secondary_name,
        debut_tracks.playcount AS metric_value,
        debut_tracks.track_cover AS cover_image,
        debut_tracks.rank_position AS rank_in_week
    FROM (
        SELECT
            wti.track_name,
            wti.artist_name,
            wti.playcount,
            wti.track_cover,
            wti.rank_position,
            wcm.start_date,
            ROW_NUMBER() OVER (PARTITION BY wti.track_name, wti.artist_name ORDER BY wcm.start_date ASC) AS debut_rank
        FROM
            weekly_track_items wti
        JOIN
            weekly_chart_metadata wcm ON wcm.id = wti.chart_metadata_id
        WHERE
            wcm.user_id = %s
    ) AS debut_tracks
    WHERE
        debut_tracks.debut_rank = 1
        AND debut_tracks.rank_position = 1
    ORDER BY
        debut_tracks.playcount DESC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'artist' AS item_type,
        'highest_debut' AS metric_type,
        debut_artists.artist_name AS name,
        NULL AS secondary_name,
        debut_artists.playcount AS metric_value,
        debut_artists.artist_cover AS cover_image,
        debut_artists.rank_position AS rank_in_week
    FROM (
        SELECT
            wai.artist_name,
            wai.playcount,
            wai.artist_cover,
            wai.rank_position,
            wcm.start_date,
            ROW_NUMBER() OVER (PARTITION BY wai.artist_name ORDER BY wcm.start_date ASC) AS debut_rank
        FROM
            weekly_artist_items wai
        JOIN
            weekly_chart_metadata wcm ON wcm.id = wai.chart_metadata_id
        WHERE
            wcm.user_id = %s
    ) AS debut_artists
    WHERE
        debut_artists.debut_rank = 1
        AND debut_artists.rank_position = 1
    ORDER BY
        debut_artists.playcount DESC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'artist' AS item_type,
        'most_tracks_debuting_at_1' AS metric_type,
        tda1.artist_name AS name,
        NULL AS secondary_name,
        COUNT(tda1.track_name) AS metric_value,
        (SELECT artist_cover FROM weekly_artist_items WHERE artist_name = tda1.artist_name AND chart_metadata_id IN (SELECT id FROM weekly_chart_metadata WHERE user_id = %s) LIMIT 1) AS cover_image,
        NULL AS rank_in_week
    FROM (
        SELECT
            wti.track_name,
            wti.artist_name,
            wti.rank_position,
            wcm.start_date,
            ROW_NUMBER() OVER (PARTITION BY wti.track_name, wti.artist_name ORDER BY wcm.start_date ASC) AS debut_rank
        FROM
            weekly_track_items wti
        JOIN
            weekly_chart_metadata wcm ON wcm.id = wti.chart_metadata_id
        WHERE
            wcm.user_id = %s
    ) AS tda1
    WHERE
        tda1.debut_rank = 1
        AND tda1.rank_position = 1
    GROUP BY
        tda1.artist_name
    ORDER BY
        metric_value DESC, tda1.artist_name ASC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'artist' AS item_type,
        'most_albums_debuting_at_1' AS metric_type,
        ada1.artist_name AS name,
        NULL AS secondary_name,
        COUNT(ada1.album_name) AS metric_value,
        (SELECT artist_cover FROM weekly_artist_items WHERE artist_name = ada1.artist_name AND chart_metadata_id IN (SELECT id FROM weekly_chart_metadata WHERE user_id = %s) LIMIT 1) AS cover_image,
        NULL AS rank_in_week
    FROM (
        SELECT
            wai.album_name,
            wai.artist_name,
            wai.rank_position,
            wcm.start_date,
            ROW_NUMBER() OVER (PARTITION BY wai.album_name, wai.artist_name ORDER BY wcm.start_date ASC) AS debut_rank
        FROM
            weekly_album_items wai
        JOIN
            weekly_chart_metadata wcm ON wcm.id = wai.chart_metadata_id
        WHERE
            wcm.user_id = %s
    ) AS ada1
    WHERE
        ada1.debut_rank = 1
        AND ada1.rank_position = 1
    GROUP BY
        ada1.artist_name
    ORDER BY
        metric_value DESC, ada1.artist_name ASC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'artist' AS item_type,
        'most_distinct_tracks_at_1' AS metric_type,
        t1.artist_name AS name,
        NULL AS secondary_name,
        COUNT(DISTINCT t1.track_name) AS metric_value,
        (SELECT artist_cover FROM weekly_artist_items WHERE artist_name = t1.artist_name AND chart_metadata_id IN (SELECT id FROM weekly_chart_metadata WHERE user_id = %s) LIMIT 1) AS cover_image,
        NULL AS rank_in_week
    FROM
        weekly_track_items t1
    JOIN
        weekly_chart_metadata wcm ON wcm.id = t1.chart_metadata_id
    WHERE
        wcm.user_id = %s
        AND t1.rank_position = 1
    GROUP BY
        t1.artist_name
    ORDER BY
        metric_value DESC, t1.artist_name ASC
    LIMIT 1
)
UNION ALL
(
    SELECT
        'artist' AS item_type,
        'most_distinct_albums_at_1' AS metric_type,
        a1.artist_name AS name,
        NULL AS secondary_name,
        COUNT(DISTINCT a1.album_name) AS metric_value,
        (SELECT artist_cover FROM weekly_artist_items WHERE artist_name = a1.artist_name AND chart_metadata_id IN (SELECT id FROM weekly_chart_metadata WHERE user_id = %s) LIMIT 1) AS cover_image,
        NULL AS rank_in_week
    FROM
        weekly_album_items a1
    JOIN
        weekly_chart_metadata wcm ON wcm.id = a1.chart_metadata_id
    WHERE
        wcm.user_id = %s
        AND a1.rank_position = 1
    GROUP BY
        a1.artist_name
    ORDER BY
        metric_value DESC, a1.artist_name ASC
    LIMIT 1
);
    '''

    cursor.execute(query, (user_id,) * 17)
    dados = cursor.fetchall()
    print(query.count('%s'))  # isso vai te mostrar o número exato

    return dados

