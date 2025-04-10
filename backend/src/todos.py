import os
from flask import Blueprint, request, jsonify, Response
from bson import json_util, ObjectId
from config import create_app
import jwt
from functools import wraps
from dotenv import load_dotenv

app, mongo = create_app()
todos = Blueprint('todos', __name__)

# Cargar variables de entorno desde el archivo .env
load_dotenv()
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@todos.route('/todos', methods=['POST'])
@token_required
def create_todo(current_user):
    tarea = request.json.get('tarea', None)

    if tarea is None:
        return tarea_not_found()

    if tarea:
        id = mongo.db.todos.insert_one({
            'tarea': tarea,
            'marcada': False,
            'user_id': current_user
            }).inserted_id

        response = {
            'id': str(id),
            'tarea': tarea,
            'marcada': False
        }
        return response, 200

@todos.route('/todos', methods=['GET'])
@token_required
def get_todos(current_user):
    todos = list(mongo.db.todos.find({'user_id': current_user}))
    
    # Listar las tareas por consola
    tareas = []
    for todo in todos:
        tareas.append(todo.get('tarea', 'Sin tarea'))
    
    print(f"List of todos: {tareas}")

    json_todos = json_util.dumps(todos) # Convertimos los objetos Mongo a String
    response = Response(json_todos, mimetype='application/json')

    return response, 200


@todos.route('/todos/<id>', methods=['PUT'])
@token_required
def update_user(current_user, id):

    tarea = request.json.get('tarea', None)
    marcada = request.json.get('marcada', None)

    if marcada is None:
        marcada = mongo.db.todos.find_one({'_id': ObjectId(id)}).get('marcada', None)

    if tarea is None:
            return tarea_not_found()

    mongo.db.todos.update_one(
        {'_id': ObjectId(id), 'user_id': current_user},  # Asegurar que el usuario sea el propietario
        {'$set': {
            'tarea': tarea,
            'marcada': marcada
        }}
    )
    
    response = jsonify({'message': 'Tarea actualizada correctamente'})
    return response, 200

@todos.route('/todos/<id>', methods=['DELETE'])
@token_required
def delete_user(current_user, id):
    todo = mongo.db.todos.delete_one({'_id': ObjectId(id), 'user_id': current_user})  # Asegurar que el usuario sea el propietario
    return "Tarea eliminada", 200

# Error handlers
@todos.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Recurso no encontrado: ' + request.url,
        'status': 404
    }
    return jsonify(message), 404

@todos.errorhandler(406)
def tarea_not_found(error=None):
    message = {
        'message': 'No se proporcionó una tarea: ' + request.url,
        'status': 406
    }
    return jsonify(message), 406