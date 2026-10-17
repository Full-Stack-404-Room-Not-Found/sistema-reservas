from rest_framework import serializers

from sistema_reservas.validacion import ValidarConModeloMixin
from .models import Reserva


class ReservaSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = [
            'id', 'id_usuario', 'id_habitacion', 'fecha_checkin', 'fecha_checkout',
            'cantidad_huespedes', 'estado', 'precio_total',
        ]
