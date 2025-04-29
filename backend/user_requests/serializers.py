# backend/user_requests/serializers.py

from rest_framework import serializers
from .models import UserRequest

class UserRequestSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    supporter_count = serializers.IntegerField(source='supporter_count', read_only=True)
    supporter_usernames = serializers.SerializerMethodField()
    is_urgent = serializers.BooleanField(source='is_urgent', read_only=True)

    class Meta:
        model = UserRequest
        fields = [
            'id',
            'title',
            'description',
            'status',
            'created_at',
            'updated_at',
            'created_by',
            'created_by_username',
            'supporter_count',
            'supporter_usernames',
            'is_urgent',
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'created_by',
            'created_by_username', 'supporter_count', 'supporter_usernames', 'is_urgent'
        ]

    def get_supporter_usernames(self, obj):
        return [user.username for user in obj.supporters.all()]