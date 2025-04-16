from flask import Blueprint, request, jsonify, Response, current_app
from bson import json_util, ObjectId
from src.config import get_db
import jwt
from functools import wraps

todos = Blueprint('todos', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'No hay Token'}), 403
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['user_id']
        except:
            return jsonify({'message': 'Token no es válido'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@todos.route('/todos', methods=['POST'])
@token_required
def create_todo(current_user):
    tarea = request.json.get('tarea', None)

    if tarea is None:
        return tarea_not_found()
    
    db = get_db()  # Accede a la base de datos previamente inicializada
    mongo = db
    
    # Verificar el número de registros en la tabla todos para el usuario actual
    user_todos_count = mongo.todos.count_documents({'user_id': current_user})

    if user_todos_count >= 20:
        return jsonify({'error': 'Se ha alcanzado el límite de tareas para este usuario.'}), 403

    if tarea:
        id = mongo.todos.insert_one({
            'tarea': tarea,
            'marcada': False,
            'user_id': current_user
            }).inserted_id

        response = {
            'id': str(id),
            'tarea': tarea,
            'marcada': False
        }
        print(f"Tarea creada: {response}")
        return response, 200

@todos.route('/todos', methods=['GET'])
@token_required
def get_todos(current_user):
    db = get_db()  # Accede a la base de datos previamente inicializada
    mongo = db
    todos = list(mongo.todos.find({'user_id': current_user}))
    
    # Listar las tareas por consola
    tareas = []
    for todo in todos:
        tareas.append(todo.get('tarea', 'Sin tarea'))
    
    print(f"Lista de tareas: {tareas}")

    json_todos = json_util.dumps(todos) # Convertimos los objetos Mongo a String
    response = Response(json_todos, mimetype='application/json')

    return response, 200


@todos.route('/todos/<id>', methods=['PUT'])
@token_required
def update_user(current_user, id):
    db = get_db()  # Accede a la base de datos previamente inicializada
    mongo = db

    tarea = request.json.get('tarea', None)
    marcada = request.json.get('marcada', None)

    if marcada is None:
        marcada = mongo.todos.find_one({'_id': ObjectId(id)}).get('marcada', None)

    if tarea is None:
            return tarea_not_found()

    mongo.todos.update_one(
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
    db = get_db()  # Accede a la base de datos previamente inicializada
    mongo = db
    todo = mongo.todos.delete_one({'_id': ObjectId(id), 'user_id': current_user})
    return "Tarea eliminada", 200

# Error handlers
@todos.errorhandler(406)
def tarea_not_found(error=None):
    message = {
        'message': 'No se proporcionó una tarea: ' + request.url,
        'status': 406
    }
    return jsonify(message), 406