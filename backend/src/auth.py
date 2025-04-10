from flask import Blueprint, request, jsonify

import jwt
import datetime

from dotenv import load_dotenv
import os

from werkzeug.security import generate_password_hash, check_password_hash

from config import create_app

from flask_login import LoginManager, UserMixin, login_user, current_user, login_required, logout_user
"""

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app, mongo = create_app()
login_manager = LoginManager()
login_manager.init_app(app)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
auth = Blueprint('auth', __name__)


class User(UserMixin):
    pass


@login_manager.user_loader
def user_loader(username):
    user = User()
    user.id = username
    return user

@auth.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        # Authenticate user credentials here
        user = User()
        user.id = username
        login_user(user)
        return "A"
    return "B"

@auth.route('/logout')
def logout_page():
    if current_user.is_active:
        logout_user()
        return 'Logged out'
    else:
        return "you aren't login"

"""
# Cargar variables de entorno desde el archivo .env
load_dotenv()

app, mongo = create_app()
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
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

    if not username or not password:
        return jsonify({"error": "Falta aportar alguna credencial"}), 400

    hashed_password = generate_password_hash(password)
    result = mongo.db.users.insert_one({'username': username, 'password': hashed_password})
    token = generate_token(str(result.inserted_id))

    return jsonify({"token": token, "message": "Usuario registrado con éxito"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = mongo.db.users.find_one({'username': username})

    print(user)

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Fallo en usuario o contraseña"}), 401
    
    token = generate_token(str(user['_id']))
    print(token)
    return jsonify({"token": token, "message": "Sesión iniciada con éxito"}), 200