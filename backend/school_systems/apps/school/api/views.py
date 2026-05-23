from rest_framework import viewsets, serializers, status, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from shared.permissions.user_permissions import IsAdmin, CanManageModel, CanManageSchoolData

from apps.school.models.course import Course
from apps.school.models.department import Department
from apps.school.models.school import School
from apps.school.models.school_year import SchoolYear

from .serializers.create import SchoolCreateSerializer, CourseCreateSerializer,DepartmentCreateSerializer, SchoolYearCreateSerializer
from .serializers.detail import SchoolDetailSerializer, CourseDetailSerializer, DepartmentDetailSerializer, SchoolYearDetailSerializer
from .serializers.list import SchoolListSerializer, CourseListSerializer, RegistrationListSerializer, DepartmentListSerializer, SchoolYearListSerializer

from shared.utils.helper.school import get_user_school

from django.core.exceptions import PermissionDenied
from django.db import transaction


class DepartmentViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Department.objects.all()
        elif hasattr(user, 'facilitator'):
            return Department.objects.filter(
                school=user.facilitator.school
            )
        
        return Department.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DepartmentDetailSerializer
        elif self.action == 'create':
            return DepartmentCreateSerializer
        elif self.action == 'list':
            return DepartmentListSerializer
        
        return DepartmentListSerializer
    
    def perform_create(self, serializer):
        
        return super().perform_create(serializer)

class CourseViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Course.objects.all()
        elif hasattr(user, 'facilitator'):
            return Course.objects.filter(
                school=user.facilitator.school
            )
        
        return Course.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        elif self.action == 'create':
            return CourseCreateSerializer
        elif self.action == 'list':
            return CourseListSerializer
        return CourseListSerializer

class SchoolViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdmin()]
    
    def get_queryset(self):
        return School.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SchoolDetailSerializer
        elif self.action == 'create':
            return SchoolCreateSerializer
        elif self.action == 'list':
            return SchoolListSerializer
        return SchoolListSerializer

class SchoolYearViewSet(viewsets.GenericViewSet, 
                        mixins.CreateModelMixin, 
                        mixins.UpdateModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.ListModelMixin):
    permission_classes = [IsAuthenticated,CanManageSchoolData]

    def get_queryset(self):
        return super().get_queryset()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SchoolYearDetailSerializer
        elif self.action == 'create':
            return SchoolYearCreateSerializer
        elif self.action == 'list':
            return SchoolYearListSerializer
        return SchoolYearListSerializer

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
