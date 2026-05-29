from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()

router.register(r'enrollment', views.StudentEnrollmentViewset, basename='enrollment')
router.register(r'records', views.StudentViewSet, basename='students')
router.register(r'student-csv', views.BulkStudentCSVViewset,basename='student-csv')
urlpatterns = [
    path('', include(router.urls))
]