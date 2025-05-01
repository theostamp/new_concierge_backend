# backend/new_concierge_backend/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/users/', include('users.urls')),
    path('api/buildings/', include('buildings.urls')),
    path('api/tenants/', include('tenants.urls')),
    path('api/announcements/', include('announcements.urls')),
    path('api/user-requests/', include('user_requests.urls')),
    path('api/votes/', include('votes.urls')),  # ✅ ΠΡΟΣΤΕΘΗΚΕ ΕΔΩ
    path('api/', include('core.urls')),
]

   
