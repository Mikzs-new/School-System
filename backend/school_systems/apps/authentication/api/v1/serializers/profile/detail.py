from rest_framework import serializers

from apps.authentication.models.student_profile import StudentProfile
from apps.authentication.models.school_staff_profile import SchoolStaffProfile

from apps.school.api.v1.serializers.nested import SmallCourseSerializer, SmallSchoolSerializer
from apps.student.api.v1.serializers.nested import SmallStudentSchoolYearSerializer

class StudentProfileDetailSerializer(serializers.ModelSerializer):
    course = SmallCourseSerializer(read_only=True)
    school = SmallSchoolSerializer(read_only=True)
    infos = SmallStudentSchoolYearSerializer(many=True,read_only=True)
    email = serializers.EmailField(source='user.email',read_only=True)
    class Meta:
        model = StudentProfile
        fields = ['full_name','school_student_id','school','infos','email','created_at']

class SchoolStaffDetailSerializer(serializers.ModelSerializer):
    school = SmallSchoolSerializer(read_only=True)
    email = serializers.EmailField(source='user.email',read_only=True)
    class Meta:
        model = SchoolStaffProfile
        fields = ['full_name', 'school_staff_id','staff_type', 'school', 'email','created_at']
