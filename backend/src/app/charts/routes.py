from flask import jsonify, request
from . import charts_bp
import sys
import os
import json
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from src.database.queries.selections.tops.get_top_albums import get_top_albums
from src.database.queries.selections.tops.get_top_tracks import get_top_tracks
from src.database.queries.selections.tops.get_top_artists import get_top_artists
from src.services.lastfm.get_user_info import get_user_info
from src.database.queries.selections.get_user_info import get_user_charts_info
from src.database.queries.selections.get_total_weeks import get_total_weeks
from src.database.queries.selections.get_charts_infos import get_charts_infos
from src.database.queries.selections.tops.get_chart_data import get_chart_data
from src.database.queries.selections.get_highst_playcount import get_highest_playcount
from src.database.queries.selections.tops.get_track_chart_data import get_track_chart_data
from src.database.queries.selections.tops.get_artist_chart_data import get_artist_chart_data
from src.database.queries.selections.tops.get_recent_date import get_recent_date
from src.database.queries.selections.get_weeks import get_weeks
from src.database.queries.selections.tops.get_top_weekly_albums import get_top_weekly_albums
from src.database.queries.selections.tops.get_top_weekly_tracks import get_top_weekly_tracks

@charts_bp.route('/weekly_albums', methods=['GET'])
def get_weekly_albums():
    albums = get_top_albums()

    dados = []
    for album in albums:
        dado = {
            'type': 'album',
            'name': album[0],
            'artist': album[1],
            'rank_position': album[2],
            'playcount': album[3],
            'cover': album[4],
            'last_week': 0 if album[5] is None else album[5],
            'total_weeks': album[6],
            'peak_position': album[7],
            'weeks_on_top': album[8]
        }
        dados.append(dado)

    return jsonify(dados)

@charts_bp.route('/weekly_tracks', methods=['GET'])
def get_weekly_tracks():
    tracks = get_top_tracks()

    dados = []
    for track in tracks:
        dado = {
            'type': 'track',
            'name': track[0],
            'artist': track[1],
            'rank_position': track[2],
            'playcount': track[3],
            'cover': track[4],
            'last_week': 0 if track[5] is None else track[5],
            'total_weeks': track[6],
            'peak_position': track[7],
            'weeks_on_top': track[8]
        }
        dados.append(dado)

    return jsonify(dados)

@charts_bp.route('/weekly_artists', methods=['GET'])
def get_weekly_artists():
    artists = get_top_artists()

    dados = []
    for artist in artists:
        dado = {
            'type': 'artist',
            'name': artist[0],
            'rank_position': artist[1],
            'playcount': artist[2],
            'cover': artist[3],
            'last_week': 0 if artist[4] is None else artist[4],
            'total_weeks': artist[5],
            'peak_position': artist[6],
            'weeks_on_top': artist[7]
        }
        dados.append(dado)

    return jsonify(dados)

@charts_bp.route('/user_info', methods=['GET'])
def user_get_infos():
    name, playcount, image = get_user_info()
    albums, tracks, artists = get_user_charts_info()
    total_weeks  = get_total_weeks()

    dados = {
        'name': name,
        'playcount': playcount,
        'image': image,
        'album_numbers': albums,
        'track_numbers': tracks,
        'artist_numbers': artists,
        'total_weeks': total_weeks
    }

    return jsonify(dados)

@charts_bp.route('/chart_infos', methods=['GET'])
def gat_charts():
    infos = get_charts_infos()

    dados = []
    for info in infos:
        chart_infos = {
            'type': info[0],
            'metric_type': info[1],
            'name': info[2],
            'secondary_name': info[3],
            'value': info[4],
            'cover': info[5],
            'rank': info[6]
        }
        dados.append(chart_infos)

    return jsonify(dados)

@charts_bp.route('/charts_data', methods=['POST'])
def chart_data():
    infos = request.get_json()
    artist = infos.get('artist')
    album = infos.get('album')

    data = get_chart_data(artist, album)

    chart_run = json.loads(data[10]) if isinstance(data[10], str) else data[10]

    response = [{
            'name': data[0],
            'artist': data[1],
            'cover': data[2],
            'weeks_at_1': data[3],
            'weeks_at_3': data[4],
            'weeks_at_5': data[5],
            'weeks_at_10': data[6],
            'peak_position': data[7],
            'debut_date': data[8],
            'total_weeks': data[9],
            'chart_run': chart_run
        }
    ]

    return jsonify(response)

