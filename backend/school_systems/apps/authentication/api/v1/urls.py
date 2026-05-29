from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()

router.register(r'student', views.StudentProfileViewSet, basename='student')
router.register(r'school_staff', views.SchoolStaffProfileViewSet, basename='school_staff')

urlpatterns = [
    path('profiles/', include(router.urls)),
    path('login/', views.LoginAPIView.as_view()),
    path('forgot_password/', views.ForgotPasswordAPIView.as_view()),
    path('reset_password/', views.ResetPasswordAPIView.as_view())
]