# Usa una imagen base oficial de Python (ajusta la versión si es necesario)
FROM python:3.11-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de requirements y los instala
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 5000

# Variable de entorno para que gunicorn utilice el puerto que Render proporciona
ENV PORT=5000

# Comando para ejecutar gunicorn
# Supongamos que tu entry point es wsgi.py y el objeto app se encuentra en src/app.py o similar.
# Ajusta el comando según la estructura de tu proyecto.
CMD sh -c "gunicorn --bind 0.0.0.0:${PORT} wsgi:app"
