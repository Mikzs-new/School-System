from django.urls import path, include

urlpatterns = [
    path('auth/', include('apps.authentication.urls')),
    path('election/', include('apps.election.urls')),
    path('school/', include('apps.school.urls')),
    path('student/', include('apps.student.urls'))
]