from config import create_app
from auth import auth
from todos import todos

app, mongo = create_app()

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(todos, url_prefix='/api')

# Inicia el servidor de desarrollo de Flask si es el archivo principal
if __name__ == '__main__':
    app.run(debug=True)