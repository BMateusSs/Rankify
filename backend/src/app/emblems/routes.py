from flask import jsonify, request
from . import emblems_bp
import sys
import os
import json
from datetime import datetime, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from src.database.queries.selections.emblems.get_emblems import get_100_playcount_emblem, get_1000_playcount_emblem, get_52_week_albums, get_5_weeks_at_one, get_debut_at_1_emblem
from src.database.queries.selections.emblems.ranking import get_ranking, get_max_album_emblems

@emblems_bp.route('/get_100_playcount_emblem', methods=['GET'])
def get_emblem_100_playcount():
    data = get_100_playcount_emblem()

    response = []
    for album in data:
        response.append({
            'cover': album[0],
            'name': album[1],
            'artist': album[2],
            'date': album[3].strftime('%Y-%m-%d')
        })

    return jsonify(response)

@emblems_bp.route('/get_1000_playcount_emblem', methods=['GET'])
def get_emblem_1000_playcount():
    data = get_1000_playcount_emblem()

    response = []
    for album in data:
        response.append({
            'cover': album[0],
            'name': album[1],
            'artist': album[2],
            'date': ''
        })

    return jsonify(response)

@emblems_bp.route('/get_52_weeks_emblem', methods=['GET'])
def get_emblem_52_weeks():
    data = get_52_week_albums()

    response = []
    for album in data:
        response.append({
            'cover': album[0],
            'name': album[1],
            'artist': album[2],
            'date': ''
        })

    return jsonify(response)


@emblems_bp.route('/get_5_weeks_number_one_emblem', methods=['GET'])
def get_emblem_5_weeks():
    data = get_5_weeks_at_one()

    response = []
    for album in data:
        response.append({
            'cover': album[0],
            'name': album[1],
            'artist': album[2],
            'weeks': album[3]
        })

    return jsonify(response)

@emblems_bp.route('/get_debut_at_one_emblem', methods=['GET'])
def get_emblem_debut_at_one():
    data = get_debut_at_1_emblem()

    response = []
    for album in data:
        response.append({
            'cover': album[0],
            'name': album[1],
            'artist': album[2],
            'start_date': album[3]
        })

    return jsonify(response)

@emblems_bp.route('/get_ranking_albums_emblem', methods=['POST'])
def get_ranking_albums_emblems():
    infos = request.get_json()
    type = infos.get('type')
    data = get_ranking(type)

    response = []
    for album in data:
        response.append({
            'cover': album[0],
            'name': album[1],
            'artist': album[2],
            'total_pontos': album[3]
        })

    return jsonify(response)

@emblems_bp.route('/get_ranking_tracks_emblem', methods=['POST'])
def get_ranking_tracks_emblems():
    infos = request.get_json()
    type = infos.get('type')
    data = get_ranking(type)

    response = []
    for album in data:
        response.append({
            'cover': album[0],
            'name': album[1],
            'artist': album[2],
            'total_pontos': album[3]
        })

    return jsonify(response)

@emblems_bp.route('/get_max_ranking_albums_emblem', methods=['GET'])
def get_max_ranking_albums_emblems():
    
    data = get_max_album_emblems()

    response = []
    response.append({
            'cover': data[0],
            'name': data[1],
            'artist': data[2],
            'total_emblems': data[3],
            'total_pontos': data[4]
        })

    return jsonify(response)

