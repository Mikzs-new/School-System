from django.db import transaction
from rest_framework.serializers import ValidationError

from apps.authentication.models.student_profile import StudentProfile

from shared.utils.auth.groups import get_student_group

from shared.utils.helper.create_user import create_user

class StudentService:
    @staticmethod
    @transaction.atomic
    def create_student_profile(*,
                               school_staff_profile,
                               school,
                               first_name,
                               last_name,
                               school_student_id,
                               email):
        if school_staff_profile:
            school = school_staff_profile.school

        if StudentProfile.objects.filter(school=school,school_student_id=school_student_id):
            raise ValidationError('Student profile already exists')

        username = f'{school.initials.lower()}_{school_student_id}'
        group = get_student_group()

        user = create_user(username=username,group=group,email=email)

        student_profile = StudentProfile(
            first_name=first_name,
            last_name=last_name,
            school_student_id=school_student_id,
            school=school,
            user=user
        )

        student_profile.full_clean()
        student_profile.save()

        return student_profile
