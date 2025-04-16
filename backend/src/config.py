from flask import Flask, g
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient

def create_app():
    app = Flask(__name__)
    CORS(app)
    load_dotenv()

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Usamos before_first_request en lugar de before_serving para versiones anteriores de Flask
    @app.before_first_request
    def init_db():
        mongo_uri = os.getenv('MONGO_URI')
        # Asegúrate de que mongo_uri incluya los parámetros para TLS/SSL si son necesarios
        g.mongo_client = MongoClient(mongo_uri)
        g.mongo_db = g.mongo_client['todotoday']

    @app.teardown_appcontext
    def close_db(exception):
        client = g.pop('mongo_client', None)
        if client is not None:
            client.close()

    return app

def get_db():
    from flask import g
    return g.get('mongo_db')





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