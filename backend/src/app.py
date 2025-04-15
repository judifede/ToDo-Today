from config import create_app
from auth import auth
from todos import todos

app, mongo = create_app()

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(todos, url_prefix='/api')

# Inicia el servidor de Flask
if __name__ == '__main__':
    # Ejecuta la aplicación Flask.
    # El host se establece en '0.0.0.0' para que sea accesible externamente.
    app.run(debug=True, host='0.0.0.0', port=5000)
