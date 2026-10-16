from rest_framework import serializers
from .models import Reserva

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = [
            'id_reserva',
            'id_usuario',
            'id_habitacion',
            'fecha_checkin',
            'fecha_checkout',
            'cantidad_huespedes',
            'estado',
            'precio_total',

        ]
        read_only_fields = ['id_reserva']

    #validación para el campo cantidad_huespedes
    def validate_cantidad_huespedes(self, value):
        if value <=0:
            raise serializers.ValidationError("La cantidad de huéspedes debe ser al menos 1")
        return value

    #validación para los campos checkin checkout
    def validate(self, data):
        fecha_checkin = data.get('fecha_checkin')
        fecha_checkout= data.get('fecha_checkout')

        if fecha_checkout and fecha_checkin:
            if fecha_checkout <= fecha_checkin:
                raise serializers.ValidationError("La fecha checkout debe ser posterior a la fecha checkin")
        return data
                



class ServicioSerializer(serializers.ModelSerializer):
    pass

class ReservaServicioSerializer(serializers.ModelSerializer):
    pass

