# backend/new_concierge_backend/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('buildings.urls')),
    path('api/', include('tenants.urls')),
    path('api/', include('announcements.urls')),
    path('api/', include('user_requests.urls')), 
    path('api/', include('api.urls')), # <-- νέο
]
