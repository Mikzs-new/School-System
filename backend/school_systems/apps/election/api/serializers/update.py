from rest_framework import serializers

from apps.election.models import Election

class ElectionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['name','description','status']