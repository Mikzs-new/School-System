from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.analytics.models import ElectionAnalyticsSnapshot

from apps.analytics.api.v1.serializers.election_analytics import ElectionAnalyticsSnapshotSerializer

class ElectionAnalyticsViewSet(viewsets.ModelViewSet):
    queryset = ElectionAnalyticsSnapshot.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        return ElectionAnalyticsSnapshotSerializer