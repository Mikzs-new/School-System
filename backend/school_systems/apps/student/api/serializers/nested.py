from rest_framework import serializers

from apps.student.models.student_enrollment import StudentEnrollment
from apps.authentication.models.student_profile import StudentProfile

from apps.school.api.serializers.nested import SmallCourseSerializer, SmallSchoolYearSerializer

class SmallStudentInfoSerializer(serializers.ModelSerializer):
    course = SmallCourseSerializer(read_only=True)
    class Meta:
        model = StudentEnrollment
        fields = ['course','year_level']

class SmallStudentSchoolYearSerializer(serializers.ModelSerializer):
    course = SmallCourseSerializer(read_only=True)
    school_year = SmallSchoolYearSerializer(read_only=True)
    class Meta:
        model = StudentEnrollment
        fields = ['school_year','course','year_level']

class SmallStudentSerializer(serializers.ModelSerializer):
    student = serializers.CharField(
        source='student.full_name',
        read_only=True
    )
    course = SmallCourseSerializer(read_only=True)
    class Meta:
        model = StudentEnrollment
        fields = ['student','course','year_level']
