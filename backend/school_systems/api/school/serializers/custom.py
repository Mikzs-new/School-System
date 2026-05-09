from rest_framework import serializers

from school.models import Course, School, Department

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




    
