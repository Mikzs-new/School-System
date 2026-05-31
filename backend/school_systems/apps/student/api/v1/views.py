from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from shared.permissions.user_permissions import CanManageModel, CanManageImport

from apps.student.models.student_enrollment import StudentEnrollment
from apps.authentication.models.student_profile import StudentProfile

from .serializers.create import StudentCreateSerializer, StudentEnrollmentCreateSerializer
from .serializers.detail import StudentDetailSerializer
from .serializers.list import StudentListSerializer, StudentEnrollmentListSerializer

from apps.student.selectors.student_enrollment_selector import StudentEnrollmentSelector
from apps.student.services.student_enrollment_service import StudentEnrollmentService
from apps.student.services.imports.student_import_service import StudentImportService
from apps.student.services.student_service import StudentService

from django.contrib.auth.models import Group
from django.core.exceptions import PermissionDenied

class StudentViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action == 'retrieve':
            return [IsAuthenticated()]

        return [IsAuthenticated(),CanManageModel()]

    def get_queryset(self):
        user = self.request.user

        queryset = (
        StudentProfile.objects
            .select_related('school', 'user')
            .prefetch_related('school_years')
        )

        if user.is_staff:
            return queryset

        elif hasattr(user, 'school_staff_profile'):

            return queryset.filter(
                school=user.school_staff_profile.school
            )

        elif hasattr(user, 'student_profile'):

            return queryset.filter(
                school=user.student_profile.school,
                school_student_id=user.student_profile.school_student_id
            )

        return StudentProfile.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StudentDetailSerializer
        elif self.action == 'create':
            return StudentCreateSerializer
        elif self.action == 'list':
            return StudentListSerializer
        
        return StudentListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            school=request.user.school_staff_profile.school
        )

        serializer.is_valid(raise_exception=True)

        student = StudentService.create_student(
            school_staff_profile=request.user.school_staff_profile,
            validated_data=serializer.validated_data
        )

        return Response(
            {'id': student.id},
            status=status.HTTP_201_CREATED
        )
    
class StudentEnrollmentViewset(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, CanManageModel]

    def get_queryset(self):
        user = self.request.user
        qs = StudentEnrollment.objects.all()
        if user.is_staff:
            return qs
        elif hasattr(user, 'school_staff_profile'):
            qs.filter(
                school_year__school=user.school_staff_profile.school
            )
        elif hasattr(user, 'student_profile'):
            qs.filter(
                school_year__school=user.school_staff_profile.school,
                student=user.school_staff_profile
            )
        else:
            return qs.none()
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentEnrollmentCreateSerializer
        if self.action == 'list':
            return StudentEnrollmentListSerializer
        return StudentEnrollmentListSerializer

    def create(self,request):
        serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)

        school = StudentEnrollmentSelector.get_accessible_school(request.user,serializer.validated_data['school'])

        StudentEnrollmentService.enroll_student(
            school_staff=request.user.school_staff_profile,
            school=school,
            **serializer.validated_data
        )

        return Response({'message':'Student enrolled successfuly'}, status=status.HTTP_201_CREATED)

class BulkStudentCSVViewset(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = [IsAuthenticated,CanManageImport]
    parser_classes = [
        MultiPartParser,
        FormParser,
    ]
    def create(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'detail': 'CSV file is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        result = StudentImportService.import_students_csv(file=file, school_staff_profile=request.user.school_staff_profile)
        return Response(result, status=status.HTTP_200_OK)
