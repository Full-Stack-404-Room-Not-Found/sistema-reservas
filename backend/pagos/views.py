"""
Vistas del componente Pagos. Heredan de APIView.
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pago
from .serializers import PagoSerializer

ERROR_INTERNO = {'detalle': 'Error interno del servidor.'}


class PagoListView(APIView):
    """
    GET /api/v1/pagos con ?id_reserva= opcional (la pantalla de confirmación
    lo usa). POST registra un pago: la reserva lo crea en estado Pendiente.
    """

    def get(self, request):
        try:
            pagos = Pago.objects.all()
            filtros = request.query_params
            if filtros.get('id_reserva'):
                pagos = pagos.filter(id_reserva=filtros['id_reserva'])
            if filtros.get('estado'):
                pagos = pagos.filter(estado=filtros['estado'])
            serializer = PagoSerializer(pagos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = PagoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PagoDetailView(APIView):
    """GET, PUT, PATCH y DELETE de /api/v1/pagos/<id> (PATCH sirve para confirmar o rechazar un pago)."""

    def get(self, request, pk):
        try:
            pago = Pago.objects.get(pk=pk)
        except Pago.DoesNotExist:
            return Response({'detalle': 'Pago no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(PagoSerializer(pago).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        return self._actualizar(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._actualizar(request, pk, parcial=True)

    def delete(self, request, pk):
        try:
            pago = Pago.objects.get(pk=pk)
        except Pago.DoesNotExist:
            return Response({'detalle': 'Pago no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            pago.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _actualizar(self, request, pk, parcial):
        try:
            pago = Pago.objects.get(pk=pk)
        except Pago.DoesNotExist:
            return Response({'detalle': 'Pago no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PagoSerializer(pago, data=request.data, partial=parcial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response(ERROR_INTERNO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
