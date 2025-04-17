# ToDo-Today

Extensión de Chrome para gestionar una lista de tareas

## Instalación de la extensión

1. Descargar / Clonar el repositorio completo o Descargar el Archivo ZIP Directamente: Haz clic [aquí](https://github.com/user-attachments/files/19794131/bundle.final.zip) para descargar el archivo ZIP de la extensión.
2. Extrae el archivo ZIP descargado.
3. Carga el directorio "bundle final" con [Cargar descomprimida](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked) con el modo Desarrollador activo. Todos los pasos están indicados en el enlace.
4. Abre la extensión ToDo Today.

## Backend

La base de datos está en:
- Mongo Atlas [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)

Y la API está en:
- Render [https://render.com/](https://render.com/).

Por tanto, si se quiere configurar en local deberemos llevar a cabo una serie de pasos y configuraciones con las siguientes tecnologías:
- MongoDB
- Python
- NPM (Front sin usarla como extensión)

1. Instalar dependencias: 
```
backend/
pip install -r requirements.txt
```
Para revisar que todo ha ido bien usar:
```
backend/
pip list
```

2. Crear la base de datos de Mongo en, por ejemplo, C:\data\db e inicializar con:

```
mongod --dbpath C:\data\db
```

3. Arrancar el servidor en el puerto 5000 desde la carpeta /backend:

Local:
```
backend/
python src/app.py
```

Con docker:
```
backend/
docker build -t todotoday-backend .
docker run -p 5000:5000 todotoday-backend
```
