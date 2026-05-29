from rest_framework import serializers

from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data['uid']))
            user = User.objects.get(pk=uid)
        except:
            raise serializers.ValidationError('Invalid User')
        
        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError('Invalid or expired token')
        
        validate_password(data['password'])

        data['user'] = user

        return data
    
    def save(self):
        password = self.validated_data['password']
        user = self.validated_data['user']

        user.set_password(password)
        user.save()