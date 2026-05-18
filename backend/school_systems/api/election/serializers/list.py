from rest_framework import serializers

from election.models import Election, Position, CourseValidItem, YearLevelValidItem, Candidate, Partylist, Vote

from .detail import CandidateDetailSerializer

class PositionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id','title','seat_count']

class CandidateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ['id','student','election','position','partylist']

class PartylistListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['id','name','added_by']

class ElectionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['id', 'name','available','start_datetime','duration']

class VoteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id','student','year_level','election']


    
