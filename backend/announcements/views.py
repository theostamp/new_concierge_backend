# backend/announcements/views.py
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Announcement
from .serializers import AnnouncementSerializer
from core.permissions import IsManagerOrSuperuser

class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    list/retrieve: public (published μόνο αν anonymous)
    create/update/delete: authenticated managers ή superusers
    """
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Announcement.objects.all()
        if user.is_authenticated:
            if user.is_superuser:
                return qs
            # ο manager βλέπει μόνο τα δικά του buildings
            return qs.filter(building__manager=user)
        # anonymous: μόνο published
        return qs.filter(published=True)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        # create/update/delete
        return [permissions.IsAuthenticated(), IsManagerOrSuperuser()]

    def perform_create(self, serializer):
        # το building ελέγχθηκε ήδη στο serializer.validate_building
        serializer.save()

    def perform_update(self, serializer):
        # analogously
        serializer.save()

