from rest_framework.serializers import ValidationError
from django.db import transaction

from apps.election.models.partylist import Partylist

class PartylistService:
    @staticmethod
    @transaction.atomic
    def create_partylist(*,school_staff_profile,name):
        school = school_staff_profile.school

        if not school:
            raise ValidationError('School does not exist')
        
        partylist = Partylist(
            name=name,
            school=school
        )
        partylist.full_clean()
        partylist.save()

        return partylist
