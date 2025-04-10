from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Esto habilita CORS para todas las rutas
    # CORS(app, resources={r"/api/*": {"origins": "http://example.com"}})
    app.config["MONGO_URI"] = "mongodb://localhost:27017/todotoday"
    mongo = PyMongo(app)
    return app, mongo
