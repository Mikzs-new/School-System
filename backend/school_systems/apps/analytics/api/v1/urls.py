from django.urls import path, include

from rest_framework.routers import DefaultRouter

from apps.analytics.api.v1 import views

router = DefaultRouter()

router.register(r'analytics', views.ElectionAnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', include(router.urls))
]