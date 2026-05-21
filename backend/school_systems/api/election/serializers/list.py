from rest_framework import serializers

from election.models import Election, Position, Candidate, Partylist, Vote

from .custom import StudentInfoNameSerializer, SmallElectionSerializer, SmallPositionSerializer

class PositionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id','title','seat_count']

class CandidateListSerializer(serializers.ModelSerializer):
    student_info = StudentInfoNameSerializer(read_only=True)
    election = SmallElectionSerializer(read_only=True)
    position = SmallPositionSerializer(read_only=True)
    class Meta:
        model = Candidate
        fields = ['id','student_info','election','position','partylist']

class PartylistListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['id','name','added_by']

class ElectionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['id', 'name','status','start_datetime','end_datetime']

class VoteListSerializer(serializers.ModelSerializer):
    student_info = StudentInfoNameSerializer(read_only=True)
    class Meta:
        model = Vote
        fields = ['id','student_info','election']


    
