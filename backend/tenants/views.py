# backend/tenants/views.py

from rest_framework import viewsets
from .models import Tenant
from .serializers import TenantSerializer
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsManagerOrSuperuser

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated, IsManagerOrSuperuser]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Tenant.objects.all()
        return Tenant.objects.filter(building__manager=user)
