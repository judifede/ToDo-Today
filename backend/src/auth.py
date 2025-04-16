from flask import Blueprint, request, jsonify
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from src.config import create_app

app, mongo = create_app()
auth = Blueprint('auth', __name__)

def generate_token(user_id):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4*30)  # Token expira en 4 meses
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Verificar el número de registros en la tabla users.
    user_count = mongo.users.count_documents({})
    if user_count >= 20:
        return jsonify({'error': 'Se ha alcanzado el límite de usuarios en la aplicación.'}), 403

    # Verificar si han llegado tanto el usuario como la contraseña.
    if not username or not password:
        return jsonify({"error": "Falta aportar alguna credencial"}), 400
    
    # Verificar si el nombre de usuario ya existe
    existing_user = mongo.users.find_one({'username': username})
    if existing_user:
        return jsonify({'error': 'El nombre de usuario ya está en uso.'}), 400

    hashed_password = generate_password_hash(password)
    result = mongo.users.insert_one({'username': username, 'password': hashed_password})
    token = generate_token(str(result.inserted_id))

    print(f"Usuario registrado: {username}")
    print(f"Token generado: {token}")

    return jsonify({"token": token, "message": "Usuario registrado con éxito"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = mongo.users.find_one({'username': username})

    print(f"Usuario: {user}")

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Fallo en usuario o contraseña"}), 401
    
    token = generate_token(str(user['_id']))
    print(f"Token: {token}")
    return jsonify({"token": token, "message": "Sesión iniciada con éxito"}), 200