
# backend\votes\urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VoteViewSet  # φρόντισε να υπάρχει

router = DefaultRouter()
router.register(r'', VoteViewSet)  # /api/votes/

urlpatterns = [
    path('', include(router.urls)),
]
