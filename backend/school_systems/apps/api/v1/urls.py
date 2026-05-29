from django.urls import path, include

urlpatterns = [
    path('auth/', include('apps.authentication.api.v1.urls')),
    path('election/', include('apps.election.api.v1.urls')),
    path('school/', include('apps.school.api.v1.urls')),
    path('student/', include('apps.student.api.v1.urls')),
    path('analytics/', include('apps.analytics.api.v1.urls'))
]