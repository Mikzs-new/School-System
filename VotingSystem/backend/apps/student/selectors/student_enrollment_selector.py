from apps.student.models.student_enrollment import StudentEnrollment

from django.contrib.auth.models import Group

class StudentEnrollmentSelector:
    @staticmethod
    def get_accessible_school(user, school):
        if user.is_staff:
            return school
        elif hasattr(user,'school_staff_profile'):
            return user.school_staff_profile.school
        
        return None
