from rest_framework import serializers
from models import Usuario, Role

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Role
        fields='__all__'
    pass

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
            model=Usuario
            fields='__all__'
    pass