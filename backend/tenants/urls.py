# backend/tenants/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TenantViewSet

router = DefaultRouter()
router.register(r'tenants', TenantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
