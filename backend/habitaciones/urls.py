"""
Rutas locales del componente Habitaciones (sin barra final, con path()).
"""
from django.urls import path

from .views import (
    ComodidadDetailView,
    ComodidadListView,
    HabitacionComodidadDetailView,
    HabitacionComodidadListView,
    HabitacionDetailView,
    HabitacionListView,
)

urlpatterns = [
    path('habitaciones', HabitacionListView.as_view(), name='habitaciones'),
    path('habitaciones/<int:pk>', HabitacionDetailView.as_view(), name='habitacion-detalle'),
    path('comodidades', ComodidadListView.as_view(), name='comodidades'),
    path('comodidades/<int:pk>', ComodidadDetailView.as_view(), name='comodidad-detalle'),
    path('habitacion_comodidad', HabitacionComodidadListView.as_view(), name='habitacion-comodidad'),
    # PK compuesta (MR): la relación se identifica por /<id_habitacion>/<id_comodidad>
    path(
        'habitacion_comodidad/<int:id_habitacion>/<int:id_comodidad>',
        HabitacionComodidadDetailView.as_view(),
        name='habitacion-comodidad-detalle',
    ),
]
