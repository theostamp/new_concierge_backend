# backend/user_requests/urls.py

from rest_framework.routers import DefaultRouter
from .views import UserRequestViewSet

router = DefaultRouter()
router.register(r'', UserRequestViewSet, basename='user-request')  # ✅ σκέτο route

urlpatterns = router.urls
