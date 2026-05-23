from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .api import views

router = DefaultRouter()

router.register(r'enroll', views.StudentEnrollmentViewset, basename='enroll')
router.register(r'records', views.StudentViewSet, basename='students')
router.register(r'import/student-csv', views.BulkStudentCSVViewset,basename='student-csv')
urlpatterns = [
    path('', include(router.urls))
]