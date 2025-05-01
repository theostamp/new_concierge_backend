# backend/votes/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VoteViewSet

router = DefaultRouter()
router.register(r'', VoteViewSet, basename='vote')

urlpatterns = [
    path('', include(router.urls)),
]
