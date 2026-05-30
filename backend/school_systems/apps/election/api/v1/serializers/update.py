from rest_framework import serializers

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

        return attrs