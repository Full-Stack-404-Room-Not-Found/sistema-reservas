"""Punto de entrada ASGI (servidores web asincrónicos)."""
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_reservas.settings')

application = get_asgi_application()
