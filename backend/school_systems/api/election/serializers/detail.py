from rest_framework import serializers

from election.models import Election, Position, Candidate, Partylist, Vote

from .custom import VoteItemSerializer, SmallElectionSerializer, SmallCourseSerializer, YearLevelValidItemSerializer, CourseValidItemSerializer

class PositionDetailSerializer(serializers.ModelSerializer):
    election = SmallElectionSerializer(read_only=True)
    class Meta:
        model = Position
        fields = ['title','seat_count','election']

class CandidateDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ['student','course','year_level','position']

class PartylistDetailSerializer(serializers.ModelSerializer):
    candidates = CandidateDetailSerializer(many=True, read_only=True)
    election = SmallElectionSerializer(read_only=True)
    
    class Meta:
        model = Partylist
        fields = ['name','description','candidates','election']

class ElectionDetailSerializer(serializers.ModelSerializer):
    positions = PositionDetailSerializer(many=True, read_only=True)
    valid_courses = CourseValidItemSerializer(many=True, read_only=True)
    valid_year_levels = YearLevelValidItemSerializer(many=True, read_only=True)
    candidates = CandidateDetailSerializer(many=True, read_only=True)
    partylists = PartylistDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Election
        fields = ['id', 'name', 'valid_courses', 'valid_year_levels', 'positions','partylists','candidates']

class VoteDetailSerializer(serializers.ModelSerializer):
    vote_items = VoteItemSerializer(many=True, read_only=True)
    election = SmallElectionSerializer(read_only=True)
    course = SmallCourseSerializer(read_only=True)

    class Meta:
        model = Vote
        fields = ['id','student','course','year_level','election','vote_items']


    
