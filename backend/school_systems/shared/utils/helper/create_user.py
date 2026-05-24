from rest_framework import serializers

from django.db import transaction

from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string

User = get_user_model()

@transaction.atomic
def create_user(username,email,group):
    password = get_random_string(12)

    if User.objects.filter(username=username).exists():
        raise serializers.ValidationError('Username already existed')
    
    if User.objects.filter(email=email).exists():
        raise serializers.ValidationError('Email already used')

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    user.groups.add(group)

    return user