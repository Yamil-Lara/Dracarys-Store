Empezando a CORRER:
# 1. Crear entorno virtual
python -m venv venv

# 2. Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# 3. Django: El framework base.
pip install django django-jazzmin

# 4. Django necesita librería llamada "Pillow"
pip install Pillow

# 5. Ejecutar el servidor
python manage.py runserver

# Acceder a la página
http://127.0.0.1:8000/



# ACCESO A ADMIN LOCAL
LINK: http://127.0.0.1:8000/admin

# CREDENCIALES ADMIN
Nombre => admin
Contraseña => 123