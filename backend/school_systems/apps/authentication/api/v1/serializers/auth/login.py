from rest_framework import serializers

from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data['username']
        password = data['password']

        user = authenticate(
            username=username,
            password=password
        )

        if not user:
            raise serializers.ValidationError('Invalid credentials')
        elif not user.is_active:
            raise serializers.ValidationError('Account disabled')
        
        data['user'] = user

        return data