@charts_bp.route('/chart_track_data', methods=['POST'])
def chart_track_data():
    infos = request.get_json()
    artist = infos.get('artist')
    album = infos.get('album')

    data = get_track_chart_data(artist, album)

    chart_run = json.loads(data[10]) if isinstance(data[10], str) else data[10]

    response = [{
            'name': data[0],
            'artist': data[1],
            'cover': data[2],
            'weeks_at_1': data[3],
            'weeks_at_3': data[4],
            'weeks_at_5': data[5],
            'weeks_at_10': data[6],
            'peak_position': data[7],
            'debut_date': data[8],
            'total_weeks': data[9],
            'chart_run': chart_run
        }
    ]

    return jsonify(response)

@charts_bp.route('/chart_artist_data', methods=['POST'])
def chart_artist_data():
    infos = request.get_json()
    artist = infos.get('album')

    data = get_artist_chart_data(artist)

    chart_run = json.loads(data[9]) if isinstance(data[9], str) else data[9]

    response = [{
            'name': data[0],
            'artist': '',
            'cover': data[1],
            'weeks_at_1': data[2],
            'weeks_at_3': data[3],
            'weeks_at_5': data[4],
            'weeks_at_10': data[5],
            'peak_position': data[6],
            'debut_date': data[7],
            'total_weeks': data[8],
            'chart_run': chart_run
        }
    ]

    print(response)

    return jsonify(response)

@charts_bp.route('/get_weeks', methods=['GET'])
def get_valid_weeks():
    data = get_weeks()

    response = []
    for week in data:
        response.append({
            'id': week[0],
            'start_date': week[1].strftime('%Y-%m-%d'),
            'end_date': week[2].strftime('%Y-%m-%d'),
            'week': week[3]
        })

    return jsonify(response)
        
@charts_bp.route('/highest_playcount', methods=['POST'])
def highest_playcount():
    infos = request.get_json()
    type = infos.get('album')
    datas = get_highest_playcount(type)

    response = []
    for data in datas:
        response.append({
            'cover': data[0],
            'name': data[1],
            'artist': data[2],
            'playcount': data[3],
            'start_date': data[4],
            'end_date': data[5],
            'week_number': data[6],
            'rank_position': data[7]
        })

    return jsonify(response)

@charts_bp.route('/recent_week', methods=['GET'])
def get_recent_week():
    data = get_recent_date()

    response = []
    
    response.append({
        'start_date': data[0].strftime('%Y-%m-%d'),
        'end_date': data[1].strftime('%Y-%m-%d'),
    })

    return jsonify(response)

from flask import request, jsonify

@charts_bp.route('/top_weekly_albums', methods=['POST'])
def get_topweekly_albums():
    data_param = request.json.get('date')

    if not data_param:
        return jsonify({"error": "Parâmetro 'date' ausente na requisição."}), 400

    try:
        albums = get_top_weekly_albums(data_param)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    dados = []
    for album in albums:
        dado = {
            'type': 'album',
            'name': album[0],
            'artist': album[1],
            'rank_position': album[2],
            'playcount': album[3],
            'cover': album[4],
            'last_week': 0 if album[5] is None else album[5],
            'total_weeks': album[6],
            'peak_position': album[7],
            'weeks_on_top': album[8]
        }
        dados.append(dado)

    return jsonify(dados)

@charts_bp.route('/top_weekly_tracks', methods=['POST'])
def get_topweekly_tracks():
    data_param = request.json.get('date')

    if not data_param:
        return jsonify({"error": "Parâmetro 'date' ausente na requisição."}), 400

    try:
        tracks = get_top_weekly_tracks(data_param)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    dados = []
    for track in tracks:
        dado = {
            'type': 'album',
            'name': track[0],
            'artist': track[1],
            'rank_position': track[2],
            'playcount': track[3],
            'cover': track[4],
            'last_week': 0 if track[5] is None else track[5],
            'total_weeks': track[6],
            'peak_position': track[7],
            'weeks_on_top': track[8]
        }
        dados.append(dado)

    return jsonify(dados)