from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from shared.permissions.user_permissions import CanManageModel, CanManageImport

from apps.student.models.student_enrollment import StudentEnrollment
from apps.authentication.models.student_profile import StudentProfile

from .serializers.create import StudentCreateSerializer, StudentEnrollmentCreateSerializer
from .serializers.detail import StudentDetailSerializer
from .serializers.list import StudentListSerializer

from ..selectors.student_enrollment_selector import StudentEnrollmentSelector
from ..services.student_enrollment_service import StudentEnrollmentService
from ..services.imports.student_import_service import StudentImportService
from ..services.student_service import StudentService

from shared.utils.helper.school import get_user_school

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
            .prefetch_related('enrollments')
        )

        if user.is_staff:
            return queryset

        elif hasattr(user, 'school_staff_profile'):

            return queryset.filter(
                school=user.school_staff_profile.school
            )

        elif hasattr(user, 'student_profile'):

            return queryset.filter(
                id=user.student_profile.id
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
            school_staff_profile=request.user.school_school_staff_profile,
            validated_data=serializer.validated_data
        )

        return Response(
            {'id': student.id},
            status=status.HTTP_201_CREATED
        )
    
class StudentEnrollmentViewset(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = [IsAuthenticated, CanManageModel]

    serializer_class = StudentEnrollmentCreateSerializer

    def get_queryset(self):
        return super().get_queryset()
    
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
    
    def create(self, request):
        result = StudentImportService.import_students_csv(file=request.FILES['file'],school_staff_profile=request.user.school_staff_profile)
        return Response(result,status=status.HTTP_200_OK)