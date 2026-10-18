"""
Rutas locales del componente Reservas (sin barra final, con path()).
"""
from django.urls import path

from .views import (
    ReservaDetailView,
    ReservaListView,
    ReservaServicioDetailView,
    ReservaServicioListView,
    ServicioDetailView,
    ServicioListView,
)

urlpatterns = [
    path('reservas', ReservaListView.as_view(), name='reservas'),
    path('reservas/<int:pk>', ReservaDetailView.as_view(), name='reserva-detalle'),
    path('servicios', ServicioListView.as_view(), name='servicios'),
    path('servicios/<int:pk>', ServicioDetailView.as_view(), name='servicio-detalle'),
    path('reserva_servicio', ReservaServicioListView.as_view(), name='reserva-servicio'),
    # PK compuesta (MR): el registro se identifica por /<id_reserva>/<id_servicio>
    path(
        'reserva_servicio/<int:id_reserva>/<int:id_servicio>',
        ReservaServicioDetailView.as_view(),
        name='reserva-servicio-detalle',
    ),
]
