# backend/user_requests/serializers.py

from rest_framework import serializers
from .models import UserRequest

class UserRequestSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    supporter_count = serializers.SerializerMethodField()
    supporter_usernames = serializers.SerializerMethodField()

    class Meta:
        model = UserRequest
        fields = [
            'id',
            'title',
            'description',
            'status',
            'type',
            'is_urgent',
            'created_at',
            'updated_at',
            'created_by_username',
            'supporter_count',
            'supporter_usernames',
        ]
        read_only_fields = fields  # όλα τα παραπάνω είναι μόνο για ανάγνωση

    def get_supporter_count(self, obj):
        return obj.supporters.count()

    def get_supporter_usernames(self, obj):
        return obj.get_supporter_usernames()
