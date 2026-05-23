from rest_framework import serializers

from apps.school.models.school import School
from apps.school.models.course import Course
from apps.school.models.department import Department
from apps.school.models.school_year import SchoolYear

from shared.utils.helper.school import get_user_school

class SchoolCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['name','school_id','country','region','province','city','barangay','postal_code','street','email','initials']
    
class SchoolYearCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolYear
        fields = ['name','start_date','end_date']

class DepartmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name','school']

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name','school','department']

