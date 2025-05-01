# backend/votes/views.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Vote, VoteSubmission
from .serializers import VoteSerializer
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now
from collections import Counter

from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})



class VoteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        today = now().date()
        return Vote.objects.filter(published=True, start_date__lte=today, end_date__gte=today)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def vote(self, request, pk=None):
        vote = self.get_object()
        choice = request.data.get('choice')

        if not choice:
            return Response({'error': 'Απαιτείται επιλογή.'}, status=status.HTTP_400_BAD_REQUEST)

        _, _ = VoteSubmission.objects.update_or_create(
            vote=vote,
            user=request.user,
            defaults={'choice': choice}
        )

        return Response({'status': 'Η ψήφος σας καταχωρήθηκε.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='my-submission')
    def my_submission(self, request, pk=None):
        vote = self.get_object()
        user = request.user
        try:
            submission = VoteSubmission.objects.get(vote=vote, user=user)
            return Response({"choice": submission.choice})
        except VoteSubmission.DoesNotExist:
            return Response({"choice": None})
        
        
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def results(self, request, pk=None):
        vote = self.get_object()
        submissions = vote.submissions.all()
        total = submissions.count()

        counts = Counter(sub.choice for sub in submissions)
        results = {
            "ΝΑΙ": counts.get("ΝΑΙ", 0),
            "ΟΧΙ": counts.get("ΟΧΙ", 0),
            "ΛΕΥΚΟ": counts.get("ΛΕΥΚΟ", 0),
            "total": total
        }
        return Response(results)