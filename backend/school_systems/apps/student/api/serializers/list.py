from rest_framework import serializers

from apps.student.models.student_enrollment import StudentEnrollment
from apps.authentication.models.student_profile import StudentProfile

from apps.authentication.api.serializers.profile.nested import SmallStudentSerializer
from apps.school.api.serializers.nested import SmallSchoolYearSerializer
from .nested import SmallStudentInfoSerializer

class StudentListSerializer(serializers.ModelSerializer):
    enrollments = SmallStudentInfoSerializer(read_only=True)
    class Meta:
        model = StudentProfile
        fields = ['id','full_name','student_id','enrollments']

class StudentEnrollmentListSerializer(serializers.ModelSerializer):
    student = SmallStudentSerializer(many=True,read_only=True)
    school_year = SmallSchoolYearSerializer(many=True,read_only=True)
    class Meta:
        model = StudentEnrollment
        fields = ['id','school_year','student']