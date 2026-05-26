from rest_framework import serializers

from apps.authentication.models.student_profile import StudentProfile
from apps.authentication.models.school_staff_profile import SchoolStaffProfile

from apps.student.api.serializers.nested import SmallStudentSchoolYearSerializer

class StudentProfileListSerializer(serializers.ModelSerializer):
    student = SmallStudentSchoolYearSerializer(read_only=True)
    class Meta:
        model = StudentProfile
        fields = ['id', 'full_name', 'student_school_id','student']

class SchoolStaffProfileListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolStaffProfile
        fields = ['id','full_name','staff_type']