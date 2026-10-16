from django.db import models
from habitaciones.models import Habitacion
from usuario.models import Usuario


class Reserva(models.Model):
    id_reserva = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey('usuario.Usuario', on_delete= models.CASCADE,
                                   related_name='reservas',
                                   db_column='id_usuario',
                                   help_text="Usuario que realiza la reserva")
    id_habitacion = models.ForeignKey('habitaciones.Habitacion', on_delete= models.CASCADE,
                                      related_name='reservas_habitacion',
                                      db_column='id_habitacion',
                                      help_text="Habitación reservada")
    fecha_checkin = models.DateField(help_text="Fecha de ingreso (Check-in)")
    fecha_checkout = models.DateField(help_text="Fecha de salida(Check-out)")
    cantidad_huespedes = models.PositiveIntegerField(help_text="Cantidad de huéspedes")

    ESTADOS = [
        ('finalizada', 'Finalizada'),
        ('confirmada', 'Confirmada'),
        ('pendiente', 'Pendiente'),
        ('cancelada', 'Cancelada'),
    ]
    estado = models.CharField(max_length=20,
                            choices= ESTADOS,
                            default='pendiente',
                            help_text="Estado actual de la reserva"
    )
    precio_total = models.DecimalField(max_digits=10,
                                        decimal_places=2,
                                        help_text="Precio de la reserva")

   
    def __str__(self):
        return f"Reserva #{self.id_reserva} - Usuario {self.id_usuario} - Habitación {self.id_habitacion})"
                                        
    



class Servicio(models.Model):
    pass

class ReservaServicio(models.Model):
    pass