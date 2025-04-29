# backend/announcements/views.py

from rest_framework import viewsets
from rest_framework import exceptions
from .models import Announcement
from .serializers import AnnouncementSerializer
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsManagerOrSuperuser

class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated, IsManagerOrSuperuser]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Announcement.objects.all()
        return Announcement.objects.filter(building__manager=user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_superuser:
            serializer.save()
        else:
            building = serializer.validated_data.get('building')
            if building.manager != user:
                raise exceptions.ValidationError("Δεν έχετε δικαίωμα να δημιουργήσετε ανακοίνωση για αυτό το κτίριο.")
            serializer.save()
