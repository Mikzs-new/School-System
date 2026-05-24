from django.db import transaction
from rest_framework.serializers import ValidationError

from apps.authentication.models.school_staff_profile import SchoolStaffProfile

from shared.utils.auth.groups import get_facilitator_group

from shared.utils.helper.create_user import create_user

class SchoolStaffService:
    @staticmethod
    @transaction.atomic
    def create_school_staff_profile(*,school_staff_profile,school,first_name,last_name,email,school_staff_id):
        if school_staff_profile:
            school = school_staff_profile.school
        
        if SchoolStaffProfile.objects.filter(school_staff_id=school_staff_id):
            raise ValidationError('Staff profile already exists')

        username = f'{school.initials.lower()}_{school_staff_id}'
        group = get_facilitator_group()

        user = create_user(username=username,email=email,group=group)

        school_staff = SchoolStaffProfile(
            first_name=first_name,
            last_name=last_name,
            school_staff_id=school_staff_id,
            school=school,
            user=user
        )

        school_staff.full_clean()
        school_staff.save()

        return school_staff