from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers.reset_password import ResetPasswordSerializer
from .serializers.forgot_password import ForgotPasswordSerializer
from .serializers.login import LoginSerializer

from rest_framework_simplejwt.tokens import RefreshToken

from .services.email import send_password_reset_email

from django.contrib.auth import get_user_model

User = get_user_model()

class ResetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    
class ForgotPasswordAPIView(APIView):
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
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        return request({'access': str(refresh.access_token), 'refresh': str(refresh)}, status=status.HTTP_200_OK)