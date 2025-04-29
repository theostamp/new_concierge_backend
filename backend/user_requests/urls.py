# backend/user_requests/urls.py

from rest_framework.routers import DefaultRouter
from .views import UserRequestViewSet

router = DefaultRouter()
router.register(r'user-requests', UserRequestViewSet, basename='user-request')

urlpatterns = router.urls
