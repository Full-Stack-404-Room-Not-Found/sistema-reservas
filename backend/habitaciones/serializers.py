from rest_framework import serializers

from sistema_reservas.validacion import ValidarConModeloMixin
from .models import Comodidad, Habitacion, HabitacionComodidad


class HabitacionSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    class Meta:
        model = Habitacion
        fields = ['id', 'numero', 'tipo', 'capacidad', 'precio_noche', 'estado', 'descripcion']


class ComodidadSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    class Meta:
        model = Comodidad
        fields = ['id', 'nombre_comodidad']


class HabitacionComodidadSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    # Sin campo 'id': la PK es compuesta (id_habitacion, id_comodidad), como en el MR
    class Meta:
        model = HabitacionComodidad
        fields = ['id_habitacion', 'id_comodidad']
