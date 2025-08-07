from flask import Blueprint

emblems_bp = Blueprint('emblems', __name__, url_prefix='/emblems')

from . import routes