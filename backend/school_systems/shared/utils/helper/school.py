from django.core.exceptions import ValidationError

from apps.school.models.school_year import SchoolYear

def get_current_school_year(school):
    return SchoolYear.objects.filter(school=school).order_by('-created_by').first()

def is_current_school_year_active(school):
    current = SchoolYear.objects.filter(school=school).order_by('-created_by').first()

    if not current:
        raise ValidationError('School year is not configured')
    elif not current.is_current_school_year:
        raise ValidationError('School year is outdated. Add a new one')

def get_user_school(user):
    if user.is_staff:
        return None
    
    if hasattr(user, 'facilitator'):
        return user.school_staff_profile.school
    
    if hasattr(user, 'student'):
        return user.student_profile.school
    
    return None
