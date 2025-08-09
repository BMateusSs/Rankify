import sys
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.get_id_by_username import get_user_id
from backend.src.database.connection import get_db_connection

def get_artist_albums_chart_data(artist_name):
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]

    query = '''
    WITH ranking AS (
	SELECT
		wai.album_cover,
        wai.album_name,
        wai.artist_name,
        ROW_NUMBER() OVER(PARTITION BY wai.chart_metadata_id ORDER BY wai.playcount DESC, wai.album_name) AS rank_position,
		wcm.start_date
	FROM
		weekly_chart_metadata wcm
	LEFT JOIN
		weekly_album_items wai
	ON 
        wcm.id = wai.chart_metadata_id
    WHERE
        wcm.user_id = %s
),
albums_ranks AS (
	SELECT
		r.album_cover,
        r.album_name,
        r.artist_name,
        r.rank_position,
        r.start_date
	FROM 
		ranking r
	WHERE
		r.artist_name = %s
),

total_weeks AS (
	SELECT
		ar.album_cover,
        ar.album_name,
        ar.artist_name,
        COUNT(DISTINCT ar.start_date) AS total_weeks
	FROM
		albums_ranks ar
	WHERE
		ar.artist_name = %s
	GROUP BY
		ar.album_name,
        ar.album_cover,
        ar.artist_name
),

albums_peaks AS (
	SELECT DISTINCT
    ar.album_cover,
	ar.album_name,
    ar.artist_name,
    MIN(ar.rank_position) AS peak_position,
    MIN(ar.start_date) AS debut_date
FROM 
	albums_ranks ar
GROUP BY
	ar.album_name,
    ar.artist_name,
    ar.album_cover
)

SELECT DISTINCT
	ap.album_name,
    ap.peak_position,
    tw.total_weeks,
    tw.album_cover,
    ap.artist_name,
    ap.debut_date
FROM 
	albums_peaks ap
JOIN
	total_weeks tw
ON
	ap.album_name = tw.album_name AND ap.album_cover = tw.album_cover;
    '''

    cursor.execute(query, (user_id, artist_name, artist_name))
    albums_data = cursor.fetchall()
    
    return albums_data

def get_artist_tracks_chart_data(artist_name):
    connection = get_db_connection()
    cursor = connection.cursor()

    user_id = get_user_id()[0]

    query = '''
    WITH ranking AS (
	SELECT
		wai.track_cover,
        wai.track_name,
        wai.artist_name,
        ROW_NUMBER() OVER(PARTITION BY wai.chart_metadata_id ORDER BY wai.playcount DESC, wai.track_name) AS rank_position,
		wcm.start_date
	FROM
		weekly_chart_metadata wcm
	LEFT JOIN
		weekly_track_items wai
	ON wcm.id = wai.chart_metadata_id
    WHERE 
		wcm.user_id = %s
),
tracks_ranks AS (
	SELECT
		r.track_cover,
        r.track_name,
        r.artist_name,
        r.rank_position,
        r.start_date
	FROM 
		ranking r
	WHERE
		r.artist_name = %s
),

total_weeks AS (
	SELECT
		ar.track_cover,
        ar.track_name,
        ar.artist_name,
        COUNT(DISTINCT ar.start_date) AS total_weeks
	FROM
		tracks_ranks ar
	WHERE
		ar.artist_name = %s
	GROUP BY
		ar.track_name,
        ar.track_cover,
        ar.artist_name
),

tracks_peaks AS (
	SELECT DISTINCT
    ar.track_cover,
	ar.track_name,
    ar.artist_name,
    MIN(ar.rank_position) AS peak_position,
    MIN(ar.start_date) AS debut_date
FROM 
	tracks_ranks ar
GROUP BY
	ar.track_name,
    ar.artist_name,
    ar.track_cover
)

SELECT DISTINCT
	ap.track_name,
    ap.peak_position,
    tw.total_weeks,
    tw.track_cover,
    ap.artist_name,
    ap.debut_date
FROM 
	tracks_peaks ap
JOIN
	total_weeks tw
ON
	ap.track_name = tw.track_name AND ap.track_cover = tw.track_cover
ORDER BY 
    ap.peak_position ASC, tw.total_weeks DESC;
    '''

    cursor.execute(query, (user_id, artist_name, artist_name))
    albums_data = cursor.fetchall()
    
    return albums_data
