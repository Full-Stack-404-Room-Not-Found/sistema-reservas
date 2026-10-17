from django.contrib import admin

from .models import Comodidad, Habitacion

# HabitacionComodidad no se registra: el panel de administración de Django no
# admite modelos con PK compuesta (la que exige el MR). Las comodidades de cada
# habitación se gestionan por la API (/api/v1/habitacion_comodidad) y se
# muestran como columna de solo lectura en el listado de habitaciones.


@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'numero', 'tipo', 'capacidad', 'precio_noche', 'estado', 'lista_comodidades']
    list_filter = ['tipo', 'estado']
    search_fields = ['numero']

    @admin.display(description='Comodidades')
    def lista_comodidades(self, habitacion):
        # related_name='comodidades' en HabitacionComodidad.id_habitacion
        return ', '.join(r.id_comodidad.nombre_comodidad for r in habitacion.comodidades.all())


@admin.register(Comodidad)
class ComodidadAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre_comodidad']
