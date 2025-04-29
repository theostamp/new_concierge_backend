# backend/buildings/serializers.py

from rest_framework import serializers
from .models import Building

class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
        