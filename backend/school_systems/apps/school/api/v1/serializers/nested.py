from rest_framework import serializers

from apps.school.models.school import School
from apps.school.models.course import Course
from apps.school.models.school_year import SchoolYear
from apps.school.models.department import Department

class SmallSchoolYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolYear
        fields = ['id','name']

class SmallCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name']

class SmallSchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['name']

class SmallDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name']

