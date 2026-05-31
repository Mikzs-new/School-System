from rest_framework import serializers

from apps.election.models import Election
from django.utils import timezone

class ElectionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['name','description','status','start_datetime','end_datetime']

class ElectionUpdateTimeSerializer(serializers.Serializer):
    start_datetime = serializers.DateTimeField()
    end_datetime = serializers.DateTimeField()

    def validate(self, attrs):
        # Ensure datetimes are timezone-aware
        if attrs.get('start_datetime') and attrs.get('start_datetime').tzinfo is None:
            attrs['start_datetime'] = timezone.make_aware(attrs['start_datetime'])
        if attrs.get('end_datetime') and attrs.get('end_datetime').tzinfo is None:
            attrs['end_datetime'] = timezone.make_aware(attrs['end_datetime'])
        
        if attrs['start_datetime'] >= attrs['end_datetime']:
            raise serializers.ValidationError(
                'End datetime must be after start datetime'
            )

        return attrs