from django.db import transaction
from rest_framework.serializers import ValidationError

from apps.student.models.student_enrollment import StudentEnrollment
from shared.utils.helper.school import get_current_school_year, is_current_school_year_active

class StudentEnrollmentService:
    @staticmethod
    @transaction.atomic
    def enroll_student(school_staff,school,validated_data):
        

        student = validated_data['student']

        is_current_school_year_active(school)

        current_school_year = get_current_school_year(school=school)

        if StudentEnrollment.objects.filter(student=student).exists():
            raise ValidationError('Student already has info in current school year. Update it instead')
        
        course = validated_data['course']
        year_level = validated_data['year_level']

        enrolled_student = StudentEnrollment.objects.create(
            school_year=current_school_year,
            student=student,
            course=course,
            year_level=year_level,
        )

        return enrolled_student