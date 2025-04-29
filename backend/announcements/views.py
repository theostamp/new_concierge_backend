# backend/announcements/views.py

from rest_framework import viewsets
from .models import Announcement
from .serializers import AnnouncementSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.permissions import IsManagerOrSuperuser

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        if self.action == 'list':
            # Μόνο το list (GET /api/announcements/) είναι public
            return [AllowAny()]
        return [IsAuthenticated(), IsManagerOrSuperuser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_superuser:
                return Announcement.objects.all()
            return Announcement.objects.filter(building__manager=user)
        else:
            return Announcement.objects.filter(published=True)


    def perform_create(self, serializer):
        user = self.request.user
        building = serializer.validated_data.get('building')
        if not user.is_superuser and building.manager != user:
            raise PermissionError("Δεν έχετε δικαίωμα να δημιουργήσετε ανακοίνωση για αυτό το κτίριο.")
        serializer.save()
