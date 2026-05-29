from rest_framework import serializers

from apps.election.models.election import Election
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligibleCourse, PartylistElection, ElectionEligiblePosition, ElectionEligibleYearLevel
from apps.election.models.partylist import Partylist

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

class VoteItemInputSerialzer(serializers.Serializer):
    candidate = serializers.PrimaryKeyRelatedField(
        queryset=Candidate.objects.all()
    )
    
class VoteCreateSerializer(serializers.Serializer):
    vote_items = VoteItemInputSerialzer(many=True)

