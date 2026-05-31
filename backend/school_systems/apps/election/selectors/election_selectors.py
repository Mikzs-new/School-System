from rest_framework.serializers import ValidationError

from django.db.models import Q

from apps.election.models.election import Election, ElectionStatus
from apps.student.models import StudentEnrollment

class ElectionSelector:

    @staticmethod
    def get_queryset(user):
        qs = Election.objects.all()
        if user.is_staff:
            return qs
        elif hasattr(user, 'school_staff_profile'):
            return qs.filter(school_year__school=user.school_staff_profile.school)
        elif hasattr(user, 'student_profile'):

            student_profile = user.student_profile
            
            enrollments = StudentEnrollment.objects.filter(
                student=student_profile
            )

            if not enrollments:
                raise ValidationError('Student is not enrolled')

            query = Q()

            for enrollment in enrollments:
                query |= Q(
                    school_year=enrollment.school_year,
                    valid_courses__course=enrollment.course,
                    valid_year_levels__year_level=enrollment.year_level
                )

            status = [ElectionStatus.ENABLED, ElectionStatus.ENDED]
            return qs.filter(query, status__in=status).distinct()
        
        return qs.none()

