from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient

def create_app():
    app = Flask(__name__)
    CORS(app)  # Esto habilita CORS para todas las rutas
    # CORS(app, resources={r"/api/*": {"origins": "http://example.com"}})
    load_dotenv()

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    mongo_uri = os.getenv('MONGO_URI')
    client = MongoClient(mongo_uri)
    # Acceder a la base de datos en MongoDB Atlas
    mongo = client['todotoday']

    # Comentar la configuración de MongoDB local
    # app.config["MONGO_URI"] = "mongodb://localhost:27017/todotoday"
    # mongo = PyMongo(app).db


    return app, mongo  # Devolver la aplicación y la conexión a la base de datos