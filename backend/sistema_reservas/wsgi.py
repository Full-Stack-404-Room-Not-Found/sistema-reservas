"""Punto de entrada WSGI (servidores web sincrónicos)."""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_reservas.settings')

application = get_wsgi_application()
