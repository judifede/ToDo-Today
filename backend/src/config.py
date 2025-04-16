from flask import Flask, g, current_app
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient

def create_app():
    app = Flask(__name__)
    CORS(app)
    load_dotenv()

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    
    # Eliminamos la inicialización temprana de la base de datos
    
    @app.teardown_appcontext
    def close_db(exception):
        client = g.pop('mongo_client', None)
        if client is not None:
            client.close()

    return app

def get_db():
    if 'mongo_db' not in g:
         mongo_uri = current_app.config.get('MONGO_URI')
         client = MongoClient(mongo_uri)
         g.mongo_client = client
         g.mongo_db = client['todotoday']
    return g.mongo_db





"""
Versión 1.0.0 de la función create_app() para la aplicación Flask.
Esta versión crea una aplicación Flask y establece la conexión a la base de datos MongoDB Atlas.

def create_app():
    app = Flask(__name__)
    CORS(app)  # Habilita CORS para todas las rutas
    # CORS(app, resources={r"/api/*": {"origins": "http://example.com"}})
    load_dotenv()

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    mongo_uri = os.getenv('MONGO_URI')

    # Acceder a la base de datos en MongoDB Atlas
    client = MongoClient(mongo_uri)
    mongo = client['todotoday']
    # End MongoDB Atlas

    # Comentar la configuración de MongoDB local
    # app.config["MONGO_URI"] = "mongodb://localhost:27017/todotoday"
    # mongo = PyMongo(app).db


    return app, mongo  # Devolver la aplicación y la conexión a la base de datos

"""