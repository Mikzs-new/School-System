from django.db import transaction
from rest_framework.serializers import ValidationError

from apps.school.models.school_year import SchoolYear

@transaction.atomic
def create_school_year(*,school_staff_profile,school,validated_data):
    current_school_year = SchoolYear.objects.filter(school=school).order_by('-created_at').first()
    if current_school_year and current_school_year.is_current_school_year:
        raise ValidationError('Current school year is active, update it instead')
    
    name = validated_data['name']
    start_date = validated_data['start_date']
    end_date = validated_data['end_date']

    school_year = SchoolYear.objects.create(
        school=school,
        name=name,
        start_date=start_date,
        end_date=end_date,
    )
    
    return school_year