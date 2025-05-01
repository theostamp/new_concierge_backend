# backend/announcements/serializers.py
from rest_framework import serializers
from django.utils import timezone
from .models import Announcement
from buildings.models import Building

class AnnouncementSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            'id',
            'building',      # πλέον writable
            'title',
            'description',
            'file',
            'start_date',
            'end_date',
            'published',
            'created_at',
            'is_active',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'is_active',
        ]

    def get_is_active(self, obj):
        today = timezone.now().date()
        return obj.published and obj.start_date <= today <= obj.end_date

    def validate_building(self, building: Building):
        """
        Βεβαιωνόμαστε ότι ο τρέχων χρήστης έχει δικαίωμα στο building.
        """
        user = self.context['request'].user
        if user.is_superuser:
            return building
        if hasattr(building, 'manager') and building.manager == user:
            return building
        raise serializers.ValidationError(
            "Δεν έχετε δικαίωμα δημιουργίας σε αυτό το κτίριο."
        )
