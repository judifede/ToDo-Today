# ToDo-Today

Extensión de Chrome para gestionar una lista de tareas

## Cargar extensión

1. Clonar este repositorio.
2. Cargar el directorio del repositorio con [Cargar descomprimida](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
3. Abre la extensión ToDo Today.

## Backend

1. Instalar dependencias: 
```
pip install blinker==1.9.0 click==8.1.8 colorama==0.4.6 dnspython==2.7.0 Flask==3.1.0 flask-cors==5.0.1 Flask-PyMongo==3.0.1 gunicorn==23.0.0 itsdangerous==2.2.0 Jinja2==3.1.6 MarkupSafe==3.0.2 packaging==24.2 pip==24.3.1 PyJWT==2.10.1 pymongo==4.11.3 python-dotenv==1.1.0 Werkzeug==3.1.3

```
Para revisar que todo ha ido bien usar:
```
pip list
```

2. Crear la base de datos de Mongo en, por ejemplo, C:\data\db e inicializar con:

```
mongod --dbpath C:\data\db
```

3. Arrancar el servidor en el puerto 5000 desde la carpeta /backend:

Local:
```
python src/app.py
```

Hosting Remoto (Render):
```
gunicorn --bind 0.0.0.0:$PORT wsgi:app
```

docker build -t todotoday-backend .
docker run -p 5000:5000 todotoday-backend