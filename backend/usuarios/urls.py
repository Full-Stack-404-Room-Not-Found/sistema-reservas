"""
Rutas locales del componente Usuarios.

Se usa path(), como en el material de la cursada. Las rutas van sin barra
final (/usuarios, /usuarios/3), que es la forma en que el frontend arma las
URLs. <int:pk> captura un número y lo pasa a la vista como el parámetro pk.
"""
from django.urls import path

from .views import (
    LoginView,
    RolDetailView,
    RolListView,
    UsuarioDetailView,
    UsuarioListView,
)

urlpatterns = [
    path('roles', RolListView.as_view(), name='roles'),
    path('roles/<int:pk>', RolDetailView.as_view(), name='rol-detalle'),
    path('usuarios', UsuarioListView.as_view(), name='usuarios'),
    path('usuarios/<int:pk>', UsuarioDetailView.as_view(), name='usuario-detalle'),
    path('login', LoginView.as_view(), name='login'),
]
