from django.db import transaction
from rest_framework.serializers import ValidationError

from apps.school.models.school_year import SchoolYear

from shared.utils.helper.school import get_user_school

@transaction.atomic
def create_school_year(*,school_staff_profile,name,start_date,end_date):
    school = get_user_school(school_staff_profile)
    current_school_year = SchoolYear.objects.filter(school=school).order_by('-created_at').first()
    if current_school_year and current_school_year.is_current_school_year:
        raise ValidationError('Current school year is active, update it instead')
    

    school_year = SchoolYear(
        school=school,
        name=name,
        start_date=start_date,
        end_date=end_date,
    )

    school_year.full_clean()
    school_year.save()
    
    return school_year