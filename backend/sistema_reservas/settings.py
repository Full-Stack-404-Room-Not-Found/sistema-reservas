"""
Configuración del proyecto sistema_reservas (backend de la Evidencia 6).

Base de datos: MySQL (relacional, no SQLite, como pide la consigna).
Las credenciales se leen de variables de entorno, con valores por defecto
pensados para un MySQL local de desarrollo.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Carga el archivo .env a las variables de entorno de Python
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Clave de desarrollo. En producción se reemplaza por una variable de entorno.
SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-solo-para-desarrollo-cambiar-en-produccion',
)

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Librerías externas
    'rest_framework',
    'corsheaders',
    # Aplicaciones del proyecto: una por componente del diagrama UML
    'usuarios',
    'habitaciones',
    'reservas',
    'pagos',
]

MIDDLEWARE = [
    # CorsMiddleware tiene que ir lo más arriba posible
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'sistema_reservas.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sistema_reservas.wsgi.application'

# ========== BASE DE DATOS ==========
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'sistema_reservas'),
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'es-ar'
TIME_ZONE = 'America/Argentina/Cordoba'
USE_I18N = True
# Sin zonas horarias: las fechas se guardan tal cual las manda el frontend
USE_TZ = False

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ========== CORS ==========
# Permite que la SPA de Angular (ng serve, puerto 4200) consuma la API.
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
]

# ========== DJANGO REST FRAMEWORK ==========
# La consigna no exige autenticación por tokens: la API queda abierta y el
# login se resuelve comparando email y clave contra la base de datos.
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'UNAUTHENTICATED_USER': None,
    # Los DecimalField (precios, montos) se devuelven como número y no como
    # texto, igual que en db.json: el frontend los usa para hacer cuentas.
    'COERCE_DECIMAL_TO_STRING': False,
}
