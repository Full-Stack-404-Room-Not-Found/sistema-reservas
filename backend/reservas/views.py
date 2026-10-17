"""
Vistas del componente Reservas. Todas heredan de APIView.
"""
from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Reserva
from .serializers import ReservaSerializer

ERROR_INTERNO = {'detalle': 'Error interno del servidor.'}


# ========== RESERVAS ==========
class ReservaListView(APIView):
    """
    GET /api/v1/reservas con filtros opcionales ?id_usuario= (historial del
    usuario), ?id_habitacion= y ?estado=. POST crea una reserva: si las fechas
    chocan con otra reserva activa, responde 400 (validación del modelo).
    """

    def get(self, request):
        try:
            reservas = Reserva.objects.all()
            filtros = request.query_params
            if filtros.get('id_usuario'):
                reservas = reservas.filter(id_usuario=filtros['id_usuario'])
            if filtros.get('id_habitacion'):
                reservas = reservas.filter(id_habitacion=filtros['id_habitacion'])
            if filtros.get('estado'):
                reservas = reservas.filter(estado=filtros['estado'])
            serializer = ReservaSerializer(reservas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = ReservaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReservaDetailView(APIView):
    """GET, PUT, PATCH y DELETE de /api/v1/reservas/<id> (PATCH sirve, por ejemplo, para cancelar)."""

    def get(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
        except Reserva.DoesNotExist:
            return Response({'detalle': 'Reserva no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ReservaSerializer(reserva).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        return self._actualizar(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._actualizar(request, pk, parcial=True)

    def delete(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
        except Reserva.DoesNotExist:
            return Response({'detalle': 'Reserva no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            reserva.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {'detalle': 'No se puede eliminar una reserva que tiene pagos registrados. Cancelala en su lugar.'},
                status=status.HTTP_409_CONFLICT,
            )
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _actualizar(self, request, pk, parcial):
        try:
            reserva = Reserva.objects.get(pk=pk)
        except Reserva.DoesNotExist:
            return Response({'detalle': 'Reserva no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReservaSerializer(reserva, data=request.data, partial=parcial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
