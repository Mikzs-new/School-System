from rest_framework.serializers import ValidationError
from django.db import transaction

from apps.election.models.election import Election
from apps.election.models.vote import Vote, VoteItem
from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import ElectionEligiblePosition, ElectionEligibleYearLevel, ElectionEligibleCourse

from apps.election.selectors.vote_selectors import VoteSelector
from apps.student.models.student_enrollment import StudentEnrollment

from collections import defaultdict

class VoteService:
    @staticmethod
    @transaction.atomic
    def cast_vote(*,student_profile,election,vote_items):

        if not election.is_active:
            raise ValidationError('Election is not active')
        
        try:
            student_enrollment = StudentEnrollment.objects.get(student=student_profile,school_year=election.school_year)

        except StudentEnrollment.DoesNotExist:
            raise ValidationError('Student is not enrolled in this school year')
        
        course_allowed = ElectionEligibleCourse.objects.filter(election=election,course=student_enrollment.course).exists()

        year_allowed = ElectionEligibleYearLevel.objects.filter(election=election,year_level=student_enrollment.year_level).exist()

        if not course_allowed or not year_allowed:
            raise ValidationError('Student is not eligble to vote')

        if VoteSelector.student_already_vote(student_enrollment=student_enrollment,election=election):
            raise ValidationError('Student already voted in this election')
        
        candidate_ids = [item['candidate'].id for item in vote_items]

        candidates = Candidate.objects.filter(
            election=election,
            id__in=candidate_ids
        ).select_related('position')

        candidate_map = {
            c.id: c
            for c in candidates
        }

        if len(candidate_map) != len(candidate_ids):
            raise ValidationError('Invalid candidate selection')

        grouped_positions = defaultdict(int)

        for item in vote_items:

            candidate = candidate_map[item['candidate']]

            position_id = candidate.position_id

            grouped_positions[position_id] += 1

            if grouped_positions[position_id] > candidate.position.seat_count:
                raise ValidationError(
                    f"Exceeded seat limit for {candidate.position.title}"
                )

        seen_candidates = set()

        for item in vote_items:

            candidate_id = item['candidate'].id

            if candidate_id in seen_candidates:
                raise ValidationError(
                    'Duplicate candidate selected'
                )

            seen_candidates.add(candidate_id)       

        vote = Vote.objects.create(
            student_enrollment=student_enrollment,
            election=election
        )

        vote_items_objects = []

        for items in vote_items:
            candidate = candidate_map[items['candidate'].id]
            vote_items_objects.append(
                VoteItem(
                    vote=vote,
                    candidate=candidate,
                    position=candidate.position
                )
            )

        VoteItem.objects.bulk_create(vote_items_objects)

        return vote