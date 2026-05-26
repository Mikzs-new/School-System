from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .api import views as school

router = DefaultRouter()

router.register(r'departments', school.DepartmentViewSet, basename='departments')
router.register(r'courses', school.CourseViewSet, basename='courses')
router.register(r'schools', school.SchoolViewSet, basename='schools')
router.register(r'school_year', school.SchoolYearViewSet, basename='school_year')

urlpatterns = [
    path('', include(router.urls)),
]