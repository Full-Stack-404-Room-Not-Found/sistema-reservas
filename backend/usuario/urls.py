from views import(
    UserView,
    UserLogin
) 
from django.urls import path


urlPatterns=[
    path("usuarios/", UserView.as_view()),
    path("login/", UserLogin.as_view() )
]