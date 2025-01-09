from flask import Flask, request, jsonify, Response # type: ignore
from flask_pymongo import PyMongo # type: ignore
from bson import json_util # type: ignore
from bson.objectid import ObjectId # type: ignore
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/todotoday"
mongo = PyMongo(app)

@app.route('/todos', methods=['POST'])
def create_todo():
    tarea = request.json.get('tarea', None)

    if tarea is None:
        #return jsonify({"error": "No se proporcionó una tarea"}), 406
        return tarea_not_found()

    if tarea:
        id = mongo.db.todotoday.insert_one({'tarea': tarea}).inserted_id

        print(request.json)
        response = {
            'id': str(id),
            'tarea': tarea
        }
        return response, 200

@app.route('/todos', methods=['GET'])
def get_todos():
    todos = list(mongo.db.todotoday.find())
    
    # Listar las tareas por consola
    tareas = []
    for todo in todos:
        tareas.append(todo.get('tarea', 'Sin tarea'))
    
    print(f"List of todos: {tareas}")

    json_todos = json_util.dumps(todos) # Convertimos los objetos Mongo a String
    response = Response(json_todos, mimetype='application/json')

    return response, 200

@app.route('/todos/<id>', methods=['GET'])
def get_todo_by_id(id):
    todo = mongo.db.todotoday.find_one({'_id': ObjectId(id)})
     
    json_todo = json_util.dumps(todo) # Convertimos los objetos Mongo a String
    response = Response(json_todo, mimetype='application/json')
    return response, 200

@app.route('/todos/<id>', methods=['PUT'])
def update_user(id):

    tarea = request.json.get('tarea', None)
    if tarea is None:
            #return jsonify({"error": "No se proporcionó una tarea"}), 406
            return tarea_not_found()

    result = mongo.db.todotoday.update_one({'_id': ObjectId(id)}, {'$set': {
        'tarea': tarea
    }})
    print(result)
    response = jsonify({'message': 'Tarea actualizada correctamente'})
    return response, 200

@app.route('/todos/<id>', methods=['DELETE'])
def delete_user(id):
    todo = mongo.db.todotoday.delete_one({'_id': ObjectId(id)})
    print(todo) #DeleteResult({'n': 1, 'ok': 1.0}, acknowledged=True)
    #json_todo = json_util.dumps(todo) # Convertimos los objetos Mongo a String
    #response = Response(json_todo, mimetype='application/json')
    return "response", 200

# Error handlers
@app.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Recurso no encontrado: ' + request.url,
        'status': 404
    }
    return jsonify(message), 404

@app.errorhandler(406)
def tarea_not_found(error=None):
    message = {
        'message': 'No se proporcionó una tarea: ' + request.url,
        'status': 406
    }
    return jsonify(message), 406

# Inicia el servidor de desarrollo de Flask si es el archivo principal
if __name__ == '__main__':
    app.run(debug=True)


