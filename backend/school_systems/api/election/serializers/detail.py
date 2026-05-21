from rest_framework import serializers

from election.models import Election, Position, Candidate, Partylist, Vote

from .custom import VoteItemSerializer, SmallElectionSerializer, YearLevelValidItemSerializer, CourseValidItemSerializer, ElectionPartylistSerializer, StudentInfoSerializer, SmallPositionSerializer, SmallPartylistSerializer, PartylistElectionSerializer

class PositionDetailSerializer(serializers.ModelSerializer):
    election = SmallElectionSerializer(read_only=True)
    class Meta:
        model = Position
        fields = ['title','seat_count','election']

class CandidateDetailSerializer(serializers.ModelSerializer):
    student_info = StudentInfoSerializer(read_only=True)
    election = SmallElectionSerializer(read_only=True)
    position = SmallPositionSerializer(read_only=True)
    partylist = SmallPartylistSerializer(read_only=True)

    class Meta:
        model = Candidate
        fields = ['student_info','election','position','partylist']

class PartylistDetailSerializer(serializers.ModelSerializer):
    elections = PartylistElectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Partylist
        fields = ['name','description','candidates','elections','added_by']

class ElectionDetailSerializer(serializers.ModelSerializer):
    positions = PositionDetailSerializer(many=True, read_only=True)
    valid_courses = CourseValidItemSerializer(many=True, read_only=True)
    valid_year_levels = YearLevelValidItemSerializer(many=True, read_only=True)
    candidates = CandidateDetailSerializer(many=True, read_only=True)
    partylists = ElectionPartylistSerializer(many=True, read_only=True)

    class Meta:
        model = Election
        fields = ['id', 'name', 'valid_courses', 'valid_year_levels', 'positions','partylists','candidates']

class VoteDetailSerializer(serializers.ModelSerializer):
    vote_items = VoteItemSerializer(many=True, read_only=True)
    election = SmallElectionSerializer(read_only=True)
    student_info = StudentInfoSerializer(read_only=True)
    class Meta:
        model = Vote
        fields = ['id','student_info','election','vote_items','vote_time']


    
