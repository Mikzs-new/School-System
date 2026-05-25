from rest_framework import serializers

from apps.election.models.partylist import Partylist
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligiblePosition, ElectionEligibleCourse, ElectionEligibleYearLevel
from apps.election.models.election import Election
from apps.election.models.vote import Vote

from .nested import VoteItemSerializer, SmallElectionSerializer, ElectionEligibleYearLevelSerializer, ElectionEligibleCourseSerializer, PartylistElectionSerializer, SmallPositionSerializer, SmallPartylistSerializer, PartylistElectionSerializer, SmallElectionPartylistSerializer

from .list import ElectionEligiblePositionListSerializer

from apps.student.api.serializers.nested import SmallStudentSerializer


class ElectionEligiblePositionDetailSerializer(serializers.ModelSerializer):
    election = SmallElectionSerializer(read_only=True)
    class Meta:
        model = ElectionEligiblePosition
        fields = ['title','seat_count','election']

class CandidateDetailSerializer(serializers.ModelSerializer):
    student_enrollment = SmallStudentSerializer(read_only=True)
    election = SmallElectionSerializer(read_only=True)
    position = SmallPositionSerializer(read_only=True)
    partylist = SmallPartylistSerializer(read_only=True)

    class Meta:
        model = Candidate
        fields = ['student_enrollment','election','position','partylist']

class PartylistDetailSerializer(serializers.ModelSerializer):
    elections = PartylistElectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Partylist
        fields = ['name','description','elections']

class ElectionDetailSerializer(serializers.ModelSerializer):
    positions = ElectionEligiblePositionListSerializer(many=True, read_only=True)
    valid_courses = ElectionEligibleCourseSerializer(many=True, read_only=True)
    valid_year_levels = ElectionEligibleYearLevelSerializer(many=True, read_only=True)
    candidates = CandidateDetailSerializer(many=True, read_only=True)
    partylists = SmallElectionPartylistSerializer(many=True, read_only=True)
    
    results = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = ['id', 'name', 'valid_courses', 'valid_year_levels', 'positions','partylists','candidates']

    def get_results(self,value):
        return

class VoteDetailSerializer(serializers.ModelSerializer):
    vote_items = VoteItemSerializer(many=True, read_only=True)
    election = SmallElectionSerializer(read_only=True)
    student_enrollment = SmallStudentSerializer(read_only=True)
    class Meta:
        model = Vote
        fields = ['id','student_enrollment','election','vote_items','vote_time']


    
