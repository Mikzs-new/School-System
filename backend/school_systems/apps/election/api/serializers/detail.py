from rest_framework import serializers
from rest_framework.decorators import action

from apps.election.models.partylist import Partylist
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligiblePosition
from apps.election.models.election import Election
from apps.election.models.vote import Vote

from apps.analytics.models import ElectionAnalyticsSnapshot, CandidateAnalyticsSnapshot

from .nested import VoteItemSerializer, SmallElectionSerializer, ElectionEligibleYearLevelSerializer, ElectionEligibleCourseSerializer, PartylistElectionSerializer, SmallPositionSerializer, SmallPartylistSerializer, PartylistElectionSerializer, SmallElectionPartylistSerializer, SmallPartylistElectionSerializer

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
    partylist = SmallPartylistElectionSerializer(read_only=True)

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

    class Meta:
        model = Election
        fields = ['id', 'name', 'valid_courses', 'valid_year_levels', 'positions','partylists','candidates']

class ElectionResultSerialzer(serializers.ModelSerializer):
    candidate_results = serializers.SerializerMethodField()

    class Meta:
        model = ElectionAnalyticsSnapshot
        fields = ['total_possible_votes','total_votes','turnout_percentage','abstained_students','generated_at','candidate_results']

    def get_candidate_results(self, obj):
        election = obj.election

        positions = ElectionEligiblePosition.objects.filter(
            election=election
        )

        results = []

        for position in positions:

            candidates = CandidateAnalyticsSnapshot.objects.filter(
                candidate__election=election,
                candidate__position=position
            ).order_by('-total_votes')

            total_position_votes = sum(
                c.total_votes
                for c in candidates
            )

            abstained = (
                obj.total_possible_votes
                - total_position_votes
            )

            results.append({
                'position': position.name,

                'abstained_votes': abstained,

                'candidates': [
                    {
                        'candidate_id': item.candidate.id,

                        'candidate_name': str(
                            item.candidate.student_enrollment
                        ),

                        'total_votes': item.total_votes,

                        'vote_percentage': item.vote_percentage,

                        'ranking': item.ranking,
                    }
                    for item in candidates
                ]
            })
        
        return results

class VoteDetailSerializer(serializers.ModelSerializer):
    vote_items = VoteItemSerializer(many=True, read_only=True)
    election = SmallElectionSerializer(read_only=True)
    student_enrollment = SmallStudentSerializer(read_only=True)
    class Meta:
        model = Vote
        fields = ['id','student_enrollment','election','vote_items','vote_time']


    
