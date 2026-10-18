from django.contrib import admin

from .models import Reserva, Servicio

# ReservaServicio no se registra: el panel de administración de Django no
# admite modelos con PK compuesta (la que exige el MR). Los servicios de cada
# reserva se gestionan por la API (/api/v1/reserva_servicio) y se muestran
# como columna de solo lectura en el listado de reservas.


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ['id', 'id_usuario', 'id_habitacion', 'fecha_checkin', 'fecha_checkout',
                    'estado', 'precio_total', 'lista_servicios']
    list_filter = ['estado']

    @admin.display(description='Servicios')
    def lista_servicios(self, reserva):
        # related_name='servicios' en ReservaServicio.id_reserva
        return ', '.join(f'{r.id_servicio.nombre} x{r.cantidad}' for r in reserva.servicios.all())


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'precio']
