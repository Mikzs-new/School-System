from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .api import views as school

router = DefaultRouter()

router.register(r'departments', school.DepartmentViewSet, basename='departments')
router.register(r'courses', school.CourseViewSet, basename='courses')
<<<<<<< HEAD
router.register(r'schools', school.SchoolViewSet, basename='schools')
=======
router.register(r'schools', school.SchoolListSerializer, basename='schools')
>>>>>>> 91d8f22921a53300fde3e4fcd7b221eb5d4e11c4
router.register(r'school_year', school.SchoolYearViewSet, basename='school_year')

urlpatterns = [
    path('', include(router.urls)),
]