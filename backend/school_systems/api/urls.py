from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .election import views as election
from .school import views as school

# V1
router = DefaultRouter()
router.register(r'registrations', school.RegistrationViewSet, basename='registrations')
router.register(r'students', school.StudentViewSet, basename='students')
router.register(r'facilitators', school.FacilitatorViewSet, basename='facilitators')
router.register(r'departments', school.DepartmentViewSet, basename='departments')
router.register(r'courses', school.CourseViewSet, basename='courses')
router.register(r'schools', school.SchoolViewSet, basename='schools')
router.register(r'candidates', election.CandidateViewSet, basename='candidates')
router.register(r'partylists', election.PartylistViewSet, basename='partylists')
router.register(r'elections', election.ElectionViewSet, basename='elections')
router.register(r'votes', election.VoteViewSet, basename='votes')
router.register(r'election_year_level', election.YearLevelValidItemCreateViewSet, basename='election_year_level')
router.register(r'election_course_valid', election.CourseLevelValidItemViewSet, 'election_course_valid')

urlpatterns = [
    path('v1/', include(router.urls)),
    path('v1/upload/student-csv/', school.BulkStudentCSVView.as_view())
]