from rest_framework import serializers

from apps.student.models.student_enrollment import StudentEnrollment
from apps.authentication.models.student_profile import StudentProfile

from apps.authentication.api.v1.serializers.profile.nested import SmallStudentSerializer
from apps.school.api.v1.serializers.nested import SmallSchoolYearSerializer
from .nested import SmallStudentInfoSerializer, SmallStudentNameSerialzer

class StudentListSerializer(serializers.ModelSerializer):
    enrollments = SmallStudentInfoSerializer(read_only=True)
    class Meta:
        model = StudentProfile
        fields = ['id','full_name','school_student_id','enrollments']

class StudentEnrollmentListSerializer(serializers.ModelSerializer):
    student = SmallStudentNameSerialzer(read_only=True)
    class Meta:
        model = StudentEnrollment
        fields = ['id','student']