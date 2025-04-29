# backend/announcements/serializers.py

from rest_framework import serializers
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
        return obj.is_active()
