from flask import Blueprint

charts_bp = Blueprint('charts', __name__, url_prefix='/weekly_albums')

from . import routes