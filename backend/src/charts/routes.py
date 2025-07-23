from flask import jsonify, request
from . import charts_bp
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../../..')))

from backend.src.database.queries.selections.tops.get_top_albums import get_top_albums

@charts_bp.route('/weekly_albums', methods=['GET'])
def get_weekly_albums():
    albums = get_top_albums()

    dados = []
    for album in albums:
        dado = {
            'album_name': album[0],
            'artist': album[1],
            'rank_position': album[2],
            'playcount': album[3],
            'album_cover': album[4],
            'last_week': album[5],
            'total_weeks': album[6],
            'peak_position': album[7],
            'weeks_on_top': album[8]
        }
        dados.append(dado)

    return jsonify(dados)