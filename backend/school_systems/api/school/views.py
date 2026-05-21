from rest_framework import viewsets, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from ..permissions.permissions import IsAdmin, CanManageModel

from school.models import Registration, School, Facilitator, Student, Course, Department, SchoolYear, SchoolYearStudentInfo

from .serializers.create import FacilitatorCreateSerializer, SchoolCreateSerializer, StudentCreateSerializer, CourseCreateSerializer, RegistrationCreateSerializer, DepartmentCreateSerializer, StudentInfoCreateSerializer
from .serializers.detail import FacilitatorDetailSerializer, SchoolDetailSerializer, StudentDetailSerializer, CourseDetailSerializer, RegistrationDetailSerializer, DepartmentDetailSerializer
from .serializers.list import FacilitatorListSerializer, SchoolListSerializer, StudentListSerializer, CourseListSerializer, RegistrationListSerializer, DepartmentListSerializer
from .serializers.update import StudentUpdateSerializer, FacilitatorUpdateSerializer

from .services.student_import_service import import_students_csv

from api.utils.validators.create import create_user

from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

from django.db import transaction

User = get_user_model()



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
        elif self.action in ['update','partial_update']:
            return FacilitatorUpdateSerializer
        elif self.action == 'list':
            return FacilitatorListSerializer
        
        return FacilitatorListSerializer
    
    def perform_authentication(self, request):
        return super().perform_authentication(request)
    
    def perform_create(self, serializer):
        with transaction.atomic():
            validated = serializer.validated_data

            user = self.request.user

            if user.is_staff:
                school = serializer.validated_data['school']

            elif hasattr(user, 'facilitator'):
                school = user.facilitator.school
            else:
                raise serializers.ValidationError('No Permission')
            
            group = Group.objects.get(name='Facilitator')

            username = f"{school.initials.lower()}_{validated['school_staff_id']}"
            email = validated['email']

            user_created = create_user(username,email,school,group)

            serializer.save(
                user=user_created,
                school=school
            )

    def perform_update(self, serializer):
        with transaction.atomic():
            facilitator = self.get_object()
            validated = serializer.validated_data

            if 'email' in validated:
                facilitator.user.email = validated['email']
                facilitator.user.save()

            serializer.save()

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
        elif self.action in ['update','partial_update']:
            return StudentUpdateSerializer
        elif self.action == 'list':
            return StudentListSerializer
        return StudentListSerializer
    
    def perform_create(self, serializer):
        with transaction.atomic():
            validated = serializer.validated_data
            
            user = self.request.user

            if user.is_staff:
                school = serializer.validated_data['school']

            elif hasattr(user, 'facilitator'):
                school = user.facilitator.school

            else:
                raise serializers.ValidationError('No Permission')
            
            group = Group.objects.get(name='Student')

            username = f"{school.initials.lower()}_{validated['school_student_id']}"
            email = validated['email']
            
            user_created = create_user(username,email,school,group)
            
            serializer.save(
                user=user_created,
                school=school
            )
    
    def perform_update(self, serializer):
        with transaction.atomic():
            student = self.get_object()
            validated = serializer.validated_data

            if 'email' in validated:
                student.user.email = validated['email']
                student.user.save()

            serializer.save()

# BULK CREATE STUDENTS 

class BulkStudentCSVView(APIView):
    permission_classes = [IsAuthenticated,CanManageModel]
    
    def post(self, request):
        result = import_students_csv(file=request.FILES['file'],facilitator=request.user.facilitator, group=Group.objects.get(name='Student'))

        return Response(result,status=status.HTTP_200_OK)