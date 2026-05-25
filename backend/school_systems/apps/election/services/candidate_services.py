from rest_framework.serializers import ValidationError
from django.db import transaction

from apps.election.models.candidate import Candidate
from apps.election.models.eligibility import PartylistElection

from shared.utils.helper.school import get_current_school_year
from shared.utils.validators.image import validate_image

class CandidateService:

    @staticmethod
    @transaction.atomic
    def create_candidate(*,school_staff_profile,election,student_enrollment,position,partylist,image):
        school_year = get_current_school_year(school=school_staff_profile.school)

        if not school_year or not school_year.is_current_school_year:
            raise ValidationError('School year must be configured')

        if not election.is_editable:
            raise ValidationError('Cannot make changes in election')

        if Candidate.objects.filter(election=election,student_enrollment=student_enrollment).exists():
            raise ValidationError('Student is already a candidate')

        if partylist and not PartylistElection.objects.filter(election=election,partylist=partylist).exists():
            raise ValidationError('Partylist is not eligible for election')

        validate_image(image)

        candidate = Candidate(
            student_enrollment=student_enrollment,
            election=election,
            position=position,
            partylist=partylist,
            image=image,
        )

        candidate.full_clean()
        candidate.save()

        return candidate
