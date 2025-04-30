# backend/api/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path
from announcements.views import AnnouncementViewSet
from user_requests.views import UserRequestViewSet
from votes.views import VoteViewSet
from .views import csrf

router = DefaultRouter()
router.register(r'announcements', AnnouncementViewSet)
router.register(r'user-requests', UserRequestViewSet)
router.register(r'votes', VoteViewSet)

urlpatterns = router.urls + [path('csrf/', csrf, name='csrf'),]