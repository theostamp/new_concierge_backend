# backend/user_requests/views.py

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import UserRequest
from .serializers import UserRequestSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.created_by == request.user

class UserRequestViewSet(viewsets.ModelViewSet):
    queryset = UserRequest.objects.all() 
    serializer_class = UserRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'supporter_count']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        queryset = UserRequest.objects.all() if user.is_staff else UserRequest.objects.filter(created_by=user)

        # annotate supporter_count ώστε να μπορεί να γίνει ordering
        queryset = queryset.annotate(supporter_count=Count('supporters'))

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def support(self, request, pk=None):
        user_request = self.get_object()
        user = request.user

        if user in user_request.supporters.all():
            user_request.supporters.remove(user)
            return Response({'status': 'Υποστήριξη αφαιρέθηκε'}, status=status.HTTP_200_OK)
        else:
            user_request.supporters.add(user)
            return Response({'status': 'Υποστηρίξατε το αίτημα'}, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def top(self, request):
        """
        Επιστρέφει τα Top 5 αιτήματα με τους περισσότερους υποστηρικτές
        """
        user = request.user
        queryset = UserRequest.objects.all() if user.is_staff else UserRequest.objects.filter(created_by=user)
        queryset = queryset.annotate(supporter_count=Count('supporters')).order_by('-supporter_count', '-created_at')[:5]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
