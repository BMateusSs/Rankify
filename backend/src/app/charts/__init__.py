from flask import Blueprint

charts_bp = Blueprint('charts', __name__, url_prefix='/charts')

from . import routes