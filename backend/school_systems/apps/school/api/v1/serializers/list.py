from rest_framework import serializers

from apps.school.models import School, Course, Department, SchoolYear

from .nested import SmallDepartmentSerializer, SmallSchoolSerializer

class SchoolListSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id','name','school_id','email']

class SchoolYearListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolYear
        fields = ['id','name','start_date','end_date']

class DepartmentListSerializer(serializers.ModelSerializer):
    school = SmallSchoolSerializer(read_only=True)
    class Meta:
        model = Department
        fields = ['id','name','school']

class CourseListSerializer(serializers.ModelSerializer):
    department = SmallDepartmentSerializer(read_only=True)
    class Meta:
        model = Course
        fields = ['id','name','department','school']