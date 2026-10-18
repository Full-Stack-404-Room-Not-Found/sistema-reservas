from rest_framework import serializers

from sistema_reservas.validacion import ValidarConModeloMixin
from .models import Reserva, ReservaServicio, Servicio


class ReservaSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = [
            'id', 'id_usuario', 'id_habitacion', 'fecha_checkin', 'fecha_checkout',
            'cantidad_huespedes', 'estado', 'precio_total',
        ]


class ServicioSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre', 'descripcion', 'precio']


class ReservaServicioSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    # Sin campo 'id': la PK es compuesta (id_reserva, id_servicio), como en el MR
    class Meta:
        model = ReservaServicio
        fields = ['id_reserva', 'id_servicio', 'cantidad', 'precio_unitario']

    def validate(self, attrs):
        # En una edición, el par que forma la PK no se puede cambiar: para
        # pasar un consumo a otro servicio se borra y se crea uno nuevo.
        if self.instance is not None:
            for campo in ('id_reserva', 'id_servicio'):
                if campo in attrs and attrs[campo] != getattr(self.instance, campo):
                    raise serializers.ValidationError(
                        {campo: 'No se puede modificar: forma parte de la clave primaria.'}
                    )
        return super().validate(attrs)
