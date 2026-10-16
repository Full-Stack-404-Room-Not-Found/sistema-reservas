from .views import ReservaView
from django.urls import path

urlpatterns = [
    #no estoy segura si asi se 
    
    path('reservas/', ReservaView.as_view(), name='reserva'),
]