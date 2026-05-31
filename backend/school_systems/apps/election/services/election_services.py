from rest_framework.serializers import ValidationError
from django.db import transaction
from django.db.models import Count

from apps.election.models.election import Election, ElectionStatus
from apps.election.models.eligibility import ElectionEligibleCourse, ElectionEligiblePosition, ElectionEligibleYearLevel, PartylistElection
from apps.election.models.vote import Vote, VoteItem
from apps.election.models.candidate import Candidate

from apps.student.models import StudentEnrollment

from apps.analytics.models import ElectionAnalyticsSnapshot, CandidateAnalyticsSnapshot

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
        
        if not election.is_editable:
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
        
        if not election.is_editable:
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

        if not election.is_editable:
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
    def create_eligible_partylist(*,school_staff_profile,description='',partylist,election):

        if election.school_year.school != partylist.school or school_staff_profile.school != partylist.school  or school_staff_profile.school != election.school_year.school:
            raise ValidationError('Cannot modify another school election')
        
        if not election.is_editable:
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
    def generate_snapshot(school_staff_profile,election):
        # Check if snapshot already exists (idempotency)
        try:
            existing_snapshot = ElectionAnalyticsSnapshot.objects.get(election=election)
            print(f"Snapshot already exists for election {election.id}, returning existing snapshot")
            return existing_snapshot
        except ElectionAnalyticsSnapshot.DoesNotExist:
            print(f"No existing snapshot for election {election.id}, creating new snapshot")
        
        election.status = ElectionStatus.ENDED
        election.save()
        school_year = election.school_year
        eligible_course = ElectionEligibleCourse.objects.filter(election=election).values_list('course',flat=True)
        eligible_year = ElectionEligibleYearLevel.objects.filter(election=election).values_list('year_level',flat=True)

        total_possible_votes = StudentEnrollment.objects.filter(school_year=school_year,course__in=eligible_course,year_level__in=eligible_year).count()
        total_votes = Vote.objects.filter(election=election).count()
        if total_possible_votes > 0:
            turnout_percentage = total_votes / total_possible_votes * 100
        else:
            turnout_percentage = 0
        abstained_students = total_possible_votes - total_votes

        election_snapshot = ElectionAnalyticsSnapshot.objects.create(
            election=election,
            total_possible_votes=total_possible_votes,
            total_votes=total_votes,
            turnout_percentage=turnout_percentage,
            abstained_students=abstained_students
        )

        candidates = Candidate.objects.filter(
            election=election
        ).annotate(
            total_votes=Count('vote_items')
        )

        candidate_analytics_create = []

        positions = ElectionEligiblePosition.objects.filter(election=election)

        for position in positions:

            position_candidates = candidates.filter(
                position=position
            ).order_by('-total_votes')

            total_position_votes = sum(
                c.total_votes
                for c in position_candidates
            )

            ranking = 1

            for candidate in position_candidates:
                if total_position_votes > 0:
                    percentage = candidate.total_votes / total_position_votes * 100
                else:
                    percentage = 0
                candidate_analytics_create.append(
                    CandidateAnalyticsSnapshot(
                        candidate=candidate,
                        total_votes=candidate.total_votes,
                        vote_percentage=percentage,
                        ranking=ranking
                    )
                )
                ranking += 1
            
        CandidateAnalyticsSnapshot.objects.bulk_create(candidate_analytics_create)

        return election_snapshot
    
    @staticmethod
    @transaction.atomic
    def update_time(*, election, start_datetime, end_datetime):
        election.start_datetime = start_datetime
        election.end_datetime = end_datetime

        election.full_clean()
        election.save(
            update_fields=[
                'start_datetime',
                'end_datetime'
            ]
        )

        return election
