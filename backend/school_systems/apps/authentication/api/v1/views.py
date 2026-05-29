from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from shared.permissions.user_permissions import CanManageModel

from .serializers.auth.reset_password import ResetPasswordSerializer
from .serializers.auth.forgot_password import ForgotPasswordSerializer
from .serializers.auth.login import LoginSerializer
from .serializers.profile.create import SchoolStaffProfileCreateSerializer, StudentProfileCreateSerializer
from .serializers.profile.detail import StudentProfileDetailSerializer, SchoolStaffDetailSerializer
from .serializers.profile.list import StudentProfileListSerializer, SchoolStaffProfileListSerializer

from rest_framework_simplejwt.tokens import RefreshToken

from ...services.email import send_password_reset_email

from apps.authentication.models.school_staff_profile import SchoolStaffProfile
from apps.authentication.models.student_profile import StudentProfile

from apps.authentication.services.school_staff_service import SchoolStaffService
from apps.authentication.services.student_service import StudentService

from django.contrib.auth import get_user_model

User = get_user_model()

class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request):
        if not request.data:
            return Response(
                {'error': 'No email sent'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ForgotPasswordSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
            send_password_reset_email(user)
        except User.DoesNotExist:
            pass

        return Response({'message':'If account exists, email was sent.'}, status=status.HTTP_200_OK)
    
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        role = None

        if hasattr(user, 'school_staff_profile'):
            role = "school_staff"

        elif hasattr(user, 'student_profile'):
            role = "student"

        elif user.is_staff:
            role = "admin"


        return Response(
            {
                'access': str(refresh.access_token), 
                'refresh': str(refresh), 
                'role':role,
             }, 
            status=status.HTTP_200_OK
        )
    
class StudentProfileViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action == 'retrieve':
            return [IsAuthenticated()]
        return [IsAuthenticated(),CanManageModel()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return StudentProfile.objects.all()
        elif hasattr(user, 'school_staff_profile'):
            return StudentProfile.objects.filter(school=user.school_staff_profile.school)
        elif hasattr(user, 'student_profile'):
            return StudentProfile.objects.filter(school=user.student_profile.school, school_student_id=user.student_profile.school_student_id)

        return StudentProfile.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StudentProfileDetailSerializer
        elif self.action == 'create':
            return StudentProfileCreateSerializer
        elif self.action == 'list':
            return StudentProfileListSerializer
        return StudentProfileListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = request.user

        if user.is_staff:
            school_staff_profile = None
        elif hasattr(user, 'school_staff_profile'):
            school_staff_profile = user.school_staff_profile

        student_profile = StudentService.create_student_profile(
            school_staff_profile=school_staff_profile,
            **serializer.validated_data
        )

        return Response({'message':'Student profile created', 'id': student_profile.id}, status=status.HTTP_201_CREATED)

class SchoolStaffProfileViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(),CanManageModel()]
    
    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return SchoolStaffProfile.objects.all()
        elif hasattr(user, 'school_staff_profile'):
            return SchoolStaffProfile.objects.filter(school=user.school_staff_profile.school)

        return SchoolStaffProfile.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SchoolStaffDetailSerializer
        elif self.action == 'create':
            return SchoolStaffProfileCreateSerializer
        elif self.action == 'list':
            return SchoolStaffProfileListSerializer
        return SchoolStaffProfileListSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = request.user

        if user.is_staff:
            school_staff_profile = None
        elif hasattr(user, 'school_staff_profile'):
            school_staff_profile = user.school_staff_profile

        school_staff = SchoolStaffService.create_school_staff_profile(
            school_staff_profile=school_staff_profile,
            **serializer.validated_data
        )

        return Response({'message':'School staff profile created', 'id': school_staff.id}, status=status.HTTP_201_CREATED)