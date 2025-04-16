from src.config import create_app
from src.auth import auth
from src.todos import todos
from flask_cors import CORS

app = create_app()
CORS(app)  # Habilita CORS para todas las rutas
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(todos, url_prefix='/api')

# Inicia el servidor de Flask
if __name__ == '__main__':
    # Ejecuta la aplicación Flask.
    app.run(debug=False, host='0.0.0.0', port=5000)
