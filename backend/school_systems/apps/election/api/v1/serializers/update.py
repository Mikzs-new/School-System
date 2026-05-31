from rest_framework import serializers
from django.utils import timezone

from apps.election.models import Election

class ElectionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['name','description','status','start_datetime','end_datetime']

class ElectionUpdateTimeSerializer(serializers.Serializer):
    start_datetime = serializers.DateTimeField()
    end_datetime = serializers.DateTimeField()

    def validate(self, attrs):
        if attrs['start_datetime'] >= attrs['end_datetime']:
            raise serializers.ValidationError(
                'End datetime must be after start datetime'
            )

        # Ensure datetimes are timezone-aware using the configured timezone
        if attrs['start_datetime'].tzinfo is None:
            attrs['start_datetime'] = timezone.make_aware(attrs['start_datetime'], timezone.get_current_timezone())
        if attrs['end_datetime'].tzinfo is None:
            attrs['end_datetime'] = timezone.make_aware(attrs['end_datetime'], timezone.get_current_timezone())

        return attrs