from django.shortcuts import render
from models import Role
from usuario.serializers import RoleSerializer
from rest_framework.response import Response
from rest_framework import status


from rest_framework import APIView

class RolView(APIView):
    def get(self, request):
        roles = Role.objects.all()
        serializers=RoleSerializer(roles)
        return Response(serializers.data, status=status.HTTP_200_OK)

class UserView(APIView):
    pass

class UserLogin(APIView):
    pass