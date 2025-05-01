# backend/votes/serializers.py
from rest_framework import serializers
from .models import Vote, VoteSubmission

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = [
            'id',
            'title',
            'description',
            'start_date',
            'end_date',
            'published',
            'created_at',
        ]
        read_only_fields = ['id', 'published', 'created_at']

class VoteSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteSubmission
        fields = ['id', 'vote', 'choice', 'submitted_at']
        read_only_fields = ['id', 'submitted_at', 'vote']

    def create(self, validated_data):
        user = self.context['request'].user
        vote = self.context['vote']
        return VoteSubmission.objects.create(user=user, vote=vote, **validated_data)
