from rest_framework import serializers

from sistema_reservas.validacion import ValidarConModeloMixin
from .models import Rol, Usuario


class RolSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id', 'nombre_rol']


class UsuarioSerializer(ValidarConModeloMixin, serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'id_rol', 'nombre', 'apellido', 'email',
            'telefono', 'clave_acceso', 'fecha_registro',
        ]
        # La clave se recibe al registrar pero nunca se devuelve en las respuestas
        extra_kwargs = {'clave_acceso': {'write_only': True}}


class LoginSerializer(serializers.Serializer):
    # Serializer sin modelo: solo valida que lleguen los dos datos del formulario
    email = serializers.EmailField()
    clave_acceso = serializers.CharField()
