"""
Vistas del componente Usuarios.

Todas heredan de APIView: cada método HTTP (get, post, put, patch, delete) se
escribe a mano para controlar la lógica y el código de estado de la respuesta.
"""
from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response 
from rest_framework.views import APIView

from .models import Rol, Usuario
from .serializers import LoginSerializer, RolSerializer, UsuarioSerializer

ERROR_INTERNO = {'detalle': 'Error interno del servidor.'}


# ========== ROLES ==========
class RolListView(APIView):
    """GET /api/v1/roles lista los roles. POST crea uno."""

    def get(self, request):
        try:
            roles = Rol.objects.all()
            serializer = RolSerializer(roles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = RolSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RolDetailView(APIView):
    """GET, PUT, PATCH y DELETE de /api/v1/roles/<id>"""

    def get(self, request, pk):
        try:
            rol = Rol.objects.get(pk=pk)
        except Rol.DoesNotExist:
            return Response({'detalle': 'Rol no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(RolSerializer(rol).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        return self._actualizar(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._actualizar(request, pk, parcial=True)

    def delete(self, request, pk):
        try:
            rol = Rol.objects.get(pk=pk)
        except Rol.DoesNotExist:
            return Response({'detalle': 'Rol no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            rol.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            # 409 Conflict: el pedido es válido pero choca con datos existentes
            return Response(
                {'detalle': 'No se puede eliminar un rol que tiene usuarios asignados.'},
                status=status.HTTP_409_CONFLICT,
            )
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PUT reemplaza todos los campos; PATCH (parcial) solo los que llegan
    def _actualizar(self, request, pk, parcial):
        try:
            rol = Rol.objects.get(pk=pk)
        except Rol.DoesNotExist:
            return Response({'detalle': 'Rol no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RolSerializer(rol, data=request.data, partial=parcial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========== USUARIOS ==========
class UsuarioListView(APIView):
    """
    GET /api/v1/usuarios lista los usuarios. Acepta ?email= y ?id_rol= para
    filtrar (el registro usa ?email= para avisar si el correo ya existe).
    POST crea un usuario (registro).
    """

    def get(self, request):
        try:
            usuarios = Usuario.objects.all()
            email = request.query_params.get('email')
            if email:
                usuarios = usuarios.filter(email__iexact=email)
            id_rol = request.query_params.get('id_rol')
            if id_rol:
                usuarios = usuarios.filter(id_rol=id_rol)
            serializer = UsuarioSerializer(usuarios, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UsuarioDetailView(APIView):
    """GET, PUT, PATCH y DELETE de /api/v1/usuarios/<id> (el PATCH sirve para asignar roles)."""

    def get(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            return Response({'detalle': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        return self._actualizar(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._actualizar(request, pk, parcial=True)

    def delete(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            return Response({'detalle': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            usuario.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {'detalle': 'No se puede eliminar un usuario que tiene reservas.'},
                status=status.HTTP_409_CONFLICT,
            )
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _actualizar(self, request, pk, parcial):
        try:
            usuario = Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            return Response({'detalle': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UsuarioSerializer(usuario, data=request.data, partial=parcial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========== LOGIN ==========
class LoginView(APIView):
    """
    POST /api/v1/login con {"email": "...", "clave_acceso": "..."}.

    Responde 200 con los datos del usuario si coinciden, o 401 si no. Va por
    POST para que la clave viaje en el cuerpo del pedido y no en la URL.
    """

    def post(self, request):
        datos = LoginSerializer(data=request.data)
        if not datos.is_valid():
            return Response(datos.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario = Usuario.objects.get(
                email__iexact=datos.validated_data['email'],
                clave_acceso=datos.validated_data['clave_acceso'],
            )
        except Usuario.DoesNotExist:
            return Response(
                {'detalle': 'Correo electrónico o contraseña incorrectos.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_200_OK)
