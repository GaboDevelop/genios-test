"""
URL configuration for genios_back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from genios_back.api.upload_file_view import UploadFileView
from genios_back.api.home_view import HomeView

urlpatterns = [
    path('', HomeView.as_view()),
    path('analysis/interaction/', UploadFileView.as_view()),
    path('analysis/sentiment/', UploadFileView.as_view()),
    path('analysis/emotion/', UploadFileView.as_view()),
]
