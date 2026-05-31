from rest_framework import serializers

from apps.election.models.election import Election
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligibleCourse, PartylistElection, ElectionEligiblePosition, ElectionEligibleYearLevel
from apps.election.models.partylist import Partylist
from django.utils import timezone

class ElectionEligiblePositionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligiblePosition
        fields = ['title','seat_count']

class ElectionEligibleCourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligibleCourse
        fields = ['course']

class ElectionEligibleYearLevelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligibleYearLevel
        fields = ['year_level']

class CandidateCreateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Candidate
        fields = ['student_enrollment','partylist','position','image']

class PartylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['name']
    
class PartylistElectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartylistElection
        fields = ['description','partylist']

class ElectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['name','description','start_datetime','end_datetime']
    
    def validate(self, attrs):
        # Ensure datetimes are timezone-aware
        if attrs.get('start_datetime') and attrs.get('start_datetime').tzinfo is None:
            attrs['start_datetime'] = timezone.make_aware(attrs['start_datetime'])
        if attrs.get('end_datetime') and attrs.get('end_datetime').tzinfo is None:
            attrs['end_datetime'] = timezone.make_aware(attrs['end_datetime'])
        return attrs

class VoteItemInputSerialzer(serializers.Serializer):
    candidate = serializers.PrimaryKeyRelatedField(
        queryset=Candidate.objects.all()
    )
    
class VoteCreateSerializer(serializers.Serializer):
    vote_items = VoteItemInputSerialzer(many=True)

