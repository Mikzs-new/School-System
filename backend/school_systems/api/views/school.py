from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from ..permissions import IsAdmin, CanManageModel, CanVote

from school.models import Registration, School, Facilitator, Student, Course, Department

from ..serializers.school import FacilitatorSerializer, FacilitatorCreateSerializer, SchoolSerializer, SchoolCreateSerializer, StudentSerializer, StudentCreateSerializer, CourseSerializer, CourseCreateSerializer, RegistrationCreateSerializer, RegistrationSerializer, DepartmentSerializer, DepartmentCreateSerializer

from ..validation import validate_csv, validate_image

class FacilitatorViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Facilitator.objects.all()
        elif hasattr(user, 'facilitator'):
            return Facilitator.objects.filter(
                school=user.facilitator.school
            )
        
        return Facilitator.objects.none()

    
    def get_serializer_class(self):
        if self.action == 'create':
            return FacilitatorCreateSerializer
        return FacilitatorSerializer

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
        if self.action == 'create':
            return DepartmentCreateSerializer
        return DepartmentSerializer

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
        if self.action == 'create':
            return CourseCreateSerializer
        return CourseSerializer

class RegistrationViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdmin()]
    
    def get_queryset(self):
        return Registration.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RegistrationCreateSerializer
        return RegistrationSerializer

class SchoolViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdmin()]
    
    def get_queryset(self):
        return School.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return SchoolCreateSerializer
        return SchoolSerializer

class StudentViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), CanManageModel()]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Student.objects.all()
        elif hasattr(user, 'facilitator'):
            return Student.objects.filter(
                school=user.facilitator.school
            )
        
        return Student.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StudentCreateSerializer
        return StudentSerializer