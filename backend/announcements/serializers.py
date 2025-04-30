# backend/announcements/serializers.py

from rest_framework import serializers
from django.utils import timezone
from .models import Announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            'id', 'building', 'title', 'description', 'file',
            'start_date', 'end_date', 'created_at', 'published', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'is_active']

    def get_is_active(self, obj):
        today = timezone.now().date()
        return obj.published and obj.start_date <= today <= obj.end_date
