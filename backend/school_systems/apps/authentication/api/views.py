from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from shared.permissions.user_permissions import CanManageModel

from .serializers.auth.reset_password import ResetPasswordSerializer
from .serializers.auth.forgot_password import ForgotPasswordSerializer
from .serializers.auth.login import LoginSerializer
from .serializers.profile.create import SchoolStaffProfileCreateSerializer
from .serializers.profile.detail import StudentProfileDetailSerializer, SchoolStaffDetailSerializer
from .serializers.profile.list import StudentProfileListSerializer, SchoolStaffProfileListSerializer

from rest_framework_simplejwt.tokens import RefreshToken

from ..services.email import send_password_reset_email

from django.contrib.auth import get_user_model

User = get_user_model()

class ResetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    
class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ForgotPasswordSerializer(request.data)

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
            send_password_reset_email(user)
        except User.DoesNotExist:
            pass

        return request({'message':'If account exists, email was sent.'}, status=status.HTTP_200_OK)
    
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
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
        return super().get_queryset()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StudentProfileDetailSerializer
        elif self.action == 'list':
            return StudentProfileListSerializer
        return StudentProfileListSerializer
    
    def perform_create(self, serializer):
        return super().perform_create(serializer)

class SchoolStaffProfileViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [IsAuthenticated(),CanManageModel()]
    
    def get_queryset(self):
        return super().get_queryset()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SchoolStaffDetailSerializer
        elif self.action == 'create':
            return SchoolStaffProfileCreateSerializer
        elif self.action == 'list':
            return SchoolStaffProfileListSerializer
        return SchoolStaffProfileListSerializer
    
    def perform_create(self, serializer):
        return super().perform_create(serializer)