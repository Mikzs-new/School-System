from rest_framework import serializers

from apps.analytics.models import ElectionAnalyticsSnapshot

class ElectionAnalyticsSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionAnalyticsSnapshot
        fields = '__all__'