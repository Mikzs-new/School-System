from rest_framework import serializers

from apps.election.models.partylist import Partylist
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligiblePosition, ElectionEligibleCourse, ElectionEligibleYearLevel, PartylistElection
from apps.election.models.election import Election
from apps.election.models.vote import Vote

from .nested import SmallElectionSerializer, SmallPositionSerializer, SmallCourseSerializer, SmallPartylistSerializer

from apps.student.api.v1.serializers.nested import SmallStudentSerializer

class ElectionEligiblePositionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligiblePosition
        fields = ['id','title','seat_count']

class ElectionEligibleCourseListSerializer(serializers.ModelSerializer):
    course = SmallCourseSerializer(read_only=True)
    class Meta:
        model = ElectionEligibleCourse
        fields = ['id','course']

class ElectionEligibleYearLevelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligibleYearLevel
        fields = ['id','year_level']

class CandidateListSerializer(serializers.ModelSerializer):
    student_enrollment = SmallStudentSerializer(read_only=True)
    position = SmallPositionSerializer(read_only=True)
    class Meta:
        model = Candidate
        fields = ['id','student_enrollment','position','partylist']

class PartylistListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['id','name']

class PartylistElectionListSerializer(serializers.ModelSerializer):
    partylist = SmallPartylistSerializer(read_only=True)
    class Meta:
        model = PartylistElection
        fields = ['id','partylist']

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


    
