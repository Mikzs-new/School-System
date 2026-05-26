from rest_framework import serializers

from apps.election.models.partylist import Partylist
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligiblePosition, ElectionEligibleCourse, ElectionEligibleYearLevel, PartylistElection
from apps.election.models.election import Election
from apps.election.models.vote import VoteItem

from apps.authentication.api.serializers.profile.nested import SmallStudentSerializer
from apps.school.api.serializers.nested import SmallCourseSerializer

class SmallPartylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['name']

class SmallPartylistElectionSerializer(serializers.ModelSerializer):
    partylist = SmallPartylistSerializer(read_only=True)
    class Meta:
        model = PartylistElection
        fields = ['partylist']

class SmallPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligiblePosition
        fields = ['title']

class SmallElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['name']

class SmallCandidateSerializer(serializers.ModelSerializer):
    student = serializers.CharField(
        source='student_enrollment.student.full_name',
        read_only=True
    )

    position = serializers.CharField(
        source='position.title',
        read_only=True
    )

    class Meta:
        model = Candidate
        fields = ['id','student','position']

class VoteItemSerializer(serializers.ModelSerializer):
    candidate = SmallCandidateSerializer(read_only=True)
    position = SmallPositionSerializer(read_only=True)

    class Meta:
        model = VoteItem
        fields = ['id','candidate','position']

class ElectionEligibleCourseSerializer(serializers.ModelSerializer):
    course = SmallCourseSerializer(read_only=True)

    class Meta:
        model = ElectionEligibleCourse
        fields = ['id','course']

class ElectionEligibleYearLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligibleYearLevel
        fields = ['id','year_level']

class SmallElectionPartylistSerializer(serializers.ModelSerializer):
    partylist = serializers.SerializerMethodField()

    class Meta:
        model = PartylistElection
        fields = ['partylist', 'description']

    def get_partylist(self, obj):
        return SmallPartylistSerializer(obj.partylist).data

class PartylistElectionSerializer(serializers.ModelSerializer):
    election = SmallPartylistSerializer(read_only=True)
    
    school_year = serializers.CharField(
        source='election.school_year.name',
        read_only=True
    )

    candidates = SmallCandidateSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = PartylistElection
        fields = ['election','shool_year','candidates']


