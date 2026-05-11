from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.LoginAPIView.as_view()),
    path('forgot_password/', views.ForgotPasswordAPIView.as_view()),
    path('reset_password/', views.ResetPasswordAPIView.as_view())
]