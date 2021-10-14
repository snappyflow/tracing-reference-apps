from api1 import views
from django.urls import path

urlpatterns = [
    path('ser1', views.Server1.as_view()),
    path('ser2', views.Server2.as_view()),
    path('ser3', views.Server3.as_view()),
    path('ser4', views.Server4.as_view()),
    path('ser5', views.Server5.as_view()),
]