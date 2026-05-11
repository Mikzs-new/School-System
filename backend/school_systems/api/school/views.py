from rest_framework import viewsets, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from ..permissions.permissions import IsAdmin, CanManageModel

from school.models import Registration, School, Facilitator, Student, Course, Department

from .serializers.create import FacilitatorCreateSerializer, SchoolCreateSerializer, StudentCreateSerializer, CourseCreateSerializer, RegistrationCreateSerializer, DepartmentCreateSerializer
from .serializers.detail import FacilitatorDetailSerializer, SchoolDetailSerializer, StudentDetailSerializer, CourseDetailSerializer, RegistrationDetailSerializer, DepartmentDetailSerializer
from .serializers.list import FacilitatorListSerializer, SchoolListSerializer, StudentListSerializer, CourseListSerializer, RegistrationListSerializer, DepartmentListSerializer
from .serializers.update import StudentUpdateSerializer, FacilitatorUpdateSerializer

from django.contrib.auth.models import User, Group
from django.utils.crypto import get_random_string
from django.db import transaction

from api.utils.validators.csv import validate_students_csv

import csv

def create_user(username,email,school,group):
    password = get_random_string(12)

    if User.objects.filter(username=username).exists():
        raise serializers.ValidationError('Username already existed')

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    user.groups.add(group)

    return user

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

            user = create_user(username,email,school,group)

            validated['user'] = user
            validated['school'] = school
            
            serializer.save(
                user=user,
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
            
            user = create_user(username,email,school,group)

            validated['user'] = user
            validated['school'] = school
            
            serializer.save(
                user=user,
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
        with transaction.atomic():
            file = request.FILES.get('file')
            validate_students_csv(file)

            decoded = file.read().decode('utf-8')

            reader = csv.DictReader(decoded.splitlines())

            create_students = []
            error = []
            update_students = []
            update_users = []
            seen_student_ids = set()

            facilitator = self.request.user.facilitator
            school = facilitator.school

            existing_students = {(s.school_student_id, s.school): s for s in Student.objects.filter(school=school)}

            group = Group.objects.get(name='Student')

            for index,row in enumerate(reader):

                row_number = index + 2
                
                sid = row.get('school_student_id')

                if sid in seen_student_ids:
                    error.append({'row': row_number, 'error': 'Duplicated Student'})
                    continue

                seen_student_ids.add(sid)

                serializer = (StudentCreateSerializer(data=row))

                if not serializer.is_valid():
                    error.append({'row': row_number, 'error': serializer.errors})
                    continue

                validated = (serializer.validated_data)

                existing_student = existing_students.get((validated['school_student_id'], school))
                
                if not existing_student:
                    username = f"{school.initials.lower()}_{validated['school_student_id']}"
                    email = validated['email']

                    try:
                        user = create_user(username,email,school,group)
                    
                    except serializers.ValidationError as e:
                        error.append({'row': row_number, 'error': str(e)}) 
                        continue

                    validated['user'] = user
                    validated['school'] = school
                    validated['added_by'] = facilitator
                    create_students.append(Student(**validated))
                else: 
                    changed = False
                    for field,value in validated.items():
                        current = getattr(existing_student, field)

                        if current != value:
                            setattr(existing_student, field, value)
                            if field == 'email' and existing_student.user.email != value:
                                existing_student.user.email = value
                                update_users.append(existing_student.user)
                            changed = True

                    if changed:
                        update_students.append(existing_student)
                    

            Student.objects.bulk_create(create_students)
            
            Student.objects.bulk_update(
                update_students,
                ['school_student_id','first_name','last_name','course','year_level','email']
            )
            User.objects.bulk_update(
                update_users,
                ['email']
            )

            context = {
                'Errors': error,
                'Updated': len(update_students),
                'Created': len(create_students)
            }

            return  Response(context,status=200)