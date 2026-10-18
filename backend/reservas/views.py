"""
Vistas del componente Reservas. Todas heredan de APIView.
"""
from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Reserva, ReservaServicio, Servicio
from .serializers import ReservaSerializer, ReservaServicioSerializer, ServicioSerializer

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


# ========== SERVICIOS ==========
class ServicioListView(APIView):
    """GET /api/v1/servicios lista los servicios adicionales. POST crea uno."""

    def get(self, request):
        try:
            serializer = ServicioSerializer(Servicio.objects.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = ServicioSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ServicioDetailView(APIView):
    """GET, PUT, PATCH y DELETE de /api/v1/servicios/<id>"""

    def get(self, request, pk):
        try:
            servicio = Servicio.objects.get(pk=pk)
        except Servicio.DoesNotExist:
            return Response({'detalle': 'Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ServicioSerializer(servicio).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        return self._actualizar(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._actualizar(request, pk, parcial=True)

    def delete(self, request, pk):
        try:
            servicio = Servicio.objects.get(pk=pk)
        except Servicio.DoesNotExist:
            return Response({'detalle': 'Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            servicio.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {'detalle': 'No se puede eliminar un servicio que ya fue contratado en reservas.'},
                status=status.HTTP_409_CONFLICT,
            )
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _actualizar(self, request, pk, parcial):
        try:
            servicio = Servicio.objects.get(pk=pk)
        except Servicio.DoesNotExist:
            return Response({'detalle': 'Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ServicioSerializer(servicio, data=request.data, partial=parcial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========== RESERVA_SERVICIO (tabla puente) ==========
class ReservaServicioListView(APIView):
    """GET /api/v1/reserva_servicio con ?id_reserva= opcional. POST agrega un servicio a una reserva."""

    def get(self, request):
        try:
            relaciones = ReservaServicio.objects.all()
            id_reserva = request.query_params.get('id_reserva')
            if id_reserva:
                relaciones = relaciones.filter(id_reserva=id_reserva)
            serializer = ReservaServicioSerializer(relaciones, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = ReservaServicioSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReservaServicioDetailView(APIView):
    """
    GET, PUT, PATCH y DELETE de /api/v1/reserva_servicio/<id_reserva>/<id_servicio>

    La tabla tiene PK compuesta (MR): el registro se identifica por el par de
    claves. En PUT y PATCH solo se modifican cantidad y precio_unitario.
    """

    def _obtener(self, id_reserva, id_servicio):
        return ReservaServicio.objects.get(id_reserva=id_reserva, id_servicio=id_servicio)

    def get(self, request, id_reserva, id_servicio):
        try:
            relacion = self._obtener(id_reserva, id_servicio)
        except ReservaServicio.DoesNotExist:
            return Response({'detalle': 'Servicio de reserva no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ReservaServicioSerializer(relacion).data, status=status.HTTP_200_OK)

    def put(self, request, id_reserva, id_servicio):
        return self._actualizar(request, id_reserva, id_servicio, parcial=False)

    def patch(self, request, id_reserva, id_servicio):
        return self._actualizar(request, id_reserva, id_servicio, parcial=True)

    def delete(self, request, id_reserva, id_servicio):
        try:
            relacion = self._obtener(id_reserva, id_servicio)
        except ReservaServicio.DoesNotExist:
            return Response({'detalle': 'Servicio de reserva no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            relacion.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _actualizar(self, request, id_reserva, id_servicio, parcial):
        try:
            relacion = self._obtener(id_reserva, id_servicio)
        except ReservaServicio.DoesNotExist:
            return Response({'detalle': 'Servicio de reserva no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReservaServicioSerializer(relacion, data=request.data, partial=parcial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
