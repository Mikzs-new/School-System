from django.db import transaction
from rest_framework.serializers import ValidationError

from apps.authentication.models.student_profile import StudentProfile

from apps.student.models.student_enrollment import StudentEnrollment

from shared.utils.auth.groups import get_student_group

from shared.utils.helper.school import get_current_school_year, is_current_school_year_active
from shared.utils.helper.create_user import create_user


class StudentService:
    @staticmethod
    @transaction.atomic
    def create_student(*,school_staff_profile,validated_data):
        school = school_staff_profile.school
        is_current_school_year_active(school)

        current_school_year = get_current_school_year(school=school)
        group = get_student_group()
        school_student_id = validated_data['school_student_id']
        
        if StudentProfile.objects.filter(school=school,school_student_id=school_student_id).exists():
            raise ValidationError('Student already exists in records, add new enrollment instead')

        username = f'{school.initials.lower()}_{school_student_id}'
        email = validated_data['email']
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
        course = validated_data['course']
        year_level = validated_data['year_level']

        user = create_user(username=username,email=email,group=group)

        student = StudentProfile.objects.create(
            user=user,
            school=school,
            school_student_id=school_student_id,
            first_name=first_name,
            last_name=last_name,
        )

        StudentEnrollment.objects.create(
            school_year=current_school_year,
            student=student,
            course=course,
            year_level=year_level
        )

        return student
