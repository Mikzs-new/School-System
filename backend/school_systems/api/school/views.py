from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from ..permissions.permissions import IsAdmin, CanManageModel

from school.models import Registration, School, Facilitator, Student, Course, Department

from .serializers.create import FacilitatorCreateSerializer, SchoolCreateSerializer, StudentCreateSerializer, CourseCreateSerializer, RegistrationCreateSerializer, DepartmentCreateSerializer

from .serializers.detail import FacilitatorDetailSerializer, SchoolDetailSerializer, StudentDetailSerializer, CourseDetailSerializer, RegistrationDetailSerializer, DepartmentDetailSerializer

from .serializers.list import FacilitatorListSerializer, SchoolListSerializer, StudentListSerializer, CourseListSerializer, RegistrationListSerializer, DepartmentListSerializer

from .serializers.list import FacilitatorListSerializer

from api.utils.validators.csv import validate_students_csv

import csv

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
        if self.action == 'retrieve':
            return FacilitatorDetailSerializer
        elif self.action == 'create':
            return FacilitatorCreateSerializer
        elif self.action == 'list':
            return FacilitatorListSerializer
        
        return FacilitatorListSerializer

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

class RegistrationViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(), IsAdmin()]
    
    def get_queryset(self):
        return Registration.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RegistrationDetailSerializer
        elif self.action == 'create':
            return RegistrationCreateSerializer
        elif self.action == 'list':
            return RegistrationListSerializer
        return RegistrationListSerializer

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
        if self.action == 'retrieve':
            return StudentDetailSerializer
        elif self.action == 'create':
            return StudentCreateSerializer
        elif self.action == 'list':
            return StudentListSerializer
        return StudentListSerializer

# BULK CREATE STUDENTS 

class BulkStudentCSVAPIView(APIView):
    permission_classes = [IsAuthenticated,CanManageModel]
    def post(self, request):
        file = request.FILES.get('file')
        validate_students_csv(file)

        decoded = (file.read().decode('utf-8'))

        reader = csv.DictReader(decoded.splitlines())

        students = []
        error = []
        updated = []

        for index,row in enumerate(reader):
            return

        return