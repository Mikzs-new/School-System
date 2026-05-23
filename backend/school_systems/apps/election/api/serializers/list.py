from rest_framework import serializers

from apps.election.models.partylist import Partylist
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligiblePosition
from apps.election.models.election import Election
from apps.election.models.vote import Vote

from .nested import SmallElectionSerializer, SmallPositionSerializer

from apps.student.api.serializers.nested import SmallStudentSerializer

class ElectionEligiblePositionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligiblePosition
        fields = ['id','title','seat_count']

class CandidateListSerializer(serializers.ModelSerializer):
    student_enrollment = SmallStudentSerializer(read_only=True)
    election = SmallElectionSerializer(read_only=True)
    position = SmallPositionSerializer(read_only=True)
    class Meta:
        model = Candidate
        fields = ['id','student_enrollment','election','position','partylist']

class PartylistListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['id','name','added_by']

class ElectionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['id', 'name','status','start_datetime','end_datetime']

class VoteListSerializer(serializers.ModelSerializer):
    student_enrollment = SmallStudentSerializer(read_only=True)
    election = SmallElectionSerializer(read_only=True)
    class Meta:
        model = Vote
        fields = ['id','student_enrollment','election']


    
