"""
Vistas del componente Habitaciones. Todas heredan de APIView.
"""
from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Comodidad, Habitacion, HabitacionComodidad
from .serializers import (
    ComodidadSerializer,
    HabitacionComodidadSerializer,
    HabitacionSerializer,
)

ERROR_INTERNO = {'detalle': 'Error interno del servidor.'}


# ========== HABITACIONES ==========
class HabitacionListView(APIView):
    """
    GET /api/v1/habitaciones con filtros opcionales, los mismos que usaba
    json-server: ?estado=, ?tipo=, ?numero= y ?capacidad_gte= (capacidad mayor
    o igual). POST crea una habitación.
    """

    def get(self, request):
        try:
            habitaciones = Habitacion.objects.all()
            filtros = request.query_params
            if filtros.get('estado'):
                habitaciones = habitaciones.filter(estado=filtros['estado'])
            if filtros.get('tipo'):
                habitaciones = habitaciones.filter(tipo=filtros['tipo'])
            if filtros.get('numero'):
                habitaciones = habitaciones.filter(numero=filtros['numero'])
            if filtros.get('capacidad_gte'):
                if not filtros['capacidad_gte'].isdigit():
                    return Response(
                        {'detalle': 'capacidad_gte debe ser un número entero.'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                habitaciones = habitaciones.filter(capacidad__gte=int(filtros['capacidad_gte']))
            serializer = HabitacionSerializer(habitaciones, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = HabitacionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HabitacionDetailView(APIView):
    """
    GET, PUT, PATCH y DELETE de /api/v1/habitaciones/<id>
    El PATCH es el que usa la reserva para pasar la habitación a 'Ocupada'.
    """

    def get(self, request, pk):
        try:
            habitacion = Habitacion.objects.get(pk=pk)
        except Habitacion.DoesNotExist:
            return Response({'detalle': 'Habitación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(HabitacionSerializer(habitacion).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        return self._actualizar(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._actualizar(request, pk, parcial=True)

    def delete(self, request, pk):
        try:
            habitacion = Habitacion.objects.get(pk=pk)
        except Habitacion.DoesNotExist:
            return Response({'detalle': 'Habitación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            # Sus filas de habitacion_comodidad se borran solas (CASCADE)
            habitacion.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {'detalle': 'No se puede eliminar una habitación que tiene reservas.'},
                status=status.HTTP_409_CONFLICT,
            )
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _actualizar(self, request, pk, parcial):
        try:
            habitacion = Habitacion.objects.get(pk=pk)
        except Habitacion.DoesNotExist:
            return Response({'detalle': 'Habitación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = HabitacionSerializer(habitacion, data=request.data, partial=parcial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========== COMODIDADES ==========
class ComodidadListView(APIView):
    """GET /api/v1/comodidades lista las comodidades. POST crea una."""

    def get(self, request):
        try:
            serializer = ComodidadSerializer(Comodidad.objects.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = ComodidadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ComodidadDetailView(APIView):
    """GET, PUT, PATCH y DELETE de /api/v1/comodidades/<id>"""

    def get(self, request, pk):
        try:
            comodidad = Comodidad.objects.get(pk=pk)
        except Comodidad.DoesNotExist:
            return Response({'detalle': 'Comodidad no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ComodidadSerializer(comodidad).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        return self._actualizar(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._actualizar(request, pk, parcial=True)

    def delete(self, request, pk):
        try:
            comodidad = Comodidad.objects.get(pk=pk)
        except Comodidad.DoesNotExist:
            return Response({'detalle': 'Comodidad no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            comodidad.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _actualizar(self, request, pk, parcial):
        try:
            comodidad = Comodidad.objects.get(pk=pk)
        except Comodidad.DoesNotExist:
            return Response({'detalle': 'Comodidad no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ComodidadSerializer(comodidad, data=request.data, partial=parcial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========== HABITACION_COMODIDAD (tabla puente) ==========
class HabitacionComodidadListView(APIView):
    """
    GET /api/v1/habitacion_comodidad con ?id_habitacion= para traer las
    comodidades de una habitación. POST asigna una comodidad a una habitación.
    """

    def get(self, request):
        try:
            relaciones = HabitacionComodidad.objects.all()
            id_habitacion = request.query_params.get('id_habitacion')
            if id_habitacion:
                relaciones = relaciones.filter(id_habitacion=id_habitacion)
            serializer = HabitacionComodidadSerializer(relaciones, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = HabitacionComodidadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HabitacionComodidadDetailView(APIView):
    """
    GET y DELETE de /api/v1/habitacion_comodidad/<id_habitacion>/<id_comodidad>

    La tabla tiene PK compuesta (MR): la relación se identifica por el par de
    claves y no por un id propio. No se edita: se borra y se crea otra.
    """

    def _obtener(self, id_habitacion, id_comodidad):
        return HabitacionComodidad.objects.get(id_habitacion=id_habitacion, id_comodidad=id_comodidad)

    def get(self, request, id_habitacion, id_comodidad):
        try:
            relacion = self._obtener(id_habitacion, id_comodidad)
        except HabitacionComodidad.DoesNotExist:
            return Response({'detalle': 'Relación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(HabitacionComodidadSerializer(relacion).data, status=status.HTTP_200_OK)

    def delete(self, request, id_habitacion, id_comodidad):
        try:
            relacion = self._obtener(id_habitacion, id_comodidad)
        except HabitacionComodidad.DoesNotExist:
            return Response({'detalle': 'Relación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            relacion.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
