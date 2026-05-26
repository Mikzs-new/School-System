from rest_framework import serializers

from apps.school.models.school import School
from apps.school.models.school_year import SchoolYear
from apps.school.models.course import Course
from apps.school.models.department import Department

from .nested import SmallSchoolSerializer, SmallCourseSerializer, SmallDepartmentSerializer, SmallSchoolYearSerializer

from apps.student.api.serializers.nested import SmallStudentSerializer

class SchoolDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['name','initials','school_id','complete_address','email']

class DepartmentDetailSerializer(serializers.ModelSerializer):
    school = SmallSchoolSerializer(read_only=True)
    courses = SmallCourseSerializer(read_only=True, many=True)
    class Meta:
        model = Department
        fields = ['name','school','courses']

class CourseDetailSerializer(serializers.ModelSerializer):
    department = SmallDepartmentSerializer(read_only=True)
    class Meta:
        model = Course
        fields = ['name','department','school']

class SchoolYearDetailSerializer(serializers.ModelSerializer):
    students = SmallStudentSerializer(many=True,read_only=True)
    class Meta:
        model = SchoolYear
        fields = ['id','name','start_date','end_date','added_by','students']

