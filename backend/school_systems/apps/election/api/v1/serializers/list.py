from rest_framework import serializers

from apps.election.models.partylist import Partylist
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligiblePosition, ElectionEligibleCourse, ElectionEligibleYearLevel, PartylistElection
from apps.election.models.election import Election
from apps.election.models.vote import Vote

from apps.student.models import StudentEnrollment

from .nested import SmallElectionSerializer, SmallPositionSerializer, SmallCourseSerializer, SmallPartylistSerializer, SmallCandidateSerializer

from apps.student.api.v1.serializers.nested import SmallStudentSerializer

class ElectionEligiblePositionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligiblePosition
        fields = ['id','title','seat_count']

class ElectionEligibleCourseListSerializer(serializers.ModelSerializer):
    course = serializers.CharField(
        source='course.name',
        read_only=True
    )
    initials = serializers.CharField(
        source='course.initials',
        read_only=True
    )
    class Meta:
        model = ElectionEligibleCourse
        fields = ['id','course','initials']

class ElectionEligibleYearLevelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligibleYearLevel
        fields = ['id','year_level']

class CandidateListSerializer(serializers.ModelSerializer):
    position = serializers.CharField(
        source='position.title',
        read_only=True,
    )
    full_name = serializers.CharField(
        source='student_enrollment.student.full_name',
        read_only=True,
    )
    course = serializers.CharField(
        source='student_enrollment.course.name',
        read_only=True,
    )
    year_level = serializers.CharField(
        source='student_enrollment.year_level',
        read_only=True,
    )
    partylist = serializers.SerializerMethodField()
    class Meta:
        model = Candidate
        fields = ['id','full_name','course','year_level','position','partylist']

    def get_partylist(self,obj):
        if obj.partylist:
            return obj.partylist.partylist.initials
        return None

class PartylistListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['id','name']

class PartylistElectionListSerializer(serializers.ModelSerializer):
    partylist = serializers.CharField(
        source='partylist.name',
        read_only=True
    )
    initials = serializers.CharField(
        source='partylist.initials',
        read_only=True
    )
    class Meta:
        model = PartylistElection
        fields = ['id','partylist','initials']

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


class EligibleStudentsListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        source='student.full_name',
        read_only=True
    )
    course = serializers.CharField(
        source='course.name',
        read_only=True
    )
    class Meta:
        model = StudentEnrollment
        fields = ['id','full_name','course','year_level']

class VotingCandidatesListSerializer(serializers.ModelSerializer):
    candidates = SmallCandidateSerializer(many=True,read_only=True)
    class Meta:
        model = ElectionEligiblePosition
        fields = ['id','title','seat_count','candidates']