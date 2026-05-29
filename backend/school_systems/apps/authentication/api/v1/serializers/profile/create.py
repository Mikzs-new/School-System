from rest_framework import serializers

from apps.authentication.models.student_profile import StudentProfile
from apps.authentication.models.school_staff_profile import SchoolStaffProfile

from apps.school.models.school import School

class StudentProfileCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    class Meta:
        model = StudentProfile
        fields = ['first_name','last_name','school_student_id','school','email']

class SchoolStaffProfileCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    class Meta:
        model = SchoolStaffProfile
        fields = ['first_name','last_name','school_staff_id','school','email']