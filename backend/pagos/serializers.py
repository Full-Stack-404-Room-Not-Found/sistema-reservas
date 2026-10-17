from rest_framework import serializers

from sistema_reservas.validacion import ValidarConModeloMixin
from .models import Pago


class PagoSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = ['id', 'id_reserva', 'estado', 'monto', 'fecha']
