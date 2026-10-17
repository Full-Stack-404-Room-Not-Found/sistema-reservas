"""
Componente Pagos: pagos asociados a una reserva. Depende del componente Reservas.

Tabla, columnas, tipos y largos según el Modelo Relacional entregado.
"""
from django.core.validators import MinValueValidator
from django.db import models

from reservas.models import Reserva


class Pago(models.Model):
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Confirmado', 'Confirmado'),
        ('Rechazado', 'Rechazado'),
    ]

    id = models.AutoField(primary_key=True, db_column='id_pago')
    # PROTECT: una reserva con pagos no se puede borrar (se cancela en su lugar)
    id_reserva = models.ForeignKey(
        Reserva,
        on_delete=models.PROTECT,
        db_column='id_reserva',
        related_name='pagos',
    )
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')
    # Puede ser parcial (seña y saldo), por eso una reserva tiene muchos pagos
    monto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0, 'El monto no puede ser negativo.')],
    )
    fecha = models.DateTimeField()

    class Meta:
        db_table = 'pago'
        verbose_name = 'pago'
        verbose_name_plural = 'pagos'
        ordering = ['id']

    def __str__(self):
        return f'Pago {self.pk} - reserva {self.id_reserva_id} ({self.estado})'
