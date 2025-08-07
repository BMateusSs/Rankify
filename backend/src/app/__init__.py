from flask import Flask
from src.app.charts import charts_bp
from src.app.emblems import emblems_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(charts_bp)
    app.register_blueprint(emblems_bp)
    return app
