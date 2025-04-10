# ToDo-Today

Extensión de Chrome para gestionar una lista de tareas

## Cargar extensión

1. Clonar este repositorio.
2. Cargar el directorio del repositorio con [Cargar descomprimida](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
3. Abre la extensión ToDo Today.

## Backend

1. Instalar dependencias: 
```
pip install Flask Flask-PyMongo pymongo bson flask-cors

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

```
python src/app.py
```

