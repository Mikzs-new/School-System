from rest_framework import serializers

from django.contrib.auth import get_user_model

User = get_user_model()

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        email = data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('If the account exists, a reset email was sent.')

        data['user'] = user
        return data
