from rest_framework import serializers

from apps.election.models.election import Election
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligibleCourse, PartylistElection, ElectionEligiblePosition, ElectionEligibleYearLevel
from apps.election.models.partylist import Partylist

from apps.school.models.course import Course

from shared.utils.helper.school import get_user_school

class ElectionEligiblePositionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligiblePosition
        fields = ['title','seat_count','election']

class ElectionEligibleCourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligibleCourse
        fields = ['course','election']

class ElectionEligibleYearLevelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionEligibleYearLevel
        fields = ['year_level','election']

class CandidateCreateSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Candidate
        fields = ['student_enrollment','election','partylist','position','image']

class PartylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partylist
        fields = ['name']
    
class PartylistElectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartylistElection
        fields = ['description','partylist','election']

class ElectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['name','description','start_datetime','end_datetime']

class VoteItemInputSerialzer(serializers.Serializer):
    candidate = serializers.PrimaryKeyRelatedField(
        queryset=Candidate.objects.none()
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get('request')

        if request:
            school = get_user_school(request.user)

            self.fields['candidate'].queryset = (
                Candidate.objects.filter(
                    election__school_year__school=school
                )
            )

class VoteCreateSerializer(serializers.Serializer):
    election = serializers.PrimaryKeyRelatedField(
        queryset=Election.objects.none()
    )
    vote_items = VoteItemInputSerialzer(many=True)


    def __init__(self, *args,**kwargs):
        user = kwargs['context']['request'].user
        super().__init__(*args, **kwargs)

        self.fields['election'].queryset = (
            Election.objects.filter(
                school_year__school=user.student.school
            )
        )