from flask import Flask
from src.app.charts import charts_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(charts_bp)
    return app
