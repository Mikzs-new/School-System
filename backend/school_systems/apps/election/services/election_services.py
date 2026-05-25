from rest_framework.serializers import ValidationError
from django.db import transaction

from apps.election.models.election import Election
from apps.election.models.eligibility import ElectionEligibleCourse, ElectionEligiblePosition, ElectionEligibleYearLevel, PartylistElection
from apps.election.models.vote import Vote, VoteItem

from apps.analytics.models import ElectionAnalyticsSnapshot

from shared.utils.helper.school import get_current_school_year

class ElectionService:
    @staticmethod
    @transaction.atomic
    def create_election(*,school_staff_profile,validated_data):
        school_year = get_current_school_year(school=school_staff_profile.school)

        if not school_year or not school_year.is_current_school_year:
            raise ValidationError('School year must be configured')

        election = Election(
            name=validated_data['name'],
            description=validated_data['description'],
            school_year=school_year,
            start_datetime=validated_data['start_datetime'],
            end_datetime=validated_data['end_datetime']
        )

        election.full_clean()
        election.save()

        return election
    
    @staticmethod
    @transaction.atomic
    def create_eligible_year_level(*,school_staff_profile,election,year_level):
        
        if school_staff_profile.school != election.school_year.school:
            raise ValidationError('Cannot modify another school election')
        
        if not election.is_editable():
            raise ValidationError('Cannot make changes in election')
        
        eligible_year_level = ElectionEligibleYearLevel(
            year_level=year_level,
            election=election
        )

        eligible_year_level.full_clean()
        eligible_year_level.save()

        return eligible_year_level

    @staticmethod
    @transaction.atomic
    def create_eligible_course(*,school_staff_profile,election,course):
        
        if school_staff_profile.school != election.school_year.school:
            raise ValidationError('Cannot modify another school election')
        
        if not election.is_editable():
            raise ValidationError('Cannot make changes in election')
        
        eligible_course = ElectionEligibleCourse(
            course=course,
            election=election
        )

        eligible_course.full_clean()
        eligible_course.save()

        return eligible_course

    @staticmethod
    @transaction.atomic
    def create_position(*,school_staff_profile,title,seat_count,election):
        
        if school_staff_profile.school != election.school_year.school:
            raise ValidationError('Cannot modify another school election')

        if not election.is_editable():
            raise ValidationError('Cannot make changes in election')
        
        title=title.strip().lower()

        position = ElectionEligiblePosition(
            title=title,
            seat_count=seat_count,
            election=election
        )
        position.full_clean()
        position.save()

        return position

    @staticmethod
    @transaction.atomic
    def create_eligible_partylist(*,school_staff_profile,description,partylist,election):

        if election.school_year.school != partylist.school or school_staff_profile != partylist.school  or school_staff_profile.school != election.school_year.school:
            raise ValidationError('Cannot modify another school election')
        

        if not election.is_editable():
            raise ValidationError('Cannot make changes in election')
        
        eligible_partylist = PartylistElection(
            description=description,
            partylist=partylist,
            election=election
        )

        eligible_partylist.full_clean()
        eligible_partylist.save()

        return eligible_partylist
        
    @staticmethod
    @transaction.atomic
    def generate_snapshot(election):
        total_possible_votes = ...
        total_votes = ...
        turnout_percentage = ...
        abstained_students = ...

        ElectionAnalyticsSnapshot.objects.update_or_create(
            election=election,
            defaults={
                "total_possible_votes":total_possible_votes,
                "total_votes": total_votes,
                "turnout_percentage": turnout_percentage,
                "abstained_students": abstained_students,
            }
        )