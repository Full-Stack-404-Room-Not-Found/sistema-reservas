from rest_framework.response import Response
from rest_framework.views import APIView as ApiView
from reservas.models import Reserva
from reservas.serializers import ReservaSerializer

class ReservaView(ApiView):

    def post(self, request):
        try:
            serializer = ReservaSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as e:
            return Response(
            {"error": "Ocurrió un error inesperado al procesar la reserva"},
            status= 500)

    def get(self, request):
        try:
            reserva = Reserva.objects.all()
            serializer = ReservaSerializer(reserva, many=True)
            return Response(serializer.data, status = 200)
        except Exception as e:
            return Response(
                {"error": "Ocurrió un error al obtener las reservas"},
                status= 500
            )



