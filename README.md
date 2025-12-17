# 🐉 Dracarys Store

![Django](https://img.shields.io/badge/Django-4.x-green)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![License](https://img.shields.io/badge/License-UMSS_BO-yellow)
![Status](https://img.shields.io/badge/Status-Finalizado-green)

**Dracarys Store** es una plataforma web de **comercio electrónico (Marketplace)** desarrollada en **Django**, diseñada para permitir la compra y venta de productos entre usuarios, integrando una **billetera virtual**, personalización de interfaz y un **panel administrativo moderno**.

El sistema implementa **gestión de inventario**, **categorización avanzada**, **geolocalización de productos** y **comisiones automáticas**, ofreciendo una solución robusta y escalable.

**URL**: https://testpythonwebapps.pythonanywhere.com

---

## 📌 Tabla de Contenidos
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuraciones Importantes](#️-configuraciones-importantes)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## ✨ Características

### 👤 Gestión de Usuarios
- Registro e inicio de sesión con autenticación personalizada.
- Perfil de usuario con imagen, datos personales y contacto.
- Personalización de la interfaz (temas de colores persistentes).

### 🛒 Comercio y Productos
- Publicación de productos con imágenes, precio, descripción y estado.
- Geolocalización por Departamento y Provincia.
- Sistema jerárquico de Categorías y Subcategorías.
- Carrito de compras previo a la transacción.

### 💰 Billetera Virtual
- Recarga, retiro y transferencias entre usuarios.
- Pagos internos seguros desde la billetera.
- Comisión automática del **10%** para el administrador.
- Historial completo de transacciones.

### 🛠 Panel Administrativo
- Panel moderno y responsivo con **Django Jazzmin**.
- Gestión total de usuarios, productos, categorías y comisiones.

---

## 🧰 Tecnologías
- **Backend:** Django
- **Frontend:** HTML5, CSS3, JavaScript
- **Base de Datos:** SQLite (desarrollo) / PostgreSQL (producción)
- **Admin UI:** Django Jazzmin
- **Gestión de Imágenes:** Pillow

---

## 🚀 Instalación

### 🔹 Prerrequisitos
- Python 3.10 o superior
- pip
- Git

##

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/dracarys-store.git
cd dracarys-store
```

##

### 2️⃣ Crear y activar entorno virtual
* Windows
```bash
python -m venv venv
venv\Scripts\activate
```

* macOS / Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

##

### 3️⃣ Instalar dependencias
```bash
pip install django django-jazzmin pillow
```
* manualmente:
```bash
pip install django django-jazzmin pillow
```
### 4️⃣ Migrar la base de datos
```bash
python manage.py makemigrations
python manage.py migrate
```

##

### 5️⃣ Crear superusuario
```bash
python manage.py createsuperuser
```

##

### 6️⃣ Ejecutar el servidor
```bash
python manage.py runserver
```
* Acceso local:
```bash
http://127.0.0.1:8000/
```
* Panel administrativo:
```bash
http://127.0.0.1:8000/admin/
```

---

### 📂 Estructura del Proyecto
```bash
Dracarys-Store/
│
├── DevsUp/                 # Configuración del proyecto
│   ├── settings.py         # Apps, BD, Media, Jazzmin
│   ├── urls.py             # Rutas principales
│   └── wsgi.py
│
├── sitioWeb/               # Aplicación principal
│   ├── models.py           # Usuario, Producto, Billetera
│   ├── views.py            # Lógica de negocio
│   ├── urls.py
│   ├── templates/
│   └── static/
│       ├── css/
│       ├── js/
│       └── images/
│
├── media/                  # Archivos subidos
├── db.sqlite3
├── manage.py
└── requirements.txt
```

---

### ⚙️ Configuraciones Importantes
### 📁 Archivos Media
```bash
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

##

### 🎨 Django Jazzmin
#### Configurado en `settings.py` mediante `JAZZMIN_SETTINGS` para personalizar:
* Títulos
* Logos
* Menús
* Colores del panel

##

### 🗄 Base de Datos
* SQLite por defecto
* Recomendado PostgreSQL para producción

---

### 🤝 Contribución
1. Fork del proyecto
2. Crear rama:
```bash
git checkout -b feature/NuevaFuncionalidad
```
3. Commit:
```bash
git commit -m "Añadir nueva funcionalidad"
```
4. Push:
```bash
git push origin feature/NuevaFuncionalidad
```
5. Abrir Pull Request

---

### 📄 Licencia
Este proyecto se distribuye bajo la Licencia de la [Universidad Mayor de San Simón](https://www.umss.edu.bo/tramites).

---

### 📞 Contacto
Desarrollado por [ [Yamil Lara](https://yamil-lara.github.io) / _Equipo DevsUp_ / [UMSS](https://www.umss.edu.bo/) ]
### 📧 Email: Yamillara7@gmail.com