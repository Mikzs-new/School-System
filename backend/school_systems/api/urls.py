from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api import views

# V1
router = DefaultRouter()
router.register(r'registrations', views.RegistrationViewSet, basename='registrations')
router.register(r'students', views.StudentViewSet, basename='students')
router.register(r'candidates', views.CandidateViewSet, basename='candidates')
router.register(r'partylists', views.PartylistViewSet, basename='partylists')
router.register(r'elections', views.ElectionViewSet, basename='elections')
router.register(r'facilitators', views.FacilitatorViewSet, basename='facilitators')
router.register(r'departments', views.DepartmentViewSet, basename='departments')
router.register(r'courses', views.CourseViewSet, basename='courses')
router.register(r'schools', views.SchoolViewSet, basename='schools')
router.register(r'votes', views.VoteViewSet, basename='votes')

urlpatterns = [
    path('v1/', include(router.urls)),
]